<?php

namespace App\Http\Controllers\Finance;

use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class FinanceOrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $sales_orders = SalesOrders::with([
            'customers',
            'payments',
        ])
        ->orderBy('created_at', 'desc')->get();
        return inertia('Finance/Orders/Page', [
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
            'discounts'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Finance/Orders/View/Page', [
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
        
        if (in_array($request->new_status, [
            'paid', 
            'un-paid', 
            'partial', 
            'cancelled', 
            'refunded'
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

        return redirect()->route('finance_orders.index')->with('success', 'Successfully Updated Sales Order Status');
    }
}
