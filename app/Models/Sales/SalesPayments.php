<?php

namespace App\Models\Sales;

use App\Models\Finance\PaymentMethods;
use Illuminate\Database\Eloquent\Model;

class SalesPayments extends Model
{
    protected $fillable = [
        'sales_order_id',
        'amount_paid',
        'change_due',
        'remaining_balance',
        'excess_amount',
        'remarks',
        'status',
        'payment_method_id',
        'user_id'
    ];

    public function paymentMethod(){
        return $this->belongsTo(PaymentMethods::class, 'payment_method_id');
    }

    public function salesOrder(){
        return $this->belongsTo(SalesOrders::class, 'sales_order_id');
    }

    public function paymentImages(){
        return $this->hasMany(SalesPaymentImages::class, 'sales_payment_id');
    }
}
