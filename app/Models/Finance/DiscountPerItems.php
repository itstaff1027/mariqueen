<?php

namespace App\Models\Finance;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class DiscountPerItems extends Model
{
    protected $fillable = [
        'discount_id',
        'product_variant_id',
        'product_id',
        'color_id',
        'size_value_id',
        'heel_height_id',
        'category_id'
    ];

    public function product(){
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
