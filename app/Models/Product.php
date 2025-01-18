<?php

namespace App\Models;

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
}
