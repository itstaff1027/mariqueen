<?php

namespace App\Http\Controllers\Sales;

use Illuminate\Http\Request;
use App\Models\Sales\SalesOrders;
use Illuminate\Support\Facades\DB;
use App\Models\Sales\SalesPayments;
use App\Http\Controllers\Controller;
use App\Models\Finance\PaymentMethods;

class SalesPaymentController extends Controller
{
    public function index(){

        $sales_payments = SalesPayments::with(['paymentMethod', 'salesOrder', 'salesOrder.customers', 'paymentImages'])->orderBy('created_at', 'desc')->get();
        // dd($sales_payments);
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
        ]);
        
        $sales_order = SalesOrders::findOrFail($request->sales_order_id);

        DB::transaction(function() use ($sales_order) {
            $sales_order->update([
                
            ]);
        });
    }
}
