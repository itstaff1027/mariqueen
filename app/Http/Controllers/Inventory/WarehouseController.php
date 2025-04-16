<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Size;
use App\Models\User;
use App\Models\Color;
use App\Models\Warehouse;
use App\Models\Categories;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use App\Models\StockLevels;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Models\StockMovements;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class WarehouseController extends Controller
{
    public function index()
    {
        $Warehouse = Warehouse::all();
        return inertia('Inventory/Warehouses/Page', [
            'Warehouses' => $Warehouse
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $Warehouse = Warehouse::all();
        return inertia('Inventory/Warehouses/Create/Page', [
            // 'Warehouses' => $Warehouse
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
            'location' => 'required|string|max:255'
        ]);

        Warehouse::create([
            'name' => $request->name,
            'location' => $request->location
        ]);

        return redirect()->route('warehouses.index')->with('success', 'Warehouses created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
    
        $product_variants = StockMovements::select(
                'product_variant_id',
                'warehouse_id',
                DB::raw("SUM(total_stock) as total_stock")
            )
            ->fromSub(function ($query) use ($id) {
                // Incoming stock: purchase and transfer_in
                $query->select(
                        'product_variant_id',
                        'to_warehouse_id as warehouse_id',
                        DB::raw("SUM(quantity) as total_stock")
                    )
                    ->from('stock_movements')
                    ->whereIn('movement_type', ['purchase', 'transfer_in', 'return'])
                    ->where('to_warehouse_id', $id)
                    ->groupBy('product_variant_id', 'to_warehouse_id')
                    ->unionAll(
                        // Outgoing stock: transfer_out
                        StockMovements::select(
                            'product_variant_id',
                            'from_warehouse_id as warehouse_id',
                            DB::raw("SUM(quantity) as total_stock")
                        )
                        ->from('stock_movements')
                        ->whereIn('movement_type', ['transfer_out', 'sale'])
                        ->where('from_warehouse_id', $id)
                        ->groupBy('product_variant_id', 'from_warehouse_id')
                    );
            }, 'stock_summary')
            ->groupBy('product_variant_id', 'warehouse_id')
            ->with([
                'productVariant', 
                'productVariant.product', 
                'productVariant.colors', 
                'productVariant.categories', 
                'productVariant.sizes', 
                'productVariant.size_values',
                'productVariant.heelHeights', 
                'warehouse'
            ])
            ->get();
    
        return inertia('Inventory/Warehouses/View/Page', [
            'warehouse'   => $warehouse,
            'products'    => $product_variants,
            'colors'      => Color::all(),
            'sizes'       => Size::all(),
            'size_values' => SizeValues::all(),
            'heel_heights'=> HeelHeight::all(),
            'categories'  => Categories::all(),
        ]);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $Warehouse = Warehouse::findOrFail($id);
        return inertia('Inventory/Warehouses/Edit/Page', [
            'Warehouses' => $Warehouse
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
            'location' => 'required|string|max:255',
        ]);

        $Warehouse = Warehouse::findOrFail($id);
        $Warehouse->update([
            'name' => $request->name,
            'location' => $request->location
        ]);

        return redirect()->route('warehouses.index')->with('success', 'Warehouses Updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $Warehouse = Warehouse::findOrFail($id);
        $Warehouse->delete();

        return redirect()->route('warehouses.index')->with('success', 'Warehouses Deleted successfully!');
    }

    public function showLedger(Request $request, $warehouseId)
    {
        // Set default date range if not provided
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->endOfMonth()->toDateString());
    
        $warehouse = Warehouse::findOrFail($warehouseId);
    
        // Get product variants that have any relevant stock movements in this warehouse.
        $productVariants = \App\Models\ProductVariant::whereHas('stockMovements', function ($query) use ($warehouseId) {
                $query->where('to_warehouse_id', $warehouseId)
                      ->orWhere('from_warehouse_id', $warehouseId);
            })
            ->with([
                'product',       // e.g., contains product_name, sku, etc.
                'colors',
                'sizes',
                'size_values',
                'heelHeights',
                'categories',
            ])->get();
            // ->paginate(5);
                
        // Extract the product variant IDs.
        $productVariantIds = $productVariants->pluck('id');
    
        // Calculate opening balance for each product variant (all transactions before the start date).
        // Incoming transactions (purchase, transfer_in) add quantity if to_warehouse_id matches.
        // Outgoing transactions (transfer_out, sale) subtract quantity if from_warehouse_id matches.
        $openingBalances = StockMovements::select(
            'product_variant_id',
            DB::raw("SUM(
                CASE 
                    WHEN movement_type IN ('purchase', 'transfer_in', 'return') AND to_warehouse_id = {$warehouseId} THEN quantity
                    WHEN movement_type IN ('transfer_out', 'sale') AND from_warehouse_id = {$warehouseId} THEN quantity
                    ELSE 0
                END
            ) as opening_balance")
        )
        ->whereIn('product_variant_id', $productVariantIds)
        ->whereDate('created_at', '<', $startDate)
        ->groupBy('product_variant_id')
        ->get()
        ->keyBy('product_variant_id');
    
        // Get aggregated transactions for the period (startDate to endDate),
        // grouping by product_variant_id and the date (trans_date) and by movement_type.
        $transactionsAggregated = StockMovements::select(
            'product_variant_id',
            DB::raw("DATE(created_at) as trans_date"),
            'movement_type',
            DB::raw("SUM(
                CASE 
                    WHEN movement_type IN ('purchase', 'transfer_in', 'return') AND to_warehouse_id = {$warehouseId} THEN quantity
                    WHEN movement_type IN ('transfer_out', 'sale') AND from_warehouse_id = {$warehouseId} THEN quantity
                    ELSE 0
                END
            ) as total_change")
        )
        ->whereIn('product_variant_id', $productVariantIds)
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('product_variant_id', DB::raw("DATE(created_at)"), 'movement_type')
        ->orderBy(DB::raw("DATE(created_at)"))
        ->get();
    
        // Build ledger for each product variant by grouping transactions by date.
        $ledgers = [];
        foreach ($productVariantIds as $variantId) {
            // Opening balance from before the start date (or 0 if none)
            $opening = $openingBalances->has($variantId) ? $openingBalances[$variantId]->opening_balance : 0;
            $running = $opening;
            $ledgerByDate = [];
    
            // Filter transactions for this variant.
            $txs = $transactionsAggregated->where('product_variant_id', $variantId);
    
            // Group transactions by date.
            $groupedByDate = [];
            foreach ($txs as $tx) {
                $date = $tx->trans_date;
                if (!isset($groupedByDate[$date])) {
                    $groupedByDate[$date] = [];
                }
                $groupedByDate[$date][] = [
                    'movement_type' => $tx->movement_type,
                    'total_change'  => $tx->total_change,
                ];
            }
    
            // Sort dates ascending.
            ksort($groupedByDate);
    
            // For each date, compute the daily net change and update running balance.
            foreach ($groupedByDate as $date => $entries) {
                $dailyNet = 0;
                foreach ($entries as $entry) {
                    $dailyNet += $entry['total_change'];
                }
                $running += $dailyNet;
                // Store the entries and daily summary.
                $ledgerByDate[$date] = [
                    'entries'         => $entries,
                    'daily_net'       => $dailyNet,
                    'running_balance' => $running,
                ];
            }
    
            $ledgers[$variantId] = [
                'opening_balance' => $opening,
                'byDate'          => $ledgerByDate,
            ];
        }
    
        return inertia('Inventory/Warehouses/Ledger/Page', [
            'warehouse'        => $warehouse,
            'ledgers'          => $ledgers,
            'product_variants' => $productVariants,
            'startDate'        => $startDate,
            'endDate'          => $endDate,
        ]);
    }
    
    
    

}
