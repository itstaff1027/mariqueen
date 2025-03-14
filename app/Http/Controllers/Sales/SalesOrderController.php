<?php

namespace App\Http\Controllers\Sales;

use Illuminate\Http\Request;
use App\Models\Sales\Discounts;
use App\Models\Sales\SalesOrders;
use App\Http\Controllers\Controller;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Sales/Orders/Page', ['discounts' => Discounts::all()]);
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
        $request->validate([
            'discount_name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'discount_value' => 'required|string|max:255',
            'is_active' => 'required'
        ]);

        Discounts::create([
            'name' => $request->discount_name,
            'type' => $request->type,
            'value' => $request->discount_value,
            'request' => $request->is_active,
            'created_at' => now()
        ]);

        return redirect()->route('discounts.index')->with('success', 'Succesfully Created a Discounts');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return inertia('Sales/Discounts/Edit/Page', [
            'discount' => Discounts::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'discount_name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'discount_value' => 'required|string|max:255',
            'is_active' => 'required'
        ]);

        $discount = Discounts::findOrFail($id);
        
        $discount->update([
            'name' => $request->discount_name,
            'type' => $request->type,
            'value' => $request->discount_value,
            'is_active' => $request->is_active,
            'updated_at' => now()
        ]);

        return redirect()->route('discounts.index')->with('success', 'Successfully Updated Discounts');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Discounts::findOrFail($id)->delete();
        return redirect()->route('discounts.index')->with('success', 'Successfully Deleted a Discounts');
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
            'pending', 
            'paid', 
            'un-paid', 
            'partial', 
            'cancelled', 
            'refunded'
            ]
        )) {
            $sales_order->payments->each(function ($payment) use ($request) {
                $payment->update(['status' => $request->new_status]);
            });
        }
        
        
        if(in_array($request->new_status, [
                'purchase', 
                'sale', 
                'transfer_in', 
                'transfer_out', 
                'return', 
                'adjustment', 
                'correction', 
                'repair',
                'replacement',
                'cancelled',
                'disposed',
                'shipped',
                'delivered'
            ]
        )){
            // Update each stock movement's status.
            $sales_order->stockMovements->each(function ($movement) use ($request) {
                $movement->update(['movement_type' => $request->new_status]);
            });
        }

        return redirect()->route('point_of_sales.index')->with('success', 'Successfully Updated Sales Order Status');
    }
    
}
