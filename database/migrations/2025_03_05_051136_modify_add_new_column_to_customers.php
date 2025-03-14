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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('receiver_name', 255)->default('');
        });

        Schema::table('stock_movements', function (Blueprint $table) {
            $table->foreignId('sales_order_id')->nullable()->constrained('sales_orders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['receiver_name']); // Drop both columns if rollback is needed
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sales_order_id');
        });
    }
};
