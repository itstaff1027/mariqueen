<?php

namespace App\Models;

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
}
