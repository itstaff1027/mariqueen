<?php

namespace App\Models\Sales;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\StockMovements;
use App\Models\Logistics\Couriers;
use Illuminate\Database\Eloquent\Model;

class MadeToOrders extends Model
{
    protected $table = 'made_to_orders';

    protected $fillable = [
        'mto_order_number',
        'customer_id',
        'discount_id',
        'courier_id',
        'shipping_cost',
        'rush_order_fee',
        'tracking_number',
        'status',
        'total_amount',
        'grand_amount',
        'balance',
        'excess',
        'shoulder_by',
        'packaging_type_id',
        'remarks',
        'user_id'
    ];

    public function customers(){
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function payments(){
        return $this->hasMany(MadeToOrderPayments::class, 'made_to_order_id');
    }

    public function discounts(){
        return $this->belongsTo(Discounts::class, 'discount_id');
    }

    public function items(){
        return $this->hasMany(MadeToOrderItems::class, 'made_to_order_id');
    }

    // public function warehouse(){
    //     return $this->belongsTO(Warehouse::class, 'warehouse_id');
    // }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function courier(){
        return $this->belongsTo(Couriers::class, 'courier_id');
    }

    public function stockMovements(){
        return $this->hasMany(StockMovements::class, 'sales_order_id');
    }

    public function packagingType(){
        return $this->belongsTo(PackagingTypes::class, 'packaging_type_id');
    }
}
