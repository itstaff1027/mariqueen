<?php

namespace App\Http\Controllers\Sales;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Sales\MadeToOrders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Finance\PaymentMethods;
use App\Models\Sales\MadeToOrderPaymentImages;
use Illuminate\Support\Facades\Storage;
use App\Models\Sales\MadeToOrderPayments;

class MTOSalesPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = MadeToOrderPayments::with([
            'paymentMethod', 
            'salesOrder', 
            'salesOrder.customers', 
            'paymentImages'])
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
                $q->where('status', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('salesOrder', function ($q1) use ($searchTerm) {
                    $q1->where('mto_order_number', 'LIKE', $searchTerm);
                })
                ->orWhereHas('salesOrder.customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('salesOrder.customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $sales_payments = $query->paginate(20);
        return inertia('Sales/MTOPayments/Page', [
            'mto_sales_payments' => $sales_payments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $sales_orders = MadeToOrders::all();
        $payment_methods = PaymentMethods::all();
        return inertia('Sales/MTOPayments/Create/Page', [
            'mto_sales_orders' => $sales_orders,
            'payment_methods' => $payment_methods,

        ]);
    }

    public function get_sales_order(string $id){
        $sales_order = MadeToOrders::where('id', $id)->first();
        return json_encode($sales_order);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sales_order_id' => 'required',
            'payment_method_id' => 'required',
            'status' => 'required|string',
            'payment_amount' => 'required|string',
            'remarks' => 'required|string',
            'type_purpose' => 'required'
        ]);
        
        $sales_order = MadeToOrders::findOrFail($request->sales_order_id);

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
            
                $sales_payment = MadeToOrderPayments::create([
                    'made_to_order_id'      => $request->sales_order_id,
                    'amount_paid'         => $request->payment_amount,
                    'remaining_balance'   => $request->payment_amount > $originalBalance ? 0 : $calculated_balance,
                    'excess_amount'       => $request->payment_amount > $originalBalance ? $request->payment_amount - $originalBalance : 0,
                    'change_due'          => $request->payment_amount > $originalBalance ? $request->payment_amount - $originalBalance : 0,
                    'remarks'             => $request->remarks . ' - ' . $request->type_purpose . ' payment',
                    'status'              => $request->status,
                    'payment_method_id'   => $request->payment_method_id,
                    'user_id'             => auth()->id(),
                    'payment_date'        => Carbon::now(),
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

                        $fileName = 'payment_images/' . $sales_order->mto_order_number;

                        // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                        $file_path = Storage::disk('public')->putFile($fileName, $file);

                        // Create a record in your sales_payment_images table with the WebP file path.
                        MadeToOrderPaymentImages::create([
                            'mto_payment_id' => $sales_payment->id,
                            'mto_order_id'   => $sales_order->id,
                            'image'            => $file_path,
                        ]);
                    }
                }
            }
            else {
                $sales_payment = MadeToOrderPayments::create([
                    'made_to_order_id' => $request->sales_order_id,
                    'amount_paid' => $request->payment_amount,
                    'change_due' => 0,
                    'remaining_balance' => 0,
                    'excess_amount' => 0,
                    'remarks' => $request->remarks . ' - ' . $request->type_purpose . ' payment',
                    'status' => $request->status,
                    'payment_method_id' => $request->payment_method_id,
                    'user_id' => auth()->id(),
                    'payment_date' => Carbon::now(),
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

                        $fileName = 'payment_mto_images/' . $sales_order->order_number;

                        // Save the image to the "public" disk (ensure you have run `php artisan storage:link`)
                        $file_path = Storage::disk('public')->putFile($fileName, $file);
    
                        // Create a record in your sales_payment_images table with the WebP file path.
                        MadeToOrderPaymentImages::create([
                            'mto_payment_id' => $sales_payment->id,
                            'mto_order_id'   => $sales_order->id,
                            'image'            => $file_path,
                        ]);
                    }
                }
            }

        });

        return redirect()->route('mto_sales_payments.index')->with('success', 'Payment successfully added!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sales_payment = MadeToOrderPayments::with(['paymentImages', 'salesOrder', 'paymentMethod'])->findOrFail($id);
        // dd($sales_payment);
        return inertia('Sales/MTOPayments/View/Page', [
            'mto_sales_payment' => $sales_payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $sales_payment = MadeToOrderPayments::with(['paymentImages', 'salesOrder'])->findOrFail($id);

        return inertia('Sales/MTOPayments/Edit/Page', [
            'mto_sales_payment' => $sales_payment,
            'payment_methods' => PaymentMethods::all(),
        ]);
    }

    public function upload_new_images(Request $request){
        // dd($request);
        $sales_payment = MadeToOrderPayments::with(['paymentImages', 'salesOrder'])->findOrFail($request->data['mto_sales_payment_id']);
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
                $fileName = 'mto_payment_images/' . $sales_payment->salesOrder->mto_order_number;
                $file_path = Storage::disk('public')->putFile($fileName, $file);

                MadeToOrderPaymentImages::create([
                    'mto_payment_id' => $sales_payment->id,
                    'mto_order_id'   => $sales_payment->salesOrder->id,
                    'image'            => $file_path,
                ]);
            }

        });

        return redirect()->route('mto_sales_payments.index')->with('success', 'Payment successfully updated!');
    }

    public function destroy_image(Request $request){

        // dd($request->payment_image_id);
        $payment_image = MadeToOrderPaymentImages::findOrFail($request->payment_image_id);
        // dd($payment_image);
        Storage::disk('public')->delete('/storage/' . $payment_image->image);

        $payment_image->delete();

        return redirect()->route('mto_sales_payments.edit', $request->mto_sales_payment_id)->with('success', 'Image successfully deleted!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'payment_method_id' => 'required',
            'remarks' => 'required',
            'status' => 'required',
        ]);
        
        // dd($id);

        $sales_payment = MadeToOrderPayments::with(['paymentImages', 'salesOrder'])->findOrFail($id);

        DB::transaction(function() use ($request, $sales_payment){
            $sales_payment->update([
                'payment_method_id' => $request->payment_method_id,
                'remarks' => $request->remarks,
                'status' => $request->status,
                'update_at' => Carbon::now()
            ]);

        });

        return redirect()->route('mto_sales_payments.index')->with('success', 'Payment successfully updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
