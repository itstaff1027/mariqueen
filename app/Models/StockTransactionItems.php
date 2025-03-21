<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockTransactionItems extends Model
{
        /** @use HasFactory<\Database\Factories\UserFactory> */
        use HasFactory, Notifiable, HasRoles;

        protected $fillable = [
            'stock_transaction_id',
            'product_variant_id',
            'quantity',
        ];

    public function availableStocks(){
        return $this->hasMany(ProductVariant::class, 'id');
    }

    public function productVariant(){
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
    
}
