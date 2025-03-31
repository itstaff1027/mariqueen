<?php

namespace App\Http\Controllers\Inventory;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Sales\PackagingTypes;

class PackagingTypeController extends Controller
{
    public function index(){
        return inertia('Inventory/PackagingTypes/Page',[
            'packaging_types' => PackagingTypes::all()
        ]);
    }

    public function create(){
        return inertia('Inventory/PackagingTypes/Create/Page');
    }

    public function store(Request $request){
        $request->validate([
            'packaging_name' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        PackagingTypes::create([
            'packaging_name' => $request->packaging_name,
            'description' => $request->description,
            'created_at' => Carbon::now()
        ]);

        return redirect()->route('inventory_packaging_types.index')->with('succes', 'Packaging Type Succesfully Added!');
    }

    public function edit(string $id){
        return inertia('Inventory/PackagingTypes/Edit/Page', [
            'packaging_type' => PackagingTypes::findOrFail($id)
        ]);
    }

    public function update(Request $request, string $id){
        $request->validate([
            'packaging_name' => 'required|string|max:255',
            'description' => 'required|string'
        ]);


        $packaging_type = PackagingTypes::findOrFail($id);

        $packaging_type->update([
            'packaging_name' => $request->packaging_name,
            'description' => $request->description,
            'update_at' => Carbon::now()
        ]);

        return redirect()->route('inventory_packaging_types.index')->with('success', 'Successfully Updated Packaging Type!');
    }

    public function destroy(string $id){
        PackagingTypes::findOrFail($id)->delete();

        return redirect()->route('inventory_packaging_types.index')->with('success', 'Succesfully Deleted Packaging Type!');
    }
}
