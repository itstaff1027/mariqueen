<?php

namespace App\Http\Controllers\Sales;

use App\Models\Sales\MadeToOrderPaymentImages;
use Carbon\Carbon;
use App\Models\Color;
use App\Models\Product;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use Illuminate\Http\Request;
use App\Models\Sales\Customers;
use App\Models\Sales\Discounts;
use App\Models\Logistics\Couriers;
use App\Models\Sales\MadeToOrders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Sales\PackagingTypes;
use Illuminate\Support\Facades\Auth;
use App\Models\Finance\PaymentMethods;
use App\Models\Sales\MadeToOrderItems;
use Illuminate\Support\Facades\Storage;
use App\Models\Sales\MadeToOrderPayments;
use App\Models\Sales\MadeToOrderProducts;

class MadeToOrderController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();

        $query = MadeToOrders::with([
            'user',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.madeToOrderProduct',
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
                $q->where('mto_order_number', 'LIKE', "%{$searchTerm}%")
                ->orWhere('tracking_number', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $made_to_orders = $query->paginate(20);
        return inertia('Sales/MadeToOrder/Page', [
            'made_to_orders' => $made_to_orders,
        ]);
    }

    public function create(){
        $user = Auth::user();

        return inertia('Sales/MadeToOrder/Create/Page', [
            'products' => Product::all(),
            'colors' => Color::all(),
            'heel_heights' => HeelHeight::all(),
            'size_values' => SizeValues::with(['size'])->get(),
            'couriers' => Couriers::all(),
            'payment_methods' => PaymentMethods::all(),
            'discounts' => Discounts::all(),
            'customers' => Customers::all(),
            'packaging_types' => PackagingTypes::all()
        ]);
    }

    public function store(Request $request) {
        
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

        DB::transaction(function() use ($request) {
            
            $made_to_order = MadeToOrders::create([
                'mto_order_number' =>  'MTO-'. str_pad(MadeToOrders::max('id') + 1, 6, '0', STR_PAD_LEFT),
                'customer_id' => $request->customer_id,
                'courier_id' => $request->courier_id,
                'shipping_cost' => $request->shipping_cost,
                'rush_order_fee' => $request->rush_order_fee,
                'tracking_number' => $request->tracking_number,
                'status' => 'pending',
                'total_amount' => $request->total_amount,
                'grand_amount' => $request->grand_total,
                'balance' => $request->payment_amount === 0 || $request->payment_amount < $request->grand_total ? $request->grand_total - $request->payment_amount : 0,
                'excess' => $request->payment_amount > $request->grand_total ? $request->payment_amount - $request->grand_total : 0,
                'shoulder_by' => $request->shoulder_by,
                'packaging_type_id' => $request->packaging_type_id,
                'remarks' => $request->remarks,
                'user_id' => auth()->id(),
                'created_at' => Carbon::now(),
            ]);


            $mto_new_product = [];

            foreach($request->cart as $item){
                $mto_product = MadeToOrderProducts::create([
                    'product_name' => $item['product_name'],
                    'color' => $item['color_name'],
                    'size' => $item['size_values'],
                    'heel_height' => $item['heel_heights'],
                    'type_of_heel' => $item['type_of_heels'],
                    'round' => $item['round'],
                    'length' => $item['length'],
                    'back_strap' => $item['back_strap'],
                    'cost' => $item['cost'],
                    'create_at' => Carbon::now(),
                ]);

                $mto_new_product[] = [
                    'made_to_order_id' => $made_to_order->id,
                    'made_to_order_product_id' => $mto_product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['cost'],
                    'total_price' => $item['subtotal'],
                    'created_at' => Carbon::now(),
                ];
            }

            MadeToOrderItems::insert($mto_new_product);

            $mto_payments = MadeToOrderPayments::create([
                'made_to_order_id' => $made_to_order->id,
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

                    // // Generate a unique file name. You might want to use order id, timestamp, and uniqid.
                    $fileName = 'payment_mto_images/' . $made_to_order->mto_order_number;

                    // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                    $file_path = Storage::disk('public')->putFile($fileName, $file);

                    // Create a record in your sales_payment_images table with the WebP file path.
                    MadeToOrderPaymentImages::create([
                        'sales_payment_id' => $mto_payments->id,
                        'sales_order_id'   => $made_to_order->id,
                        'image'            => $file_path,
                    ]);
                }
            }
        });

        return redirect()->route('made_to_orders.index')->with('success', 'Made to Order created successfully.');

    }

    public function edit(string $id){

        $made_to_order = MadeToOrders::with([
            'user',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.madeToOrderProduct',
        ])->findOrFail($id);

        return inertia('Sales/MadeToOrder/Edit/Page', [
            'made_to_order' => $made_to_order,
        ]);
    }

    public function show(string $id){
        $made_to_order = MadeToOrders::with([
            'user',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.madeToOrderProduct',
        ])->findOrFail($id);
        return inertia('Sales/MadeToOrder/View/Page', [
            'made_to_order' => $made_to_order,
        ]);
    }

    public function update_status(Request $request, string $id){
        DB::transaction(function() use ($request, $id) {
            $made_to_order = MadeToOrders::findOrFail($id);

            // dd($sales_order_return);
        
            // Determine the new status based on the request value
            $updatedStatus = $request->new_status == 'cancel' ? 'cancelled' : $request->new_status;
        
            // Update the record
            $made_to_order->update([
                'status' => $updatedStatus,
            ]);
        });

        return redirect()->route('made_to_orders.index')->with('success', 'Status updated successfully');
    }
}
