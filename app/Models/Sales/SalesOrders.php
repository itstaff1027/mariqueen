<?php

namespace App\Models\Sales;

use App\Models\StockMovements;
use Illuminate\Database\Eloquent\Model;

class SalesOrders extends Model
{
    protected $fillable = [
        'order_number',
        'customer_id',
        'warehouse_id',
        'outlet_id',
        'discount_id',
        'courier_id',
        'shipping_cost',
        'rush_order_fee',
        'tracking_number',
        'status',
        'total_amount',
        'grand_amount',
        'user_id',
        'remarks'
    ];

    public function customers(){
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function payments(){
        return $this->hasMany(SalesPayments::class, 'sales_order_id');
    }

    public function discounts(){
        return $this->belongsTo(Discounts::class, 'discount_id');
    }

    public function items(){
        return $this->hasMany(SalesOrderItems::class, 'sales_order_id');
    }

    public function stockMovements(){
        return $this->hasMany(StockMovements::class, 'sales_order_id');
    }
}
