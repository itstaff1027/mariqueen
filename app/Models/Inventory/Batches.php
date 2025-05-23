<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Warehouse;

class Batches extends Model
{
    protected $fillable = [
        'batch_number',
        'manufacturing_date',
        'expiry_date',
        'received_date',
        'description',
        'warehouse_id',
        'user_id'
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
