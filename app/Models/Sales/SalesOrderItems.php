<?php

namespace App\Models\Sales;

use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Model;

class SalesOrderItems extends Model
{
    protected $fillable = [
        'sales_order_id',
        'product_variant_id',
        'promotion_id',
        'discount_id',
        'quantity',
        'unit_price',
        'total_price',
        'discount_amount'
    ];

    public function productVariant(){
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
