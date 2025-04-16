<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;

class MadeToOrderItems extends Model
{
    protected $table = 'made_to_order_items';
    
    protected $fillable = [
        'made_to_order_id',
        'made_to_order_product_id',
        'discount_id',
        'quantity',
        'unit_price',
        'total_price',
        'discount_amount'
    ];

    public function madeToOrderProduct(){
        return $this->belongsTo(MadeToOrderProducts::class, 'made_to_order_product_id');
    }

    public function mto_order(){
        return $this->belongsTo(MadeToOrders::class, 'made_to_order_id');
    }
}
