<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RoleHasPermission;
use Spatie\Permission\Models\Permission;

class PermissionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::all();

        return Inertia::render('Admin/Permissions/Page', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Permissions/Create/Page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:permissions',
        ]);

        Permission::create(['name' => $request->name]);

        return redirect()->route('admin-permissions.index')->with('success', 'Permission created successfully!');
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
        $permission = Permission::findOrFail($id);

        return inertia('Admin/Permissions/Edit/Page', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name,' . $id,
        ]);

        $permission = Permission::findOrFail($id);
        $permission->update(['name' => $request->name]);

        return redirect()->route('admin-permissions.index')->with('success', 'Permission updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $hasPermission = RoleHasPermission::where('permission_id', $id)->first();
        
        if(!$hasPermission){
            $permission = Permission::findOrFail($id);
            $permission->delete();

            return redirect()->route('admin-permissions.index')->with('success', 'Permission deleted successfully!');
        }
        
        return redirect()->route('admin-permissions.index')->with('error', 'Permission Delete Denied, Remove any permissions associated with this permision first!');
    }
}
