<?php

namespace App\Http\Controllers\Admin;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

class UserRoutesController extends Controller
{
    public function index()
    {

        return inertia('Admin/Routes/Page', [
            'roles' => Role::with(['permissions', 'routes'])->get()
        ]);
    }

    public function edit(string $id)
    {
        $role = Role::with(['routes'])->findOrFail($id);
        $routes = Route::getRoutes();
        $getRoutes = collect($routes)->filter(function ($route) {
            return in_array('GET', $route->methods());
        });

        // First filter routes with a name, then map them.
        $routeNames = $getRoutes->filter(function ($route) {
            return $route->getName() !== null;
        })->map(function ($route, $index) {
            return [
                'id'   => $index,
                'name' => $route->getName()
            ];
        })->values(); // re-index the collection

        // dd($routeNames);

        return inertia('Admin/Routes/Edit/Page', [
            'routes' => $routeNames,
            'role' => $role
        ]);
    }


    public function store(Request $request)
    {
        // Retrieve the role or throw an error if it doesn't exist
        $role = Role::findOrFail($request->role_id);

        // Delete all authorized routes for this role
        DB::table('authorized_roles')
            ->where('role_id', $role->id)
            ->delete();

        // Prepare new authorized routes for bulk insertion
        $newRoutes = array_map(function ($routeName) use ($role) {
            return [
                'role_id'    => $role->id,
                'route_name' => $routeName,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $request->assigned_routes);

        // Insert new authorized routes in a single query
        DB::table('authorized_roles')->insert($newRoutes);

        // Optionally, return a response or redirect
        return redirect()->route('admin-routes.index')->with('success', 'Authorized routes updated successfully.');
    }
}
