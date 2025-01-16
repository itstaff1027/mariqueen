<?php

namespace App\Http\Controllers\GlobalSettings;

use App\Models\Categories;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::all();
        return inertia('Settings/Categories/Page', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $categories = Categories::all();
        return inertia('Settings/Categories/Create/Page', [
            // 'categories' => $categories
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
            'label' => 'required|string|max:255'
        ]);

        Categories::create([
            'category_name' => $request->name,
            'category_label' => $request->label
        ]);

        return redirect()->route('settings_categories.index')->with('success', 'Categoriess created successfully!');
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
        $categories = Categories::findOrFail($id);
        return inertia('Settings/Categories/Edit/Page', [
            'category' => $categories
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
            'label' => 'required|string|max:255',
        ]);

        $categories = Categories::findOrFail($id);
        $categories->update([
            'category_name' => $request->name,
            'category_label' => $request->label
        ]);

        return redirect()->route('settings_categories.index')->with('success', 'Categoriess Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categories = Categories::findOrFail($id);
        $categories->delete();

        return redirect()->route('settings_categories.index')->with('success', 'Categoriess Deleted successfully!');
    }
}
