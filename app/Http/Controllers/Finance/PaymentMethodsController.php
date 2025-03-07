<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\PaymentMethods;
use Illuminate\Http\Request;

class PaymentMethodsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payment_methods = PaymentMethods::all();
        // dd($heel_height);
        return inertia('Finance/ModeOfPayments/Page', [
            'payment_methods' => $payment_methods
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Finance/ModeOfPayments/Create/Page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|integer|max:1|min:0'
        ]);

        PaymentMethods::create([
            'name' => $request->name,
            'is_active' => $request->is_active
        ]);

        return redirect()->route('payment_methods.index')->with('success', 'Colors created successfully!');
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
        return inertia('Finance/ModeOfPayments/Edit/Page', [
            'payment_method' => PaymentMethods::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|integer|max:1|min:0'
        ]);

        $payment_method = PaymentMethods::findOrFail($id);

        $payment_method->update([
            'name' => $request->name,
            'is_active' => $request->is_active
        ]);

        return redirect()->route('payment_methods.index')->with('success', 'Colors created successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payment_method = PaymentMethods::findOrFail($id);

        $payment_method->delete();

        return redirect()->route('payment_methods.index')->with('success', 'Colors created successfully!');
    }
}
