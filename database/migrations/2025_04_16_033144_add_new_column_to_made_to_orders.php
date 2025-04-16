<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('made_to_orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'paid', 
                'un-paid', 
                'partial', 
                'refunded', 
                'on-hold', 
                'preparing', 
                'shipped',
                'delivered',
                'cancelled',
                'rejected',
                'return',
                'replacement',
                'refund',
                'approved'
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('made_to_orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'paid', 
                'un-paid', 
                'partial', 
                'refunded', 
                'on-hold', 
                'preparing', 
                'shipped',
                'delivered',
                'cancelled',
                'rejected',
                'return',
                'replacement',
                'refund',
            ])->change();
        });
    }
};
