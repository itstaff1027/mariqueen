
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;  // ← make sure this is here

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->enum('movement_type', [
                'purchase',
                'sale',
                'transfer_in',
                'transfer_out',
                'return',
                'adjustment',
                'correction',
                'repair',
                'replacement',
                'cancelled',
                'disposed',
                'shipped',
                'delivered',
            ])->change();
        });

        Schema::table('sales_orders', function (Blueprint $table) {
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
                'approved',
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1) Normalize any values that won't fit back into the old enum
        DB::table('stock_movements')
            ->whereNotIn('movement_type', [
                'purchase',
                'sale',
                'transfer_in',
                'transfer_out',
                'return',
                'adjustment',
                'correction',
                'repair',
            ])
            ->update(['movement_type' => 'repair']);

        DB::table('sales_orders')
            ->where('status', 'approved')
            ->update(['status' => 'pending']);

        // 2) Now safely change the column definitions back
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->enum('movement_type', [
                'purchase',
                'sale',
                'transfer_in',
                'transfer_out',
                'return',
                'adjustment',
                'correction',
                'repair',
            ])->change();
        });

        Schema::table('sales_orders', function (Blueprint $table) {
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
};;
