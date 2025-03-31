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
            $table->enum('shoulder_by', ['bragais', 'client'])->default('bragais');
            $table->foreignId('packaging_type_id')->nullable()->constrained('packaging_types')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropForeign(['packaging_type_id']); // Drop the foreign key constraint first
            $table->dropColumn(['packaging_type_id', 'shoulder_by']);
        });
    }
    
};
