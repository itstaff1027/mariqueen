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
        Schema::table('promotions', function (Blueprint $table) {
            $table->foreignId('promotion_from')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropForeign(['promotion_from']);
            $table->dropColumn(['promotion_from', 'starts_at', 'ends_at']);
        });
    }
};
