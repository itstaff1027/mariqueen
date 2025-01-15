<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RoleHasPermission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminController extends Controller
{
    public function index()
    {
        // $role = Role::findOrFail(1);
        // $permissions = Permission::all(); // Retrieve all permissions
        // $role->givePermissionTo($permissions); 


        $roles = Role::with('permissions')->get();

        return inertia('Admin/Page', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();

        return inertia('Admin/Create/Page', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('admin-panel.index')->with('success', 'Role created successfully!');
    }

    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $role_has_permission = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all();
        // dd($role);
        return Inertia::render('Admin/Edit/Page', [
            'role' => $role,
            'permissions' => $permissions,
            'role_has_permission' => $role_has_permission
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
            'permissions' => 'array',
        ]);

        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('admin-panel.index')->with('success', 'Role updated successfully!');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('admin-panel.index')->with('success', 'Role deleted successfully!');
    }
}
