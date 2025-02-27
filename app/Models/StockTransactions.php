<?php

namespace App\Models;

use App\Models\StockTransactionItems;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockTransactions extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;
    protected $fillable = [
        'from_warehouse_id',
        'to_warehouse_id',
        'created_by',
        'approved_by',
        'transaction_type',
        'status',
        'remarks',
    ];

    public function logs()
    {
        return $this->hasMany(StockTransactionLogs::class);
    }

    public function productVariant(){
        return $this->belongsToMany(ProductVariant::class, 'stock_transaction_items', 'stock_transaction_id');
    }

    public function items(){
        return $this->hasMany(StockTransactionItems::class, 'stock_transaction_id');
    }
}
