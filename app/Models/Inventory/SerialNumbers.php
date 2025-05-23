<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;

class SerialNumbers extends Model
{
    protected $fillable = [
        'serial_number',
        'quantity'
    ];
}
