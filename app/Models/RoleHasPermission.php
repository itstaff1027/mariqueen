<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoleHasPermission extends Model
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'permission_id',
        'role_id',
    ];
}
