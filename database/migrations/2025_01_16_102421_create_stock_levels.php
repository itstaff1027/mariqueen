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
        // Create stock_levels table
        // Schema::create('stock_levels', function (Blueprint $table) {
        //     $table->id();
        //     $table->unsignedBigInteger('product_variant_id');
        //     $table->unsignedBigInteger('warehouse_id'); // Ensure matching type with warehouses.id
        //     $table->foreign('product_variant_id')
        //         ->references('id')
        //         ->on('product_variants')
        //         ->onDelete('cascade');
        //     $table->foreign('warehouse_id')
        //         ->references('id')
        //         ->on('warehouses')
        //         ->onDelete('cascade');
        //     $table->integer('quantity')->default(0);
        //     $table->timestamps();
        // });

        
        // // Create stock_movements table
        // Schema::create('stock_movements', function (Blueprint $table) {
        //     $table->id();
        //     $table->unsignedBigInteger('product_variant_id');
        //     $table->foreignId('product_variant_id')->references('id')->constrained('product_variants')->onDelete('cascade');
        //     $table->integer('quantity');
        //     $table->enum('movement_type', ['purchase', 'sale', 'transfer', 'return']);
        //     $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
        //     $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
        //     $table->timestamps();
        // });

        // Schema::create('product_variants', function (Blueprint $table) {
        //     $table->id();// Ensure using auto-incrementing id
        //     $table->foreignId('product_id')->constrained()->onDelete('cascade');
        //     $table->foreignId('color_id')->constrained()->onDelete('cascade');
        //     $table->foreignId('heel_height_id')->constrained()->onDelete('cascade');
        //     $table->foreignId('size_value_id')->constrained()->onDelete('cascade');
        //     $table->string('sku', 255); // Add SKU column
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stock_levels');
        Schema::dropIfExists('product_variants');
    }
};
