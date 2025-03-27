<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

class AuthorizedRoles extends Model
{
    protected $fillable = [
        'route_name',
        'role_id',
    ];
}
