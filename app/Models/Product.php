<?php

namespace App\Models;

use App\Models\Finance\DiscountPerItems;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'product_name',
        'status',
        'cost',
        'srp'
    ];

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'products_colors', 'product_id', 'color_id');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'products_sizes', 'product_id', 'size_id');
    }

    public function heelHeights()
    {
        return $this->belongsToMany(HeelHeight::class, 'products_heel_heights','product_id', 'heel_height_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Categories::class, 'products_categories', 'product_id', 'category_id');
    }

    public function variants(){
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    
    public function size_values()
    {
        return $this->belongsTo(SizeValues::class, 'size_value_id');
    }

    public function discountedPrice(){
        return $this->belongsTo(DiscountPerItems::class, 'product_id', 'id');
    }
}
