<?php

namespace App\Http\Controllers\Inventory;

use App\Models\UserWarehouse;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\User;

class AssignUserToWarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $Warehouses = Warehouse::all();
        $users = User::all();
        $assigned_users = UserWarehouse::all();
        // dd($users);
        return inertia('Inventory/Warehouses/Assign/Page', [
            'warehouses' => $Warehouses,
            'users' => $users,
            'assignedUsers' => $assigned_users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $Warehouses = Warehouse::all();
        $users = User::all();
        // $assigned_users = UserWarehouse::all();
        // dd($users);
        return inertia('Inventory/Warehouses/Assign/Create/Page', [
            'warehouses' => $Warehouses,
            'users' => $users,
            // 'assignedUsers' => $assigned_users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'warehouse_id' => 'required|integer',
            'user_ids' => 'required|array'
        ]); 
    
        // Extract only user IDs from array of objects
        $userIds = collect($request->user_ids)->pluck('id');

        $warehouse = Warehouse::findOrFail($request->warehouse_id);
        $warehouse->user_warehouse()->sync($userIds);
    
        return redirect()->route('warehouses.index')->with('success', 'Users assigned to warehouse successfully!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $Warehouses = Warehouse::findOrFail($id);
        // dd($Warehouses);
        $users = User::all();
        $assigned_users = UserWarehouse::all();
        // dd($users);
        return inertia('Inventory/Warehouses/Assign/Page', [
            'warehouses' => $Warehouses,
            'users' => $users,
            'assignedUsers' => $assigned_users
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
        $user = UserWarehouse::where('user_id', '=', $id)->first();

        $user->delete();

        return redirect()->route('warehouses.index')->with('success', 'Users assigned to warehouse successfully!');
    }
}
