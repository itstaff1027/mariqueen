<?php

namespace App\Models\Inventory;

use App\Models\User;
use App\Models\Warehouse;
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
}
