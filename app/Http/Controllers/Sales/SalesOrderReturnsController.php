<?php

namespace App\Http\Controllers\Sales;

use App\Models\StockMovements;
use Carbon\Carbon;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Sales\SalesOrderReturns;
use App\Models\Sales\SalesOrderReturnItems;

class SalesOrderReturnsController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();

        $query = SalesOrderReturns::with([
            'referenceOrder',
            'referenceOrder.customers',
        ])
        ->orderBy('created_at', 'desc');

        // Flatten all permissions from all roles into one collection
        $permissions = $user->roles->flatMap(function ($role) {
            return $role->permissions;
        });

        // Check if any permission has the name 'view'
        $hasPermission = $permissions->contains(function ($permission) {
            return $permission->name === 'view';
        });

        if($hasPermission) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('fromDate')) {
            $query->whereDate('created_at', '>=', $request->fromDate);
        }
        if ($request->filled('toDate')) {
            $query->whereDate('created_at', '<=', $request->toDate);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('return_number', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $sales_order_returns = $query->paginate(20);
        return inertia('Sales/Returns/Page', [
            'sales_order_returns' => $sales_order_returns
        ]);
    }

    public function create(Request $request){
        $sales_order = null; // Default state is no data
    
        // Only query if the order identifier is provided
        if ($request->has('sales_order_id') || $request->has('order_number')) {
            $query = SalesOrders::with(
                'items',
                'items.productVariant',
                'items.productVariant.product',
                'items.productVariant.colors',
                'items.productVariant.size_values',
                'items.productVariant.heelHeights'
            );
    
            if ($request->sales_order_id) {
                $query->where('id', $request->sales_order_id);
            }
            if ($request->order_number) {
                $query->where('order_number', $request->order_number);
            }
            
            $sales_order = $query->first();
            // dd($sales_order);
        }
    
        return inertia('Sales/Returns/Create/Page', [
            'sales_order' => $sales_order,
            'sales_orders' => SalesOrders::all(),
            'warehouses' => Warehouse::all(),
        ]);
    }
    
    public function store(Request $request){
        $request->validate([
            'sales_order_number' => 'required|exists:sales_orders,order_number',
            'return_date' => 'required|date',
            'warehouse_id' => 'required|exists:warehouses,id',
            'remarks' => 'required',
            'items' => 'required|array'
        ]);

        $user = Auth::user();

        // dd($request);
        
        DB::transaction(function() use ($request, $user) {
            $sales_order_return = SalesOrderReturns::create(
            [
                'return_number' => 'RO-' . str_pad(SalesOrderReturns::max('id') + 1, 6, '0', STR_PAD_LEFT),
                'sales_order_id' => $request->sales_order_id,
                'return_type' => 'return',
                'return_date' => $request->return_date,
                'status' => 'pending',
                'warehouse_id' => $request->warehouse_id,
                'user_id' => $user->id,
                'remarks' => $request->remarks,
            ]);

            $saleOrderReturnItemsToInsert = [];
            foreach ($request->items as $item) {
                $returnQuantity = $item['returnQuantity'];
                $sales_order_item_id = $item['id'];
                $saleOrderReturnItemsToInsert[] = [
                    'sales_order_return_id' => $sales_order_return->id,
                    'sales_order_item_id' => $sales_order_item_id,
                    'quantity' => $returnQuantity,
                    'reason' => $request->remarks,
                    'created_at' => Carbon::now()
                ];
            }

            SalesOrderReturnItems::insert($saleOrderReturnItemsToInsert);
        });

        return redirect()->route('sales_order_returns.index')->with('success', 'Sales Order Return created successfully');
    }
    
    public function edit(string $id) {

        $sales_order_return = SalesOrderReturns::with([
            'referenceOrder',
            'referenceOrder.customers',
            'returnItems',
            'referenceOrder',
            'referenceOrder.items.productVariant.product',
            'referenceOrder.items.productVariant.colors',
            'referenceOrder.items.productVariant.size_values',
            'referenceOrder.items.productVariant.heelHeights',
            'returnItems.salesOrderItems.productVariant.product',
            'returnItems.salesOrderItems.productVariant.colors',
            'returnItems.salesOrderItems.productVariant.size_values',
            'returnItems.salesOrderItems.productVariant.heelHeights',
            'warehouse'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Sales/Returns/Edit/Page', [
            'sales_order_return' => $sales_order_return,
            'warehouses' => Warehouse::all()
        ]);
    }

    public function update(Request $request, string $id) {
        // dd($id);

        $request->validate([
           'return_date' => 'required|date',
           'warehouse_id' => 'required|exists:warehouses,id',
           'items' => 'required|array',
           'remarks' => 'required' 
        ]);
        DB::transaction(function() use ($request, $id) {
            $return_order = SalesOrderReturns::with([
                'referenceOrder',
                'returnItems',
            ])->findOrFail($id);

            $return_order->update([
                'return_date' => $request->return_date,
                'warehouse_id' => $request->warehouse_id,
                'remarks' => $request->remarks,
                'updated_at' => Carbon::now()
            ]);

            foreach($request->items as $item){
                $sales_order_item_id = $item['id'];
                $returnQuantity = $item['returnQuantity'];
                SalesOrderReturnItems::updateOrCreate(
                    // Conditions: find an existing record for these keys.
                    [
                        'sales_order_return_id' => $id,
                        'sales_order_item_id'   => $sales_order_item_id,
                    ],
                    // Values: update these fields (or create them if no record exists).
                    [
                        'quantity' => $returnQuantity,
                        'reason'   => $request->remarks,
                    ]
                );
            }

            // Now, determine which existing return items are not present in the request and delete them.
            // 1. Get all the sales_order_item_ids provided in the request:
            $requestedItemIds = collect($request->items)->pluck('id')->toArray();

            // 2. Get existing sales_order_item_ids in the DB for this return:
            $existingItemIds = SalesOrderReturnItems::where('sales_order_return_id', $id)
                                ->pluck('sales_order_item_id')
                                ->toArray();

            // 3. Determine IDs that are in the DB but not in the request:
            $itemIdsToDelete = array_diff($existingItemIds, $requestedItemIds);

            if (!empty($itemIdsToDelete)) {
                // Delete those items that were removed in the front end.
                SalesOrderReturnItems::where('sales_order_return_id', $id)
                    ->whereIn('sales_order_item_id', $itemIdsToDelete)
                    ->delete();
            }
        });

        return redirect()->route('sales_order_returns.index')->with('success', 'Sales Order Return updated successfully');
    }

    public function show(string $id){
        $sales_order_return = SalesOrderReturns::with([
            'referenceOrder',
            'referenceOrder.customers',
            'returnItems',
            'referenceOrder',
            'referenceOrder.items.productVariant.product',
            'referenceOrder.items.productVariant.colors',
            'referenceOrder.items.productVariant.size_values',
            'referenceOrder.items.productVariant.heelHeights',
            'returnItems.salesOrderItems.productVariant.product',
            'returnItems.salesOrderItems.productVariant.colors',
            'returnItems.salesOrderItems.productVariant.size_values',
            'returnItems.salesOrderItems.productVariant.heelHeights',
            'warehouse'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Sales/Returns/View/Page', [
            'sales_order_return' => $sales_order_return,
        ]);
    }

    public function update_status(Request $request, string $id){
        // dd($request);
        DB::transaction(function() use ($request, $id) {
            $sales_order_return = SalesOrderReturns::with([
                'referenceOrder',
                'returnItems',
                'returnItems.salesOrderItems.productVariant.product',
                'returnItems.salesOrderItems.productVariant.colors',
                'returnItems.salesOrderItems.productVariant.size_values',
                'returnItems.salesOrderItems.productVariant.heelHeights',
            ])->findOrFail($id);

            // dd($sales_order_return);
        
            // Determine the new status based on the request value
            $updatedStatus = $request->new_status == 'cancel' ? 'cancelled' : $request->new_status;
        
            // Update the record
            $sales_order_return->update([
                'status' => $updatedStatus,
            ]);
        
            // Refresh the model to ensure we have the latest data
            $sales_order_return->refresh();

            $sales_order_return->load([
                'referenceOrder',
                'returnItems',
                'returnItems.salesOrderItems.productVariant'
            ]);
            // Check if the updated status is 'complete'
            if ($sales_order_return->status === 'complete') {
                $stockMovementsToInsert = [];
                // dd($sales_order_return->returnItems);
                foreach($sales_order_return->returnItems as $returnItem) {
                    $stockMovementsToInsert[] = [
                        'product_variant_id' => $returnItem->salesOrderItems->productVariant->id,
                        'sales_order_id' => $sales_order_return->referenceOrder->id,
                        'to_warehouse_id' => $sales_order_return->warehouse_id,
                        'movement_type' => 'return',
                        'quantity' => 1,
                        'remarks' => $sales_order_return->remarks,
                        'created_at' => now(),
                    ];
                }
                StockMovements::insert($stockMovementsToInsert);
            }
        });
        
        return redirect()->route('sales_order_returns.index')->with('success', 'Sales Order Return updated successfully');
    }

}
