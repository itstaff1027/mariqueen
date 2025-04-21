<?php

namespace App\Models\Sales;

use App\Models\Finance\PaymentMethods;
use Illuminate\Database\Eloquent\Model;

class MadeToOrderPayments extends Model
{
    protected $table = 'made_to_order_payments';

    protected $fillable = [
        'made_to_order_id',
        'amount_paid',
        'change_due',
        'remaining_balance',
        'excess_amount',
        'remarks',
        'status',
        'payment_method_id',
        'user_id',
        'payment_date'
    ];

    public function paymentMethod(){
        return $this->belongsTo(PaymentMethods::class, 'payment_method_id');
    }

    public function salesOrder(){
        return $this->belongsTo(MadeToOrders::class, 'made_to_order_id');
    }

    public function paymentImages(){
        return $this->hasMany(MadeToOrderPaymentImages::class, 'mto_payment_id');
    }
}
