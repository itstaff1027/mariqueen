<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return inertia('Admin/Users/Page', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();
        return inertia('Admin/Users/Create/Page', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'array', // Array of role IDs
        ]);
    
        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
    
        // Fetch roles by IDs
        $roles = Role::whereIn('id', $request->roles)->get();
    
        // Assign roles
        if ($roles->isNotEmpty()) {
            $user->syncRoles($roles->pluck('name')->toArray()); // Pass role names
        }

        // if($request->roles){
        //     $user->syncRoles($request->roles);
        // }
    
        // Send email verification notification
        $user->sendEmailVerificationNotification();
    
        return redirect()->route('admin-users.index')->with('success', 'User created successfully and verification email sent!');
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
        $user = User::findOrFail($id);
        $roles = Role::all();
        return inertia('Admin/Users/Edit/Page', [
            'user' => $user,
            'roles' => $roles,
            'userRoles' => User::with('roles')->findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         // Validation
         $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'array',
        ]);

        // Find user and update
        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        // Sync roles
        if ($request->roles) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin-users.index')->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin-users.index')->with('success', 'User deleted successfully!');
    }
}
