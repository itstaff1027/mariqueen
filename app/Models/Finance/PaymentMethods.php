<?php

namespace App\Models\Finance;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentMethods extends Model
{
        /** @use HasFactory<\Database\Factories\UserFactory> */
        use HasFactory, Notifiable, HasRoles;

        protected $fillable = [
            'name',
            'is_active'
        ];
}
