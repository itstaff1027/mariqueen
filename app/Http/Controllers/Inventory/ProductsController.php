<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Size;
use App\Models\Color;
use App\Models\Product;
use App\Models\Categories;
use App\Models\HeelHeight;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Http\Controllers\Controller;
use App\Models\SizeValues;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return inertia('Inventory/Products/Page', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return inertia('Inventory/Products/Create/Page', [
            'colors' => Color::all(),
            'sizes' => Size::all(),
            'heel_heights' => HeelHeight::all(),
            'categories' => Categories::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'status' => 'required|string',
            'cost' => ['required', 'numeric', 'regex:/^\d+(\.\d{1,2})?$/'],
            'srp' => ['required', 'numeric', 'regex:/^\d+(\.\d{1,2})?$/'],
            'colors' => 'array',
            'sizes' => 'array',
            'heel_heights' => 'array',
            'categories' => 'array',
        ]);

        // Extract only the 'id' from the colors, sizes, heel_heights, and categories arrays
        $colorIds = collect($validated['colors'])->pluck('id');
        $sizeIds = collect($validated['sizes'])->pluck('id');
        $heelHeightIds = collect($validated['heel_heights'])->pluck('id');
        $categoryIds = collect($validated['categories'])->pluck('id');

        $product = Product::create([
            'product_name' => $validated['product_name'],
            'status' => $validated['status'],
            'cost' => $validated['cost'],
            'srp' => $validated['srp'],
        ]);

        $product->colors()->sync($colorIds);
        $product->sizes()->sync($sizeIds);
        $product->heelHeights()->sync($heelHeightIds);
        $product->categories()->sync($categoryIds);

        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    public function show($id){
        $product = Product::with(['colors', 'sizes:id,size_name', 'heelHeights', 'categories', 'sizes.sizeValues'])->find($id);
        $product_variants = ProductVariant::where('product_id', '=',$id)->get();
        // dd(ProductVariant::where('product_id', '=',$id)->get());
        return inertia('Inventory/Products/View/Page', [
            'product' => $product,
            'product_variants' => $product_variants ? $product_variants : [],
            'colors' => Color::all(),
            'sizes' => Size::all(),
            'size_values' => SizeValues::all(),
            'heel_heights' => HeelHeight::all(),
            'categories' => Categories::all(),
        ]);
    }

    public function store_variants(Request $request){
        // dd($request);
        ProductVariant::insert($request->product_variants);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    public function edit($id)
    {
        $product = Product::with(['colors', 'sizes', 'heelHeights', 'categories'])->findOrFail($id);
        return inertia('Inventory/Products/Edit/Page', [
            'product' => $product,
            'colors' => Color::all(),
            'sizes' => Size::all(),
            'size_values' => SizeValues::all(),
            'heel_heights' => HeelHeight::all(),
            'categories' => Categories::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'status' => 'required|string',
            'cost' => ['required', 'numeric', 'regex:/^\d+(\.\d{1,2})?$/'],
            'srp' => ['required', 'numeric', 'regex:/^\d+(\.\d{1,2})?$/'],
            'colors' => 'array',
            'sizes' => 'array',
            'heel_heights' => 'array',
            'categories' => 'array',
        ]);

        // Extract only the 'id' from the colors, sizes, heel_heights, and categories arrays
        $colorIds = collect($validated['colors'])->pluck('id');
        $sizeIds = collect($validated['sizes'])->pluck('id');
        $heelHeightIds = collect($validated['heel_heights'])->pluck('id');
        $categoryIds = collect($validated['categories'])->pluck('id');

        $product = Product::findOrFail($id);
        $product->update([
            'product_name' => $validated['product_name'],
            'status' => $validated['status'],
            'cost' => $validated['cost'],
            'srp' => $validated['srp'],
        ]);

        $product->colors()->sync($colorIds);
        $product->sizes()->sync($sizeIds);
        $product->heelHeights()->sync($heelHeightIds);
        $product->categories()->sync($categoryIds);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }
}
