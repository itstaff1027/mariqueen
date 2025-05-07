<?php

namespace App\Models;

use App\Models\StockMovements;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Finance\PromotionConditions;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductVariant extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'product_id',
        'color_id',
        'heel_height_id',
        'size_value_id',
        'sku'
    ];

    protected $appends = [
        'total_purchased', 'total_sold', 'total_transfer',
        'total_return', 'total_adjustment', 'total_correction', 'total_repair'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function colors()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function sizes()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }

    public function heelHeights()
    {
        return $this->belongsTo(HeelHeight::class, 'heel_height_id');
    }

    public function size_values()
    {
        return $this->belongsTo(SizeValues::class, 'size_value_id');
    }

    public function categories()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function stockLevels(){
        return $this->hasMany(StockLevels::class, 'product_variant_id');
    }

    public function stockMovements(){
        return $this->hasMany(StockMovements::class, 'product_variant_id');
    }

    public function promotionConditions(): MorphMany {
        return $this->morphMany(PromotionConditions::class, 'conditional', 'conditional_type', 'conditional_id');
    }

    // Define Accessors for Each Attribute
    public function getTotalPurchasedAttribute()
    {
        return $this->attributes['total_purchased'] ?? 0;
    }

    public function getTotalSoldAttribute()
    {
        return $this->attributes['total_sold'] ?? 0;
    }

    public function getTotalTransferAttribute()
    {
        return $this->attributes['total_transfer'] ?? 0;
    }

    public function getTotalReturnAttribute()
    {
        return $this->attributes['total_return'] ?? 0;
    }

    public function getTotalAdjustmentAttribute()
    {
        return $this->attributes['total_adjustment'] ?? 0;
    }

    public function getTotalCorrectionAttribute()
    {
        return $this->attributes['total_correction'] ?? 0;
    }

    public function getTotalRepairAttribute()
    {
        return $this->attributes['total_repair'] ?? 0;
    }

}
