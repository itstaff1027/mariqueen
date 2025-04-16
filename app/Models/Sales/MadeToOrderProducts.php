<?php

namespace App\Models\Sales;

use App\Models\Sales\MadeToOrders;
use Illuminate\Database\Eloquent\Model;

class MadeToOrderProducts extends Model
{
    protected $table = 'made_to_order_products';
    
    protected $fillable = [
        'product_name',
        'color',
        'size',
        'heel_height',
        'type_of_heel',
        'round',
        'length',
        'back_strap',
        'cost'
    ];

    public function mto_items(){
        return $this->belongsTo(MadeToOrderItems::class, 'id', 'made_to_order_product_id');
    }
}
