<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Model;

class PackagingTypes extends Model
{
    protected $fillable = [
        'packaging_name',
        'description'
    ];
}
