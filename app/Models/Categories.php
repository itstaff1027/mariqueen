<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Finance\PromotionConditions;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Categories extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'category_name',
        'category_label'
    ];

    public function promotionConditions(): MorphMany {
        return $this->morphMany(PromotionConditions::class, 'conditional', 'conditional_type', 'conditional_id');
    }
}
