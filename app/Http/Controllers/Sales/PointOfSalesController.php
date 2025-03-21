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
use App\Models\Sales\Customers;
use App\Models\Sales\Discounts;
use App\Models\Sales\SalesOrders;
use App\Models\Logistics\Couriers;
use Illuminate\Support\Facades\DB;
use App\Models\Sales\SalesPayments;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Sales\SalesOrderItems;
use App\Models\Finance\PaymentMethods;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class PointOfSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $sales_orders = SalesOrders::with([
            'customers',
            'payments',
        ])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')->get();
        return inertia('Sales/PointOfSales/Page', [
            'sales_orders' => $sales_orders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
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
                            DB::raw("SUM(quantity) * 1 as stock_change")
                        )
                        ->from('stock_movements')
                        ->whereIn('movement_type', ['transfer_out', 'sale'])
                        ->whereIn('from_warehouse_id', $warehouseIds)
                        ->groupBy('product_variant_id', 'from_warehouse_id')
                    );
                }, 'stock_summary')
                ->whereNotNull('warehouse_id')
                ->groupBy('product_variant_id', 'warehouse_id')
                ->havingRaw('SUM(stock_change) > 0')
                ->get();

        return inertia('Sales/PointOfSales/Create/Page', [
            'stock_levels' => $stock_levels,
            'colors' => $color,
            'heel_heights' => $heel_height,
            'sizes' => $sizes,
            'size_values' => $size_values,
            'categories' => $categories,
            'user_warehouse'=> $user->user_warehouse->first()->name,
            'couriers' => $couriers,
            'payment_methods' => $payment_methods,
            'discounts' => Discounts::all(),
            'customers' => Customers::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'cart' => 'required|array',
            'courier_id' => 'required|exists:couriers,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'shipping_cost' => 'required|numeric|min:1',
            'rush_order_fee' => 'nullable|string',
            'total_amount' => 'required|numeric|min:1',
            // 'payment_amount' => 'nullable|string',
            'grand_total' => 'required|numeric|min:1',
            // 'discount_id' => 'nullable|exists:discounts,id',
            'remarks' => 'nullable|string',
            'customer_id' => 'required|exists:customers,id'
        ]);

        // dd($request);

        $user = Auth::user();
        $user = User::with(['user_warehouse'])->where('id', $user->id)->first();
        // dd($user_warehouse->user_warehouse['id']);
        $warehouseIds = $user->user_warehouse->pluck('id')->toArray();

        // dd($request);

        // In your controller, using a transaction for atomicity:
        DB::transaction(function() use ($request, $warehouseIds, $user) {
            // Create the sales order record.
            $order = SalesOrders::create([
                'order_number' => 'SO-' . str_pad(SalesOrders::max('id') + 1, 6, '0', STR_PAD_LEFT), // Generate a unique order number.
                'customer_id' => $request->customer_id,
                'warehouse_id' => $warehouseIds[0],
                'discount_id' => $request->discount_id,
                'courier_id' => $request->courier_id,
                'shipping_cost' => $request->shipping_cost,
                'rush_order_fee' => $request->rush_order_fee ? $request->rush_order_fee : 0,
                'total_amount' => $request->total_amount,   // from your business logic
                'grand_amount' => $request->grand_total,   // after discounts, fees, etc.
                'balance' => $request->payment_amount === 0 || $request->payment_amount < $request->grand_total ? $request->grand_total - $request->payment_amount : $request->payment_amount,
                'status' => 'pending',
                'remarks' => $request->remarks,
                'user_id' => auth()->id(),
            ]);

            $saleOrderItemsToInsert = [];
            foreach($request->cart as $items) {
                $product_variant_id = $items['product_variant_id'];
                $quantity = $items['quantity'];
                $stockMovementsToInsert = [];


                $saleOrderItemsToInsert[] = [
                    'sales_order_id' => $order->id,
                    'product_variant_id' => $product_variant_id,
                    'discount_id' => $items['discount_id'],
                    'quantity' => $items['quantity'],
                    'unit_price' => $items['unit_price'],
                    'total_price' => $items['subtotal'],
                    'discount_amount' => 0
                ];

                for($i = 0; $i < $quantity; $i++) {
                    $stockMovementsToInsert[] = [
                        'sales_order_id' => $order->id,
                        'product_variant_id' => $product_variant_id,
                        'from_warehouse_id' => $warehouseIds[0],
                        'quantity' => -1,
                        'movement_type' => 'sale',
                        'remarks' => 'Sold Item From Order #:' . $order->id . ' From Warehouse:' . $user->name,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                StockMovements::insert($stockMovementsToInsert);

            }
            SalesOrderItems::insert($saleOrderItemsToInsert);

            // Create the payment record.
            $sales_payment = SalesPayments::create([
                'sales_order_id' => $order->id,
                'amount_paid' => $request->payment_amount,
                'change_due' => $request->payment_amount > $request->grand_total ? $request->payment_amount - $request->grand_total : 0,   // calculated from payment amount and grand total
                'remaining_balance' => $request->payment_amount < $request->grand_total ? $request->grand_total - $request->payment_amount : 0,
                'excess_amount' => $request->payment_amount > $request->grand_total ? $request->payment_amount - $request->grand_total : 0,
                'status' => $request->payment_amount >= $request->grand_total 
                    ? 'paid' 
                    : ($request->payment_amount > 0 && $request->payment_amount < $request->grand_total ? 'partial' : 'un-paid'),
                'payment_method_id' => $request->payment_method_id,
                'remarks' => $request->remarks,
                'user_id' => auth()->id(),
            ]);

            // Get the uploaded files; if only one file is uploaded, ensure it's handled as an array.
            $imageFiles = $request->file('images');
            // dd($imageFiles);
            if($imageFiles) {
                if (!is_array($imageFiles)) {
                    $imageFiles = [$imageFiles];
                }

                foreach ($imageFiles as $file) {
                    // // Create an Intervention Image instance for each file.
                    // $image = Image::make($file);
                    
                    // // Convert the image to WebP format at 80% quality.
                    // $image->encode('webp', 80);

                    // // Generate a unique file name. You might want to use order id, timestamp, and uniqid.
                    $fileName = 'payment_images/' . $order->id;

                    // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                    Storage::disk('public')->putFile($fileName, $file);

                    // Create a record in your sales_payment_images table with the WebP file path.
                    \App\Models\Sales\SalesPaymentImages::create([
                        'sales_payment_id' => $sales_payment->id,
                        'sales_order_id'   => $order->id,
                        'image'            => $fileName,
                    ]);
                }
            }
            
        });

        return redirect()->route('point_of_sales.index')->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user()->load(['roles', 'roles.permissions']);
        // $user->permissions = $user->permissions->pluck('name')->toArray();
        // dd($user->rolespermissions);
        $sales_order = SalesOrders::with([
            'customers',
            'payments',
            'payments.paymentMethod',
            'items',
            'items.productVariant',
            'stockMovements',
            'discounts'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Sales/Orders/View/Page', [
            'sales_order' => $sales_order,
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $sales_order = SalesOrders::with([
            'customers',
            'payments',
            'payments.paymentMethod',
            'items',
            'items.productVariant',
            'stockMovements',
            'discounts'
        ])
        ->where('id', $id)
        ->first();
        return inertia('Sales/Orders/Edit/Page', [
            'sales_order' => $sales_order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $sales_order = SalesOrders::findOrFail($id);

        $sales_order->update([
            'remarks' => $request->remarks
        ]);

        return redirect()->route('point_of_sales.index')->with('sucess', 'Successfully Updated Sales Order!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}