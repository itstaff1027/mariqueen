<?php

namespace App\Http\Controllers\GlobalSettings;

use App\Models\Size;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sizes = Size::all();
        return inertia('Settings/Sizes/Page', [
            'sizes' => $sizes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $sizes = Size::all();
        return inertia('Settings/Sizes/Create/Page', [
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
            'name' => 'required|string|max:255',
        ]);

        Size::create(['size_name' => $request->name]);

        return redirect()->route('settings_sizes.index')->with('success', 'Sizes created successfully!');
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
        $sizes = Size::findOrFail($id);
        return inertia('Settings/Sizes/Edit/Page', [
            'sizes' => $sizes
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
        ]);

        $size = Size::findOrFail($id);
        $size->update(['size_name' => $request->name]);

        return redirect()->route('settings_sizes.index')->with('success', 'Sizes Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $size = Size::findOrFail($id);
        $size->delete();

        return redirect()->route('settings_sizes.index')->with('success', 'Sizes Deleted successfully!');
    }

}
