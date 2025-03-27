<?php

namespace App\Models;

use App\Models\Admin\AuthorizedRoles;
use App\Models\Admin\AuthorizedRoutes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'guard_name',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

    public function routes(){
        return $this->hasMany(AuthorizedRoles::class, 'role_id');
    }
}
