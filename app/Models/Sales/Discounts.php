<?php

namespace App\Models\Sales;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use App\Models\Finance\DiscountPerItems;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discounts extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'type',
        'value',
        'discount_for',
        'is_active'
    ];


    public function items(){
        return $this->hasMany(DiscountPerItems::class, 'discount_id', 'id');
    }
}
