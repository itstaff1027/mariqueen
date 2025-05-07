<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Finance\PromotionConditions;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Color extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'color_name',
        'hex'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function promotionConditions(): MorphMany {
        return $this->morphMany(PromotionConditions::class, 'conditional', 'conditional_type', 'conditional_id');
    }
}
