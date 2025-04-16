<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;

class MadeToOrderPaymentImages extends Model
{
    protected $table = 'made_to_order_payment_images';

    protected $fillable = [
        'mto_payment_id',
        'mto_order_id',
        'image'
    ];
}
