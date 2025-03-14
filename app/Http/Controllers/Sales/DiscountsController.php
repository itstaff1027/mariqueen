<?php

namespace App\Http\Controllers\Sales;

use Illuminate\Http\Request;
use App\Models\Sales\Discounts;
use App\Http\Controllers\Controller;

class DiscountsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Sales/Discounts/Page', ['discounts' => Discounts::all()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Sales/Discounts/Create/Page');
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
}
