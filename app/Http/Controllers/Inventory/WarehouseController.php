<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class WarehouseController extends Controller
{
    public function index()
    {
        $Warehouse = Warehouse::all();
        return inertia('Inventory/Warehouses/Page', [
            'Warehouses' => $Warehouse
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $Warehouse = Warehouse::all();
        return inertia('Inventory/Warehouses/Create/Page', [
            // 'Warehouses' => $Warehouse
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255'
        ]);

        Warehouse::create([
            'name' => $request->name,
            'location' => $request->location
        ]);

        return redirect()->route('warehouses.index')->with('success', 'Warehouses created successfully!');
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
        $Warehouse = Warehouse::findOrFail($id);
        return inertia('Inventory/Warehouses/Edit/Page', [
            'Warehouses' => $Warehouse
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // dd($request);
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        $Warehouse = Warehouse::findOrFail($id);
        $Warehouse->update([
            'name' => $request->name,
            'location' => $request->location
        ]);

        return redirect()->route('warehouses.index')->with('success', 'Warehouses Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Warehouse = Warehouse::findOrFail($id);
        $Warehouse->delete();

        return redirect()->route('warehouses.index')->with('success', 'Warehouses Deleted successfully!');
    }
}
