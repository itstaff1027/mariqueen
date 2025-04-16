<?php

namespace App\Models\Sales;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Model;

class SalesOrderReturns extends Model
{
    protected $fillable = [
        'return_number',
        'sales_order_id',
        'return_type',
        'return_date',
        'status',
        'warehouse_id',
        'user_id',
        'remarks'
    ];

    public function referenceOrder(){
        return $this->belongsTo(SalesOrders::class, 'sales_order_id', 'id');
    }

    public function returnItems(){
        return $this->hasMany(SalesOrderReturnItems::class, 'sales_order_return_id', 'id');
    }

    public function warehouse(){
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
