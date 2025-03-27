<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Admin\AuthorizedRoles;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function user_roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function user_warehouse()
    {
        return $this->belongsToMany(Warehouse::class, 'user_warehouse', 'user_id', 'warehouse_id');
    }

    // For allowedRoutes, if you want to compute them from user roles, you can do one of two things:
    public function allowedRoutes()
    {
        return $this->hasMany(AuthorizedRoles::class, 'role_id'); 
    }

}
