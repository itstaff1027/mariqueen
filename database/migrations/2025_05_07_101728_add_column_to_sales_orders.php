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
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null');
        });
        Schema::table('made_to_orders', function (Blueprint $table) {
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropColumn('promotion_id');
        });
        Schema::table('made_to_orders', function (Blueprint $table) {
            $table->dropColumn('promotion_id');
        });
    }
};
