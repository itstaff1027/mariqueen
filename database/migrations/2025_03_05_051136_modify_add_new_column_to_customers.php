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
        // 1) Add receiver_name to customers
        Schema::table('customers', function (Blueprint $table) {
            $table->string('receiver_name', 255)->default('');
        });

        // 2) Add sales_order_id FK to stock_movements
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->foreignId('sales_order_id')
                ->nullable()
                ->constrained('sales_orders')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1) Drop the FK constraint and column from stock_movements
        Schema::table('stock_movements', function (Blueprint $table) {
            // dropForeign expects an array of column names
            $table->dropForeign(['sales_order_id']);
            $table->dropColumn('sales_order_id');
        });

        // 2) Drop the receiver_name column from customers
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('receiver_name');
        });
    }
};
