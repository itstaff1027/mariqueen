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
            // Use a “big” DECIMAL so you’re not limited to only two digits after the point.
            // MySQL’s max is DECIMAL(65,30), which is essentially “unlimited” for most use cases.
            $table->decimal('discount_value', 65, 30)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropColumn('discount_value');
        });
    }
};
