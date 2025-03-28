<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Size;
use App\Models\Color;
use App\Models\Product;
use App\Models\Categories;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Models\StockMovements;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'colors',
            'sizes',
            'size_values',
            'heelHeights',
            'categories',
            'variants'
        ]);
        
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('category_id', $request->category);
            });
        }
        
        if ($request->filled('size')) {
            $query->whereHas('sizes', function ($q) use ($request) {
                $q->where('size_id', $request->size);
            });
        }
        
        if ($request->filled('size_value')) {
            $query->whereHas('size_values', function ($q) use ($request) {
                $q->where('size_value_id', $request->size_value);
            });
        }
        
        if ($request->filled('heel_height')) {
            $query->whereHas('heelHeights', function ($q) use ($request) {
                $q->where('heel_height_id', $request->heel_height);
            });
        }
        
        if ($request->filled('color')) {
            $query->whereHas('colors', function ($q) use ($request) {
                $q->where('color_id', $request->color);
            });
        }
        

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('product_name', 'like', "%{$searchTerm}%");
            });
        }

        $products = $query->paginate(15)->withQueryString();

        // dd($products);

        return inertia('Inventory/Products/Page', [
            'products' => $products,
            'colors' => Color::all(),
            'sizes' => Size::all(),
            'size_values' => SizeValues::all(),
            'heel_heights' => HeelHeight::all(),
            'categories' => Categories::all(),
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

    public function show_product_variant($id)
    {
        $product = ProductVariant::with([
            'product',
            'colors',
            'sizes',
            'size_values',
            'heelHeights',
            'categories',
            'stockMovements.warehouse' // Ensure warehouse details are included
        ])
        ->first(); // Using first() to return a single product variant
        
        $stockPerWarehouse = StockMovements::with([
            'warehouse',
            'productVariant',
            'productVariant.product',
            'productVariant.colors',
            'productVariant.sizes',
            'productVariant.size_values',
            'productVariant.heelHeights',
            'productVariant.categories',
        ])
        ->where('product_variant_id', $id)
        ->selectRaw("
            product_variant_id,
            CASE 
                WHEN movement_type IN ('purchase', 'transfer_in', 'return') THEN to_warehouse_id 
                ELSE from_warehouse_id 
            END as warehouse_id,
            SUM(quantity) as total_stock,
            SUM(CASE WHEN movement_type = 'purchase' THEN quantity ELSE 0 END) as total_purchased,
            SUM(CASE WHEN movement_type = 'sale' THEN quantity ELSE 0 END) as total_sold,
            SUM(CASE WHEN movement_type = 'return' THEN quantity ELSE 0 END) as total_return,
            SUM(CASE WHEN movement_type = 'adjustment' THEN quantity ELSE 0 END) as total_adjustment,
            SUM(CASE WHEN movement_type = 'correction' THEN quantity ELSE 0 END) as total_correction,
            SUM(CASE WHEN movement_type = 'repair' THEN quantity ELSE 0 END) as total_repair,
            SUM(CASE WHEN movement_type = 'transfer_in' THEN quantity ELSE 0 END) as total_transfer_in,
            SUM(CASE WHEN movement_type = 'transfer_out' THEN quantity ELSE 0 END) as total_transfer_out
        ")
        ->groupBy(DB::raw("
            CASE 
                WHEN movement_type IN ('purchase', 'transfer_in', 'return') THEN to_warehouse_id 
                ELSE from_warehouse_id 
            END,
            product_variant_id
        "))
        ->get();

            // dd($stockPerWarehouse);
        return inertia('Inventory/Products/Variants/Page', [
            'product_variant' => $product,
            'stock_per_warehouse' => $stockPerWarehouse,
        ]);
    }
    

    public function store_variants(Request $request){
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
