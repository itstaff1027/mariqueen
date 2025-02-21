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
    
        // ✅ Get Stock Summary for Each Warehouse (Purchases, Sales, Returns, etc.)
        $stockPerWarehouse = StockMovements::with('warehouse')
        ->where('product_variant_id', $id)
        ->select('to_warehouse_id as warehouse_id')
        ->selectRaw("
            SUM(CASE WHEN movement_type = 'purchase' THEN quantity ELSE 0 END) as total_purchased,
            SUM(CASE WHEN movement_type = 'sale' THEN quantity ELSE 0 END) as total_sold,
            SUM(CASE WHEN movement_type = 'return' THEN quantity ELSE 0 END) as total_return,
            SUM(CASE WHEN movement_type = 'adjustment' THEN quantity ELSE 0 END) as total_adjustment,
            SUM(CASE WHEN movement_type = 'correction' THEN quantity ELSE 0 END) as total_correction,
            SUM(CASE WHEN movement_type = 'repair' THEN quantity ELSE 0 END) as total_repair
        ")
        ->groupBy('to_warehouse_id')
        ->get()
        ->keyBy('warehouse_id'); // ✅ Use `keyBy` for easy lookup

        // ✅ Get Incoming Transfers (Stock Added to Warehouses)
        $transferIn = StockMovements::where('product_variant_id', $id)
        ->where('movement_type', 'transfer_in')
        ->select('to_warehouse_id as warehouse_id')
        ->selectRaw("SUM(quantity) as total_transfer_in")
        ->groupBy('to_warehouse_id')
        ->get()
        ->keyBy('warehouse_id'); // ✅ Grouped by warehouse_id

        // ✅ Get Outgoing Transfers (Stock Removed from Warehouses)
        $transferOut = StockMovements::where('product_variant_id', $id)
        ->where('movement_type', 'transfer_out')
        ->select('from_warehouse_id as warehouse_id')
        ->selectRaw("SUM(quantity) as total_transfer_out")
        ->groupBy('from_warehouse_id')
        ->get()
        ->keyBy('warehouse_id'); // ✅ Grouped by warehouse_id

        // ✅ Merge Incoming & Outgoing Transfers into `stockPerWarehouse`
        $stockPerWarehouse = $stockPerWarehouse->map(function ($stock) use ($transferIn, $transferOut) {
        $warehouseId = $stock->warehouse_id;

            return [
                'warehouse_id' => $warehouseId,
                'warehouse_name' => $stock->warehouse ? $stock->warehouse->name : 'Unknown',
                'total_purchased' => $stock->total_purchased,
                'total_sold' => $stock->total_sold,
                'total_transfer_in' => $transferIn[$warehouseId]->total_transfer_in ?? 0, // ✅ Incoming transfers
                'total_transfer_out' => $transferOut[$warehouseId]->total_transfer_out ?? 0, // ✅ Outgoing transfers
                'total_return' => $stock->total_return,
                'total_adjustment' => $stock->total_adjustment,
                'total_correction' => $stock->total_correction,
                'total_repair' => $stock->total_repair,
                'remaining_stock' => ($stock->total_purchased + ($transferIn[$warehouseId]->total_transfer_in ?? 0))
                                    - ($stock->total_sold + (-($transferOut[$warehouseId]->total_transfer_out ?? 0))) // ✅ Final Stock Calculation
            ];
        });


        return inertia('Inventory/Products/Variants/Page', [
            'product_variant' => $product ?: null,
            'stock_per_warehouse' => $stockPerWarehouse->values(), // ✅ Pass warehouse-wise aggregated data
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
