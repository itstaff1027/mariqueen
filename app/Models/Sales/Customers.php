<?php

namespace App\Models\Sales;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customers extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'receiver_name',
        'social_media_account',
        'gender', 
        'birthday', 
        'age', 
        'region', 
        'province', 
        'city', 
        'brgy', 
        'street', 
        'zip_code'
    ];
}
