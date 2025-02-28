<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('unit_price', 10, 2)->default(0)->after('id'); // Add unit price to product variants
            $table->decimal('cost', 10, 2)->default(0)->after('unit_price'); // Add cost column for finance tracking
        });
    }

    public function down()
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['unit_price', 'cost']); // Drop both columns if rollback is needed
        });
    }
};
