<?php

namespace App\Http\Controllers\GlobalSettings;

use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $color = Color::all();
        return inertia('Settings/Colors/Page', [
            'colors' => $color
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $color = Color::all();
        return inertia('Settings/Colors/Create/Page', [
            // 'colors' => $color
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
            'hex' => 'required|string|max:255'
        ]);

        Color::create([
            'color_name' => $request->name,
            'hex' => $request->hex
        ]);

        return redirect()->route('settings_colors.index')->with('success', 'Colors created successfully!');
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
        $color = Color::findOrFail($id);
        return inertia('Settings/Colors/Edit/Page', [
            'colors' => $color
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
            'hex' => 'required|string|max:255',
        ]);

        $Color = Color::findOrFail($id);
        $Color->update([
            'color_name' => $request->name,
            'hex' => $request->hex
        ]);

        return redirect()->route('settings_colors.index')->with('success', 'Colors Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Color = Color::findOrFail($id);
        $Color->delete();

        return redirect()->route('settings_colors.index')->with('success', 'Colors Deleted successfully!');
    }
}
