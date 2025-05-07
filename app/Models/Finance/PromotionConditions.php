<?php

namespace App\Models\Finance;

use App\Models\Categories;
use App\Models\Color;
use App\Models\Product;
use App\Models\HeelHeight;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PromotionConditions extends Model
{
    protected $fillabe = [
        'promotion_id',
        'conditional_type',
        'conditional_id',
        'discount_type',
        'discount_value',
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'conditional_id', 'id');
    }

    public function color() {
        return $this->belongsTo(Color::class, 'conditional_id', 'id');
    }

    public function heelHeight(){
        return $this->belongsTo(HeelHeight::class, 'conditional_id', 'id');
    }

    public function category() {
        return $this->belongsTo(Categories::class, 'conditional_id', 'id');
    }

    public function promotion() {
        return $this->belongsTo(Promotions::class, 'promotion_id', 'id');
    }

    public function conditional(): MorphTo {
        return $this->morphTo(__FUNCTION__, 'conditional_type', 'conditional_id');
    }

}
