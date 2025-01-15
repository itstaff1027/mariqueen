<?php

namespace App\Http\Controllers\GlobalSettings;

use App\Models\Size;
use App\Models\SizeValues;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SizeValueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd()
        $values = SizeValues::all();
        return inertia('Settings/Sizes/Values/Page', [
            'size_values' => $values
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $sizes = Size::all();
        return inertia('Settings/Sizes/Values/Create/Page', [
            // 'sizes' => $sizes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request);
        $request->validate([
            'size_value' => 'required|string|max:255',
        ]);

        // Split the input string into an array using a comma as a delimiter
        $values = explode(',', $request->size_value);

        // Trim any whitespace around each value and insert them
        foreach ($values as $value) {
            SizeValues::create([
                'size_values' => trim($value),
                'size_id' => $request->size_id,
            ]);
        }

        return redirect()->back()->with('success', 'Sizes created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        // dd($id);
        $size = Size::findOrFail($id);
        $size_values = SizeValues::where('size_id', '=',$id)->get();
        // dd($size);
        return inertia('Settings/Sizes/Values/Page', [
            'size' => $size,
            'size_values' => $size_values
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $sizeValues = SizeValues::findOrFail($id);
        return inertia('Settings/Sizes/Values/Edit/Page', [
            'sizes_values' => $sizeValues
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // dd($request);
        $request->validate([
            'value' => 'required|string|max:255',
        ]);

        $size = SizeValues::findOrFail($id);
        $size->update(['size_value' => $request->value]);

        return redirect()->route('settings_sizes/values.index')->with('success', 'Sizes created successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sizeValues = SizeValues::where('id',$id);
        $sizeValues->delete();

        return redirect()->back()->with('success', 'Sizes created successfully!');
    }
}
