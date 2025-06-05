<?php

namespace App\Models\Inventory;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\ProductVariant;
use App\Models\Inventory\Batches;
use Illuminate\Database\Eloquent\Model;

class SerialNumbers extends Model
{
    protected $fillable = [
        'batch_id',
        'product_variant_id',
        'serial_number',
        'status',
        'quantity',
        'warehouse_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function batch(){
        return $this->belongsTo(Batches::class, 'batch_id');
    }

    public function productVariant(){
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
