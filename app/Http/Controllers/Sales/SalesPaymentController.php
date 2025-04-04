<?php

namespace App\Http\Controllers\Sales;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use Illuminate\Support\Facades\DB;
use App\Models\Sales\SalesPayments;
use App\Http\Controllers\Controller;
use App\Models\Finance\PaymentMethods;
use Illuminate\Support\Facades\Storage;
use App\Models\Sales\SalesPaymentImages;
use Illuminate\Support\Facades\Auth;

class SalesPaymentController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();
        $query = SalesPayments::with(['paymentMethod', 'salesOrder', 'salesOrder.customers', 'paymentImages'])->orderBy('created_at', 'desc');
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

        $sales_payments = $query->paginate(20);
        return inertia('Sales/Payments/Page', [
            'sales_payments' => $sales_payments,
        ]);
    }

    public function create(){

        $sales_orders = SalesOrders::all();
        $payment_methods = PaymentMethods::all();
        return inertia('Sales/Payments/Create/Page', [
            'sales_orders' => $sales_orders,
            'payment_methods' => $payment_methods,

        ]);
    }

    public function get_sales_order(string $id){
        $sales_order = SalesOrders::where('id', $id)->first();
        return json_encode($sales_order);
    }

    public function store(Request $request){

        $request->validate([
            'sales_order_id' => 'required',
            'payment_method_id' => 'required',
            'status' => 'required|string',
            'payment_amount' => 'required|string',
            'remarks' => 'required|string',
            'type_purpose' => 'required'
        ]);
        
        $sales_order = SalesOrders::findOrFail($request->sales_order_id);

        DB::transaction(function() use ($request, $sales_order) {
            if ($request->type_purpose === 'balance') {
                // Save the original balance before updating.
                $originalBalance = $sales_order->balance;
                $calculated_balance = $originalBalance - $request->payment_amount;
            
                // Update sales order: if payment exceeds balance, set balance to 0 and compute excess.
                $sales_order->update([
                    'balance' => $request->payment_amount > $originalBalance ? 0 : $calculated_balance,
                    'excess'  => $request->payment_amount > $originalBalance ? $request->payment_amount - $originalBalance : 0,
                ]);
            
                $sales_payment =SalesPayments::create([
                    'sales_order_id'      => $request->sales_order_id,
                    'amount_paid'         => $request->payment_amount,
                    'remaining_balance'   => $request->payment_amount > $originalBalance ? 0 : $calculated_balance,
                    'excess_amount'       => $request->payment_amount > $originalBalance ? $request->payment_amount - $originalBalance : 0,
                    'change_due'          => $request->payment_amount > $originalBalance ? $request->payment_amount - $originalBalance : 0,
                    'remarks'             => $request->remarks . ' - ' . $request->type_purpose . ' payment',
                    'status'              => $request->status,
                    'payment_method_id'   => $request->payment_method_id,
                    'user_id'             => auth()->id(),
                    'created_at'          => Carbon::now(),
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

                        $fileName = 'payment_images/' . $sales_order->order_number;

                        // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                        $file_path = Storage::disk('public')->putFile($fileName, $file);
    
                        // Create a record in your sales_payment_images table with the WebP file path.
                        \App\Models\Sales\SalesPaymentImages::create([
                            'sales_payment_id' => $sales_payment->id,
                            'sales_order_id'   => $sales_order->id,
                            'image'            => $file_path,
                        ]);
                    }
                }
            }
            else {
                $sales_payment =SalesPayments::create([
                    'sales_order_id' => $request->sales_order_id,
                    'amount_paid' => $request->payment_amount,
                    'change_due' => 0,
                    'remaining_balance' => 0,
                    'excess_amount' => 0,
                    'remarks' => $request->remarks . ' - ' . $request->type_purpose . ' payment',
                    'status' => $request->status,
                    'payment_method_id' => $request->payment_method_id,
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

                        $fileName = 'payment_images/' . $sales_order->order_number;

                        // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                        $file_path = Storage::disk('public')->putFile($fileName, $file);
    
                        // Create a record in your sales_payment_images table with the WebP file path.
                        SalesPaymentImages::create([
                            'sales_payment_id' => $sales_payment->id,
                            'sales_order_id'   => $sales_order->id,
                            'image'            => $file_path,
                        ]);
                    }
                }
            }

        });

        return redirect()->route('sales_payments.index')->with('success', 'Payment successfully added!');
    }

    public function edit(string $id) {

        $sales_payment = SalesPayments::with(['paymentImages', 'salesOrder'])->findOrFail($id);

        return inertia('Sales/Payments/Edit/Page', [
            'sales_payment' => $sales_payment,
            'payment_methods' => PaymentMethods::all(),
        ]);
    }

    public function update(Request $request, string $id) {
// dd($request);
        $request->validate([
            'payment_method_id' => 'required',
            'remarks' => 'required',
            'status' => 'required',
        ]);
        
        // dd($id);

        $sales_payment = SalesPayments::with(['paymentImages', 'salesOrder'])->findOrFail($id);

        DB::transaction(function() use ($request, $sales_payment){
            $sales_payment->update([
                'payment_method_id' => $request->payment_method_id,
                'remarks' => $request->remarks,
                'status' => $request->status,
                'update_at' => Carbon::now()
            ]);

        });

        return redirect()->route('sales_payments.index')->with('success', 'Payment successfully updated!');
    }

    public function upload_new_images(Request $request){
        // dd($request);
        $sales_payment = SalesPayments::with(['paymentImages', 'salesOrder'])->findOrFail($request->data['sales_payment_id']);
        // dd($sales_payment->salesOrder->order_number);
        DB::transaction(function() use ($request, $sales_payment){

            if($sales_payment->paymentImages->count() > 0){
                foreach($sales_payment->paymentImages as $image){
                    Storage::disk('public')->delete($image->image);
                }
                $sales_payment->paymentImages()->delete();
            }
            $files = $request->file('data')['new_images'];
            $imageFiles = $request->file('new_images') ?? [];
            foreach ($files as $file) {
                // process each file
                $fileName = 'payment_images/' . $sales_payment->salesOrder->order_number;
                $file_path = Storage::disk('public')->putFile($fileName, $file);

                SalesPaymentImages::create([
                    'sales_payment_id' => $sales_payment->id,
                    'sales_order_id'   => $sales_payment->salesOrder->id,
                    'image'            => $file_path,
                ]);
            }

        });

        return redirect()->route('sales_payments.index')->with('success', 'Payment successfully updated!');
    }

    public function destroy_image(Request $request){

        // dd($request->payment_image_id);
        $payment_image = SalesPaymentImages::findOrFail($request->payment_image_id);
        // dd($payment_image);
        Storage::disk('public')->delete('/storage/' . $payment_image->image);

        $payment_image->delete();

        return redirect()->route('sales_payments.edit', $request->sales_payment_id)->with('success', 'Image successfully deleted!');
    }

    public function show(string $id){
        $sales_payment = SalesPayments::with(['paymentImages', 'salesOrder', 'paymentMethod'])->findOrFail($id);
        // dd($sales_payment);
        return inertia('Sales/Payments/View/Page', [
            'sales_payment' => $sales_payment,
        ]);
    }
}
