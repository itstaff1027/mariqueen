<?php

namespace App\Http\Controllers\Inventory;

use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class InventoryOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = SalesOrders::with([
            'customers',
            'payments',
            'courier',
            'warehouse',
            'user',
            'items',
            'items.productVariant',
            'items.productVariant.product',
            'items.productVariant.colors',
            'items.productVariant.size_values',
            'items.productVariant.heelHeights'
        ])->orderBy('created_at', 'desc')->whereIn('status' , ['paid', 'preparing', 'shipped', 'delivered']);

        if($request->filled('customer_name')){
            $query->whereHas('customer_name', function ($q) use ($request) {
                $q->where('customer_id', $request->customer_id);
            });
        }

        if($request->filled('trackingNumber')){
            $query->where('tracking_number', $request->trackingNumber);
        }

        if($request->filled('status')){
            $query->where('status', $request->status);
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
                $q->where('order_number', 'LIKE', "%{$searchTerm}%")
                ->orWhere('tracking_number', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $sales_orders = $query->paginate(15);

        // dd($sales_orders);
        return inertia('Inventory/Orders/Page', [
            'sales_orders' => $sales_orders,
        ]);//
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user()->load(['roles', 'roles.permissions']);
        // $user->permissions = $user->permissions->pluck('name')->toArray();
        // dd($user->rolespermissions);
        $sales_order = SalesOrders::with([
            'customers',
            'payments',
            'payments.paymentMethod',
            'items',
            'items.productVariant',
            'stockMovements',
            'discounts'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Inventory/Orders/View/Page', [
            'sales_order' => $sales_order,
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function update_status(Request $request, string $id)
    {
        // dd($request->new_status);
        $sales_order = SalesOrders::with([
            'payments',
            'payments.paymentMethod',
            'items',
            'items.productVariant',
            'stockMovements',
        ])->findOrFail($id);
    
        // Update the sales order's status.
        $sales_order->update([
            'status' => $request->new_status
        ]);

        if (in_array($request->new_status, [
            'cancelled'
        ])) {
            $sales_order->payments->each(function ($payment) use ($request) {
                $payment->update(['status' => $request->new_status]);
            });
        }
        
        if(in_array($request->new_status, [
            'cancelled'
        ])) {
            // Update each stock movement's status.
            $sales_order->stockMovements->each(function ($movement) use ($request) {
                $movement->update(['movement_type' => $request->new_status]);
            });
        }

        return redirect()->route('inventory_orders.index')->with('success', 'Successfully Updated Sales Order Status');
    }
}
