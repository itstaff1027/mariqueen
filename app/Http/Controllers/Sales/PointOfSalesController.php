<?php

namespace App\Http\Controllers\Sales;

use App\Models\Size;
use App\Models\User;
use App\Models\Color;
use App\Models\Warehouse;
use App\Models\Categories;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Models\UserWarehouse;
use App\Models\ProductVariant;
use App\Models\StockMovements;
use App\Models\Logistics\Couriers;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Finance\PaymentMethods;

class PointOfSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $user = User::with(['user_warehouse'])->where('id', $user->id)->first();
        // dd($user_warehouse->user_warehouse['id']);
        $warehouseIds = $user->user_warehouse->pluck('id')->toArray();


        // count(): Argument #1 ($value) must be of type Countable|array, int given 

        // dd($warehouseIds);
        $color = Color::all();
        $heel_height = HeelHeight::all();
        $sizes = Size::all();
        $size_values = SizeValues::all();
        $categories = Categories::all();

        $couriers = Couriers::all();
        $payment_methods = PaymentMethods::all();
        $warehouse = Warehouse::all();
        
        $stock_levels = StockMovements::select(
                    'product_variant_id',
                    'warehouse_id',
                    DB::raw("SUM(stock_change) as total_stock")
                )
                ->with([
                    'productVariant.colors', 
                    'productVariant.heelHeights', 
                    'productVariant.sizes',
                    'productVariant.size_values',
                    'productVariant.categories'
                ])
                ->fromSub(function ($query) use ($warehouseIds) {
                    $query->select(
                        'product_variant_id',
                        'to_warehouse_id as warehouse_id',
                        DB::raw("SUM(quantity) as stock_change")
                    )
                    ->from('stock_movements')
                    ->whereIn('movement_type', ['purchase', 'transfer_in'])
                    ->whereIn('to_warehouse_id', $warehouseIds)
                    ->groupBy('product_variant_id', 'to_warehouse_id')
                    ->unionAll(
                        StockMovements::select(
                            'product_variant_id',
                            'from_warehouse_id as warehouse_id',
                            DB::raw("SUM(quantity) * -1 as stock_change")
                        )
                        ->from('stock_movements')
                        ->where('movement_type', 'transfer_out')
                        ->whereIn('from_warehouse_id', $warehouseIds)
                        ->groupBy('product_variant_id', 'from_warehouse_id')
                    );
                }, 'stock_summary')
                ->whereNotNull('warehouse_id')
                ->groupBy('product_variant_id', 'warehouse_id')
                ->get();

        return inertia('Sales/PointOfSales/Page', [
            'stock_levels' => $stock_levels,
            'colors' => $color,
            'heel_heights' => $heel_height,
            'sizes' => $sizes,
            'size_values' => $size_values,
            'categories' => $categories,
            'user_warehouse'=> $user->user_warehouse->first()->name,
            'couriers' => $couriers,
            'payment_methods' => $payment_methods,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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