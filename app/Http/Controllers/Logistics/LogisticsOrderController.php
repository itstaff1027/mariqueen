<?php

namespace App\Http\Controllers\Logistics;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LogisticsOrderController extends Controller
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
            'user'
        ])
        ->orderBy('created_at', 'desc')->whereIn('status', ['preparing', 'shipped', 'delivered']);
        
        if($request->filled('customer_name')){
            $query->whereHas('customer_name', function ($q) use ($request) {
                $q->where('customer_id', $request->customer_id);
            });
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
                ->orWhere('status', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $sales_orders = $query->paginate(15);
        return inertia('Logistics/Orders/Page', [
            'sales_orders' => $sales_orders,
        ]);
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
            'discounts',
            'courier',
            'packagingType'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Logistics/Orders/View/Page', [
            'sales_order' => $sales_order,
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $sales_order = SalesOrders::with([
            'customers',
            'payments',
            'payments.paymentMethod',
            'items',
            'items.productVariant',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Logistics/Orders/Edit/Page', [
            'sales_order' => $sales_order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = SalesOrders::findOrFail($id);
        DB::transaction( function () use ($request, $order) {
            $order->update([
                'tracking_number' => $request->tracking_number,
                'update_at' => Carbon::now()
            ]);
        });
        
        return redirect()->route('logistics_orders.index')->with('success', 'Successfully added Tracking number: '. $request->tracking_number .' - at Order # : ' . $order->order_number);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

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

        return redirect()->route('logistics_orders.index')->with('success', 'Successfully Updated Sales Order Status');
    }
}
