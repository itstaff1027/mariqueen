<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;

class SalesPaymentImages extends Model
{
    protected $fillable = [
        'sales_order_id',
        'sales_payment_id',
        'image'
    ];
}
