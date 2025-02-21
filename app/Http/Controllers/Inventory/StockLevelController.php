<?php

namespace App\Http\Controllers\Inventory;

use App\Models\StockMovements;
use App\Models\Warehouse;
use App\Models\StockLevels;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class StockLevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $stocks = StockLevels::with(['productVariant', 'productVariant.product', 'product.colors', 'product.sizes', 'product.categories', 'product.heelHeights'])
        // ->selectRaw('product_variant_id, SUM(quantity) as total_quantity')
        // ->groupBy('product_variant_id')
        // ->get();

        $products = ProductVariant::with([
            'product',
            'colors',
            'sizes',
            'size_values',
            'heelHeights',
            'categories',
            'stockLevels',
            'stockMovements'
        ])
        ->withSum(['stockMovements as total_purchased' => function ($query) {
            $query->where('movement_type', 'purchase');
        }], 'quantity')
        ->withSum(['stockMovements as total_sold' => function ($query) {
            $query->where('movement_type', 'sale');
        }], 'quantity')
        ->withSum(['stockMovements as total_transfer' => function ($query) {
            $query->where('movement_type', 'transfer');
        }], 'quantity')
        ->withSum(['stockMovements as total_return' => function ($query) {
            $query->where('movement_type', 'return');
        }], 'quantity')
        ->withSum(['stockMovements as total_adjustment' => function ($query) {
            $query->where('movement_type', 'adjustment');
        }], 'quantity')
        ->withSum(['stockMovements as total_correction' => function ($query) {
            $query->where('movement_type', 'correction');
        }], 'quantity')
        ->withSum(['stockMovements as total_repair' => function ($query) {
            $query->where('movement_type', 'repair');
        }], 'quantity')
        ->get();
        
        
        // dd($products);
        return inertia('Inventory/Products/Stock/Page', [
            'products' => $products
        ]);
    }

    public function transfer_stocks()
    {
        // Fetch all warehouses
        $warehouses = Warehouse::all();
    
    
        // Fetch stock levels per warehouse
        $stock_levels = StockMovements::select(
            'product_variant_id',
            'to_warehouse_id',
            DB::raw("SUM(quantity) as total_stock")
        )
        ->with(['productVariant', 'warehouse']) // Include product variant and warehouse details
        ->groupBy('product_variant_id', 'to_warehouse_id') // Group by product and warehouse
        ->get();
    
    
        // Return data to Inertia frontend
        return inertia('Inventory/Products/Stock/Transfer/Page', [
            // 'product_variants' => $product_variants,
            'warehouses' => $warehouses,
            'stock_levels' => $stock_levels
        ]);
    }

    public function store_transferStock(Request $request)
    {
        $validated = $request->validate([
            'transfers' => 'required|array',
            'transfers.*.id' => 'required|exists:product_variants,id',
            'transfers.*.quantity' => 'required|integer|min:1',
            'transfers.*.from_warehouse_id' => 'required|exists:warehouses,id',
            'transfers.*.to_warehouse_id' => 'required|exists:warehouses,id',
            'transfers.*.remarks' => 'required|string|max:255',
        ]);
    
        DB::transaction(function () use ($validated) {
            foreach ($validated['transfers'] as $transfer) {
                $stockMovementsToInsert = [];
    
                // ✅ Check available stock before transfer
                $availableStock = StockLevels::where('product_variant_id', $transfer['id'])
                    ->where('warehouse_id', $transfer['from_warehouse_id'])
                    ->sum('quantity');
    
                if ($availableStock < $transfer['quantity']) {
                    throw new \Exception("Not enough stock in source warehouse for SKU {$transfer['id']}.");
                }
    
                // 🔹 Process each unit separately
                for ($i = 0; $i < $transfer['quantity']; $i++) {
                    // ✅ 1️⃣ Deduct stock from source warehouse (transfer_out)
                    StockLevels::where('product_variant_id', $transfer['id'])
                        ->where('warehouse_id', $transfer['from_warehouse_id'])
                        ->limit(1)
                        ->delete();
    
                    // ✅ 2️⃣ Log stock movement (Outgoing Transfer)
                    $stockMovementsToInsert[] = [
                        'product_variant_id' => $transfer['id'],
                        'from_warehouse_id' => $transfer['from_warehouse_id'],
                        'to_warehouse_id' => $transfer['to_warehouse_id'],
                        'movement_type' => 'transfer_out', // ✅ Now using transfer_out
                        'quantity' => -1, // Negative quantity for outgoing stock
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
    
                    // ✅ 3️⃣ Add stock to destination warehouse (transfer_in)
                    StockLevels::updateOrCreate(
                        [
                            'product_variant_id' => $transfer['id'],
                            'warehouse_id' => $transfer['to_warehouse_id'],
                        ],
                        [
                            'quantity' => DB::raw('quantity + 1'),
                            'updated_at' => now(),
                        ]
                    );
    
                    // ✅ 4️⃣ Log stock movement (Incoming Transfer)
                    $stockMovementsToInsert[] = [
                        'product_variant_id' => $transfer['id'],
                        'from_warehouse_id' => $transfer['from_warehouse_id'],
                        'to_warehouse_id' => $transfer['to_warehouse_id'],
                        'movement_type' => 'transfer_in', // ✅ Now using transfer_in
                        'quantity' => 1, // Positive quantity for incoming stock
                        'remarks' => $transfer['remarks'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
    
                // 🔹 Bulk insert StockMovements for efficiency
                StockMovements::insert($stockMovementsToInsert);
            }
        });
    
        return redirect()->route('stocks.index')->with('success', 'Product updated successfully!');
    }
    

    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $product_variants = ProductVariant::all();
        return inertia('Inventory/Products/Stock/Add/Page', [
            'product_variants' => $product_variants,
            'warehouses' => Warehouse::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->rows[0]['remarks']);
        $validated = $request->validate([
            'rows' => 'required|array',
            'rows.*.id' => 'required|exists:product_variants,id',
            'rows.*.quantity' => 'required|integer|min:1',
            'rows.*.warehouse_id' => 'required|exists:warehouses,id',
            'rows.*.remarks' => 'required|string|max:255'
        ]);
    
        DB::transaction(function () use ($validated) {
            foreach ($validated['rows'] as $row) {
                // dd($row);
                $stockLevelsToInsert = [];
                $stockMovementsToInsert = [];

                for ($i = 0; $i < $row['quantity']; $i++) {
                    // Prepare rows for stock_levels
                    $stockLevelsToInsert[] = [
                        'product_variant_id' => $row['id'],
                        'warehouse_id' => $row['warehouse_id'],
                        'quantity' => 1, // Always 1 quantity per 
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Prepare rows for stock_movements
                    $stockMovementsToInsert[] = [
                        'product_variant_id' => $row['id'],
                        'to_warehouse_id' => $row['warehouse_id'],
                        'movement_type' => 'purchase',
                        'quantity' => 1, // Always 1 quantity per row
                        'remarks' => $row['remarks'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Bulk insert into stock_levels
                StockLevels::insert($stockLevelsToInsert);

                // Bulk insert into stock_movements
                StockMovements::insert($stockMovementsToInsert);
            }
        });

        return redirect()->route('stocks.index')->with('success', 'Product updated successfully!');
    }
    


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $products = ProductVariant::with(['product', 'colors', 'sizes', 'size_values', 'heelHeights', 'categories', 'stockLevels.warehouse', 'stockMovements.warehouse'])->find($id);
        // dd($products);
        return inertia('Inventory/Products/Stock/Page', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
