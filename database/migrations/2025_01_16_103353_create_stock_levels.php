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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id(); // Ensure using auto-incrementing id
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('color_id')->constrained('colors')->onDelete('cascade');
            $table->foreignId('heel_height_id')->constrained('heel_heights')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('size_id')->constrained('sizes')->onDelete('cascade');
            $table->foreignId('size_value_id')->constrained('size_values')->onDelete('cascade');
            $table->string('sku', 255); // Add SKU column
            $table->timestamps();
        });
        
        // Create stock_levels table
        Schema::create('stock_levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_variant_id');
            $table->unsignedBigInteger('warehouse_id'); // Ensure matching type with warehouses.id
            $table->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants')
                ->onDelete('cascade');
            $table->foreign('warehouse_id')
                ->references('id')
                ->on('warehouses')
                ->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->timestamps();
        });

        
        // // Create stock_movements table
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->enum('movement_type', ['purchase', 'sale', 'transfer_in', 'transfer_out', 'return', 'adjustment', 'correction', 'repair']);
            $table->integer('quantity');
            // $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null'); // Optional for tracking orders
            $table->longText('remarks')->nullable(); // Use longText for lengthy remarks
            $table->timestamps();
        });
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
