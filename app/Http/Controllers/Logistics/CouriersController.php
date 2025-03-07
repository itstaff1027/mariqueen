<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Logistics\Couriers;
use Illuminate\Http\Request;

class CouriersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $couriers = Couriers::all();
        // dd($heel_height);
        return inertia('Logistics/Couriers/Page', [
            'couriers' => $couriers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Logistics/Couriers/Create/Page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
           'name' => 'required|string|max:255',
           'fixed_shipping_cost' => 'required|string|max:255',
        ]);

        Couriers::create([
            'name' => $request->name,
            'fixed_shipping_cost' => $request->fixed_shipping_cost
        ]);

        return redirect()->route('couriers.index')->with('success', 'Successfully Created Courier');
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
        $courier = Couriers::findOrFail($id);
        return inertia('Logistics/Couriers/Edit/Page', [
            'courier' => $courier
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'fixed_shipping_cost' => 'required|string|max:255'
        ]);

        $courier = Couriers::findOrFail($id);

        $courier->update([
            'name' => $request->name,
            'fixed_shipping_cost' => $request->fixed_shipping_cost
        ]);

        return redirect()->route('couriers.index')->with('success', 'Successfully Updated Courier');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $courier = Couriers::findOrFail($id);
        $courier->delete();

        return redirect()->route('couriers.index')->with('success', 'Successfully Deleted Courier');
    }
}
