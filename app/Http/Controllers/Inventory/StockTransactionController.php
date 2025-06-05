<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Requests\Inventory\StockTransactions\StoreStockTransactions;
use App\Models\Warehouse;
use App\Models\StockLevels;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use App\Models\StockMovements;
use App\Models\StockTransactions;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\StockTransactionItems;

class StockTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockTransactions::OrderBy('created_at', 'desc');

        if($request->filled('fromWarehouse')){
            $query->where('from_warehouse_id', $request->fromWarehouse);
        }
        if($request->filled('toWarehouse')){
            $query->where('to_warehouse_id', $request->toWarehouse);
        }
        if($request->filled('transactionType')){
            $query->where('transaction_type', $request->transactionType);
        }
        if($request->filled('status')){
            $query->where('status', $request->status);
        }

        if ($request->filled('fromDate')) {
            $query->whereDate('created_at', '>=', $request->fromDate);
        }
        if ($request->filled('toDate')) {
            $query->whereDate('created_at', '<=', $request->toDate);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id', '=', "{$searchTerm}");
            });
        }

        $transactions = $query->paginate(15)->withQueryString();

        $warehouses = Warehouse::all();
        return inertia('Inventory/Products/Stock/Transactions/Page', [
            'stock_transactions' => $transactions,
            'warehouses' => $warehouses
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch all warehouses
        $warehouses = Warehouse::all();
        $product_variants = ProductVariant::all();
    
        // Fetch stock levels per warehouse
        $stock_levels = StockMovements::select(
            'product_variant_id',
            'to_warehouse_id',
            DB::raw("SUM(quantity) as total_stock")
        )
        ->with(['productVariant', 'warehouse']) // Include product variant and warehouse details
        ->groupBy('product_variant_id', 'to_warehouse_id') // Group by product and warehouse
        ->get();

        return inertia('Inventory/Products/Stock/Transactions/Create/Page', [
            'product_variants' => $product_variants,
            'warehouses' => $warehouses,
            'stock_levels' => $stock_levels
        ]);
    }

    public function get_stock_movements(string $id){
        $stock_levels = StockMovements::select(
            'product_variant_id',
            'warehouse_id',
            DB::raw("SUM(stock_change) as total_stock")
        )
        ->fromSub(function ($query) {
            $query->select(
                'product_variant_id',
                'to_warehouse_id as warehouse_id',
                DB::raw("SUM(quantity) as stock_change")
            )
            ->from('stock_movements')
            ->whereIn('movement_type', ['purchase', 'transfer_in', 'return'])
            ->groupBy('product_variant_id', 'to_warehouse_id')

            ->unionAll(
                StockMovements::select(
                    'product_variant_id',
                    'from_warehouse_id as warehouse_id',
                    DB::raw("SUM(quantity) * 1 as stock_change")
                )
                ->whereIn('movement_type', ['transfer_out', 'sale'])
                ->groupBy('product_variant_id', 'from_warehouse_id')
            );
        }, 'stock_summary')
        ->where('warehouse_id', $id)
        ->groupBy('product_variant_id', 'warehouse_id')
        ->with(['productVariant'])
        ->get();

        return json_encode($stock_levels);
    }

    public function store(StoreStockTransactions $request)
    {
        $validated = $request->validated();
    
        DB::transaction(function () use ($validated) {
            // ✅ 1️⃣ Insert into `stock_transactions`
            $stockTransaction = StockTransactions::create([
                'transaction_type' => $validated['transaction_type'],
                'status' => 'draft', // Default status
                'remarks' => $validated['remarks'],
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'created_by' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    
            $stockTransactionItems = [];
    
            // ✅ 2️⃣ Insert Products into `stock_transaction_items`
            foreach ($validated['products'] as $product) {
                $stockTransactionItems[] = [
                    'stock_transaction_id' => $stockTransaction->id,
                    'product_variant_id' => $product['product_variant_id'],
                    'quantity' => $product['quantity'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
    
            StockTransactionItems::insert($stockTransactionItems);
        });
    
        return redirect()->route('transactions.index')->with('success', 'Stock transaction recorded successfully!');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store_stocksITOYUNGPWEDENGGAWINAFTERAPPROVE(Request $request)
    {
        $validated = $request->validate([
            'transactions' => 'required|array',
            'transactions.*.product_variant_id' => 'required|exists:product_variants,id',
            'transactions.*.quantity' => 'required|integer|min:1',
            'transactions.*.from_warehouse_id' => 'nullable|exists:warehouses,id',
            'transactions.*.to_warehouse_id' => 'required|exists:warehouses,id',
            'transactions.*.transaction_type' => 'required|in:purchase,return,adjustment,correction,repair,transfer',
            'transactions.*.status' => 'required|in:draft,pending,approved,rejected',
            'transactions.*.remarks' => 'nullable|string|max:255',
        ]);
    
        DB::transaction(function () use ($validated) {
            foreach ($validated['transactions'] as $transaction) {
                $productVariantId = $transaction['product_variant_id'];
                $fromWarehouseId = $transaction['from_warehouse_id'];
                $toWarehouseId = $transaction['to_warehouse_id'];
                $transactionType = $transaction['transaction_type'];
                $quantity = $transaction['quantity'];
                $status = $transaction['status'];
                $remarks = $transaction['remarks'] ?? 'Stock transaction processed';
    
                $stockMovementsToInsert = [];
    
                if ($transactionType === 'transfer') {
                    // ✅ Check available stock before transferring
                    $availableStock = StockLevels::where('product_variant_id', $productVariantId)
                        ->where('warehouse_id', $fromWarehouseId)
                        ->sum('quantity');
    
                    if ($availableStock < $quantity) {
                        throw new \Exception("Not enough stock in source warehouse for SKU {$productVariantId}.");
                    }
    
                    // ✅ Deduct stock one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::where('product_variant_id', $productVariantId)
                            ->where('warehouse_id', $fromWarehouseId)
                            ->decrement('quantity', 1);
    
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => $fromWarehouseId,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => 'transfer_out',
                            'quantity' => -1, // Negative for outgoing stock
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
    
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => $fromWarehouseId,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => 'transfer_in',
                            'quantity' => 1, // Positive for incoming stock
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
    
                    // ✅ Batch Insert Stock Movements
                    StockMovements::insert($stockMovementsToInsert);
    
                    // ✅ Add stock to destination warehouse one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::updateOrCreate(
                            [
                                'product_variant_id' => $productVariantId,
                                'warehouse_id' => $toWarehouseId,
                            ],
                            [
                                'quantity' => DB::raw("quantity + 1"),
                                'updated_at' => now(),
                            ]
                        );
                    }
                } else {
                    // ✅ Process Purchases, Returns, Adjustments, etc.
                    for ($i = 0; $i < $quantity; $i++) {
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => null,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => $transactionType,
                            'quantity' => 1,
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
    
                    // ✅ Batch Insert Stock Movements
                    StockMovements::insert($stockMovementsToInsert);
    
                    // ✅ Add stock to warehouse one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::updateOrCreate(
                            [
                                'product_variant_id' => $productVariantId,
                                'warehouse_id' => $toWarehouseId,
                            ],
                            [
                                'quantity' => DB::raw("quantity + 1"),
                                'updated_at' => now(),
                            ]
                        );
                    }
                }
            }
        });
    
        return redirect()->route('transactions.index')->with('success', 'Stock transaction processed successfully!');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // dd($id);
        $transaction = StockTransactions::with(['productVariant.stockMovements', 'items', 'items.productVariant'])->findOrFail($id);
        // dd($transaction);
        // Fetch all warehouses
        $warehouses = Warehouse::all();
        $product_variants = ProductVariant::all();

        // Extract all relevant product_variant_ids
        $variantIds = $transaction->items->pluck('product_variant_id')->toArray();
        // dd($variantIds);

        // Fetch stock levels per warehouse
        $stock_levels = StockMovements::select(
            'product_variant_id',
            'warehouse_id',
            DB::raw("SUM(stock_change) as total_stock")
        )
        ->fromSub(function ($query) {
            $query->select(
                'product_variant_id',
                'to_warehouse_id as warehouse_id',
                DB::raw("SUM(quantity) as stock_change")
            )
            ->from('stock_movements')
            ->whereIn('movement_type', ['purchase', 'transfer_in', 'return'])
            ->groupBy('product_variant_id', 'to_warehouse_id')

            ->unionAll(
                StockMovements::select(
                    'product_variant_id',
                    'from_warehouse_id as warehouse_id',
                    DB::raw("SUM(quantity) * 1 as stock_change")
                )
                ->whereIn('movement_type', ['transfer_out', 'sale'])
                ->groupBy('product_variant_id', 'from_warehouse_id')
            );
        }, 'stock_summary')
        ->whereIn('product_variant_id', $variantIds)
        ->whereNotNull('warehouse_id')
        ->groupBy('product_variant_id', 'warehouse_id')
        ->get();

        return inertia('Inventory/Products/Stock/Transactions/Edit/Page', [
            'stock_transaction' => $transaction,
            'product_variants' => $product_variants,
            'warehouses' => $warehouses,
            'transaction_items' => $transaction->items,
            'stock_levels' => $stock_levels
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
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'remarks' => 'nullable|string|max:255',
            'products' => 'array|required',
            'products.*.product_variant_id' => 'required|exists:product_variants,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $transaction = StockTransactions::findOrFail($id);

        // ✅ Update only allowed fields
        $transaction->update([
            'remarks' => $validated['remarks'],
            'updated_at' => now(),
        ]);

        // ✅ Sync stock transaction items
        $transaction->items()->delete(); // Remove old items

        foreach ($validated['products'] as $product) {
            $transaction->items()->create([
                'product_variant_id' => $product['product_variant_id'],
                'quantity' => $product['quantity'],
            ]);
        }

        return redirect()->route('transactions.index')->with('success', 'Stock transaction updated successfully!');
    }

    public function update_status_to_pending(string $id){
        // dd($id);
        $transaction = StockTransactions::findOrFail($id);

        $transaction->update(['status' => 'pending']);
        return redirect()->route('transactions.index')->with('success', 'Stock transaction updated successfully!');
    }

    public function update_status_to_approved(string $id){
        DB::transaction(function () use ($id) {

            $transaction = StockTransactions::findOrFail($id);
            $transaction->update(['status' => 'approved']);

            $items = StockTransactionItems::where('stock_transaction_id', '=', $id)->get();

            // $rowStockLevels = $items->map(fn($item) => [
            //     'product_variant_id' => $item->product_variant_id,
            //     'warehouse_id'       => $transaction['to_warehouse_id'],
            //     'quantity'           => $item->quantity,
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ])->toArray();
            // // dd($rowStockLevels);
            // StockLevels::insert($rowStockLevels);

            // $rowStockMovements = $items->map(fn($item) => [
            //     'product_variant_id' => $item->product_variant_id,
            //     'from_warehouse_id' => $transaction['from_warehouse_id'],
            //     'to_warehouse_id' => $transaction['to_warehouse_id'],
            //     'movement_type' => $transaction['to_warehouse_id'],
            //     'quantity' => $item->quantity, // Negative for outgoing stock
            //     'remarks' => $transaction['remarks'],
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ])->toArray();
            // StockMovements::insert($rowStockMovements);

            foreach ($items as $item) {
                $productVariantId = $item['product_variant_id'];
                $fromWarehouseId = $transaction['from_warehouse_id'];
                $toWarehouseId = $transaction['to_warehouse_id'];
                $transactionType = $transaction['transaction_type'];
                $quantity = $item['quantity'];
                $status = $transaction['status'];
                $remarks = $transaction['remarks'] ?? 'Stock transaction processed';
    
                $stockMovementsToInsert = [];
    
                if ($transactionType === 'transfer') {
                    // ✅ Check available stock before transferring
                    $availableStock = StockMovements::select(
                        'product_variant_id',
                        'warehouse_id',
                        DB::raw("SUM(stock_change) as total_stock")
                    )
                    ->fromSub(function ($query) {
                        $query->select(
                            'product_variant_id',
                            'to_warehouse_id as warehouse_id',
                            DB::raw("SUM(quantity) as stock_change")
                        )
                        ->from('stock_movements')
                        ->whereIn('movement_type', ['purchase', 'transfer_in', 'return'])
                        ->groupBy('product_variant_id', 'to_warehouse_id')
            
                        ->unionAll(
                            StockMovements::select(
                                'product_variant_id',
                                'from_warehouse_id as warehouse_id',
                                DB::raw("SUM(quantity) * 1 as stock_change")
                            )
                            ->whereIn('movement_type', ['transfer_out', 'sale'])
                            ->groupBy('product_variant_id', 'from_warehouse_id')
                        );
                    }, 'stock_summary')
                    ->where('product_variant_id', $productVariantId)
                    ->where('warehouse_id', $fromWarehouseId)
                    ->groupBy('product_variant_id', 'warehouse_id')
                    ->first();
                    // dd($availableStock);
                    if ($availableStock->total_stock < $quantity) {
                        throw new \Exception("Not enough stock in source warehouse for SKU {$productVariantId}.");
                    }
    
                    // ✅ Deduct stock one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::where('product_variant_id', $productVariantId)
                            ->where('warehouse_id', $fromWarehouseId)
                            ->decrement('quantity', 1);
    
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => $fromWarehouseId,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => 'transfer_out',
                            'quantity' => -1, // Negative for outgoing stock
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
    
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => $fromWarehouseId,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => 'transfer_in',
                            'quantity' => 1, // Positive for incoming stock
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
    
                    // ✅ Batch Insert Stock Movements
                    StockMovements::insert($stockMovementsToInsert);
    
                    // ✅ Add stock to destination warehouse one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::updateOrCreate(
                            [
                                'product_variant_id' => $productVariantId,
                                'warehouse_id' => $toWarehouseId,
                            ],
                            [
                                'quantity' => DB::raw("quantity + 1"),
                                'updated_at' => now(),
                            ]
                        );
                    }
                } else {
                    // ✅ Process Purchases, Returns, Adjustments, etc.
                    for ($i = 0; $i < $quantity; $i++) {
                        $stockMovementsToInsert[] = [
                            'product_variant_id' => $productVariantId,
                            'from_warehouse_id' => null,
                            'to_warehouse_id' => $toWarehouseId,
                            'movement_type' => $transactionType,
                            'quantity' => 1,
                            'remarks' => $remarks,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
    
                    // ✅ Batch Insert Stock Movements
                    StockMovements::insert($stockMovementsToInsert);
    
                    // ✅ Add stock to warehouse one by one
                    for ($i = 0; $i < $quantity; $i++) {
                        StockLevels::updateOrCreate(
                            [
                                'product_variant_id' => $productVariantId,
                                'warehouse_id' => $toWarehouseId,
                            ],
                            [
                                'quantity' => DB::raw("quantity + 1"),
                                'updated_at' => now(),
                            ]
                        );
                    }
                }
            }
        });


        return redirect()->route('transactions.index')->with('success', 'Stock transaction updated successfully!');
    }

    public function update_status_to_approved_transfer(){

    }

    public function update_status_to_rejected(string $id){
        $transaction = StockTransactions::findOrFail($id);

        $transaction->update(['status' => 'rejected']);
        return redirect()->route('transactions.index')->with('success', 'Stock transaction updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
