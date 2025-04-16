<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;

class SalesOrderReturnItems extends Model
{
    protected $fillable = [
        'sales_order_return_id',
        'sales_order_item_id',
        'quantity',
        'reason'
    ];


    public function salesOrderItems(){
        return $this->belongsTo(SalesOrderItems::class, 'sales_order_item_id', 'id');
    }
}
