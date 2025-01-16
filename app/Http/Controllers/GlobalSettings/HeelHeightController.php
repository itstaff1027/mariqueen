<?php

namespace App\Http\Controllers\GlobalSettings;

use App\Models\HeelHeight;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HeelHeightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $heel_heights = HeelHeight::all();
        // dd($heel_height);
        return inertia('Settings/HeelHeights/Page', [
            'heel_heights' => $heel_heights
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $HeelHeight = HeelHeight::all();
        return inertia('Settings/HeelHeights/Create/Page', [
            // 'HeelHeights' => $HeelHeight
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
            'value' => 'required|string|max:255'
        ]);

        HeelHeight::create([
            'name' => $request->name,
            'value' => $request->value
        ]);

        return redirect()->route('settings_heel-heights.index')->with('success', 'Heel Heights created successfully!');
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
        $heel_height = HeelHeight::findOrFail($id);
        return inertia('Settings/HeelHeights/Edit/Page', [
            'heel_height' => $heel_height
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
            'value' => 'required|string|max:255',
        ]);

        $heel_height = HeelHeight::findOrFail($id);
        $heel_height->update([
            'name' => $request->name,
            'value' => $request->value
        ]);

        return redirect()->route('settings_heel-heights.index')->with('success', 'Heel Heights Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $heel_height = HeelHeight::findOrFail($id);
        $heel_height->delete();

        return redirect()->route('settings_heel-heights.index')->with('success', 'Heel Heights Deleted successfully!');
    }
}
