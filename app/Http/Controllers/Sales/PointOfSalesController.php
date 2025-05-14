<?php

namespace App\Http\Controllers\Sales;


use Carbon\Carbon;
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
use App\Models\Sales\PackagingTypes;
use Illuminate\Support\Facades\Auth;
use App\Models\Sales\SalesOrderItems;
use App\Models\Finance\PaymentMethods;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use App\Http\Resources\Sales\Stocks\PointOfSaleStockResources;
use App\Http\Resources\Inventory\Stocks\StockMovementResources;

class PointOfSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = SalesOrders::with([
            'user',
            'warehouse',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.productVariant',
            'items.productVariant.product',
            'items.productVariant.colors',
            'items.productVariant.size_values',
            'items.productVariant.heelHeights'
        ])
        ->orderBy('created_at', 'desc');

        // Flatten all permissions from all roles into one collection
        $permissions = $user->roles->flatMap(function ($role) {
            return $role->permissions;
        });

        // Check if any permission has the name 'view'
        $hasPermission = $permissions->contains(function ($permission) {
            return $permission->name === 'view';
        });

        if($hasPermission) {
            $query->where('user_id', $user->id);
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
                $q->where('order_number', 'LIKE', "%{$searchTerm}%")
                ->orWhere('tracking_number', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $sales_orders = $query->paginate(20);
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
        // dd(StockMovementResources::collection(StockMovements::all()));
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
                    'productVariant',
                    'productVariant.colors', 
                    'productVariant.heelHeights', 
                    'productVariant.sizes',
                    'productVariant.size_values',
                    'productVariant.categories',
                    'productVariant.product',
                    'productVariant.promotionConditions.promotion',
                    'productVariant.product.promotionConditions.promotion',
                    'productVariant.colors.promotionConditions.promotion',
                    'productVariant.heelHeights.promotionConditions.promotion',
                    'productVariant.categories.promotionConditions.promotion',
                    
                ])
                ->fromSub(function ($query) use ($warehouseIds) {
                    $query->select(
                        'product_variant_id',
                        'to_warehouse_id as warehouse_id',
                        DB::raw("SUM(quantity) as stock_change")
                    )
                    ->from('stock_movements')
                    ->whereIn('movement_type', ['purchase', 'transfer_in', 'return'])
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
            'stock_lvls' => $stock_levels,
            'colors' => $color,
            'heel_heights' => $heel_height,
            'sizes' => $sizes,
            'size_values' => $size_values,
            'categories' => $categories,
            'user_warehouse'=> $user->user_warehouse->first()->name,
            'couriers' => $couriers,
            'payment_methods' => $payment_methods,
            'discounts' => Discounts::all(),
            'customers' => Customers::all(),
            'packaging_types' => PackagingTypes::all(),
            'stock_levels' => PointOfSaleStockResources::collection($stock_levels)
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
            'shipping_cost' => 'required|numeric|min:0',
            'rush_order_fee' => 'nullable|string',
            'total_amount' => 'required|numeric|min:1',
            'payment_amount' => 'required|string',
            'grand_total' => 'required|numeric|min:1',
            // 'discount_id' => 'nullable|exists:discounts,id',
            'remarks' => 'nullable|string',
            'customer_id' => 'required|exists:customers,id',
            'packaging_type_id' => 'required|exists:packaging_types,id'
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
                'promotion_id' => $request->promotion_id,
                'courier_id' => $request->courier_id,
                'shipping_cost' => $request->shipping_cost,
                'rush_order_fee' => $request->rush_order_fee ? $request->rush_order_fee : 0,
                'total_amount' => $request->total_amount,   // from your business logic
                'grand_amount' => $request->grand_total,   // after discounts, fees, etc.
                'balance' => $request->payment_amount === 0 || $request->payment_amount < $request->grand_total ? $request->grand_total - $request->payment_amount : 0,
                'excess' => $request->payment_amount > $request->grand_total ? $request->payment_amount - $request->grand_total : 0,
                'status' => 'pending',
                'remarks' => $request->remarks,
                'packaging_type_id' => $request->packaging_type_id,
                'shoulder_by' => $request->shoulder_by,
                'user_id' => auth()->id(),
                'created_at' => Carbon::now(),
            ]);

            $saleOrderItemsToInsert = [];
            foreach($request->cart as $items) {
                $product_variant_id = $items['product_variant_id'];
                $quantity = $items['quantity'];
                $stockMovementsToInsert = [];

                $saleOrderItemsToInsert[] = [
                    'sales_order_id' => $order->id,
                    'product_variant_id' => $product_variant_id,
                    'promotion_id' => $items['promotion_id'],
                    'quantity' => $items['quantity'],
                    'unit_price' => $items['unit_price'],
                    'total_price' => $items['subtotal'],
                    'discount_amount' => $items['discount_price'],
                    'created_at' => Carbon::now(),
                ];

                for($i = 0; $i < $quantity; $i++) {
                    $stockMovementsToInsert[] = [
                        'sales_order_id' => $order->id,
                        'product_variant_id' => $product_variant_id,
                        'from_warehouse_id' => $warehouseIds[0],
                        'quantity' => -1,
                        'movement_type' => 'sale',
                        'remarks' => 'Sold Item From Order #:' . $order->id . ' From Warehouse:' . $user->name,
                        'created_at' => Carbon::now(),
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
                'created_at' => Carbon::now(),
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
                    $fileName = 'payment_images/' . $order->order_number;

                    // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                    $file_path = Storage::disk('public')->putFile($fileName, $file);

                    // Create a record in your sales_payment_images table with the WebP file path.
                    \App\Models\Sales\SalesPaymentImages::create([
                        'sales_payment_id' => $sales_payment->id,
                        'sales_order_id'   => $order->id,
                        'image'            => $file_path,
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
            'discounts',
            'courier',
            'packagingType'
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
            'discounts',
            'courier',
            'packagingType'
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
            'remarks' => $request->remarks,
            'updated_at' => Carbon::now(),
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