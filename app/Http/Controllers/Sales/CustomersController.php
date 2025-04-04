<?php

namespace App\Http\Controllers\Sales;

use Illuminate\Http\Request;
use App\Models\Sales\Customers;
use App\Http\Controllers\Controller;

class CustomersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Sales/Customers/Page', [
            'Customers' => Customers::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Sales/Customers/Create/Page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'receiver_name' => 'required|string|max:255',
        ]);

        Customers::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'receiver_name' => $request->receiver_name,
            'social_media_account' => $request->social_media_account,
            'gender' => $request->gender, 
            'birthday'=> $request->birthday, 
            'age' => $request->age, 
            'region' => $request->region, 
            'province' => $request->province, 
            'city' => $request->city, 
            'brgy' => $request->brgy, 
            'street' => $request->street, 
            'zip_code' => $request->zip_code
        ]);
        
        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
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
        // dd(Customers::findOrFail($id));
        return inertia('Sales/Customers/Edit/Page', [
            'customer' => Customers::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'receiver_name' => 'required|string|max:255',
        ]);

        $customer = Customers::findOrFail($id);
        $customer->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'receiver_name' => $request->receiver_name,
            'social_media_account' => $request->social_media_account,
            'gender' => $request->gender, 
            'birthday'=> $request->birthday, 
            'age' => $request->age, 
            'region' => $request->region, 
            'province' => $request->province, 
            'city' => $request->city, 
            'brgy' => $request->brgy, 
            'street' => $request->street, 
            'zip_code' => $request->zip_code
        ]);
        
        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Customers::findOrFail($id)->delete();

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
