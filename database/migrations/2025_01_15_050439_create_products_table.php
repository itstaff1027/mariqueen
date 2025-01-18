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
        // Create customers table
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255)->unique();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // Create product categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('category_name', 255);
            $table->string('category_label', 255)->nullable();
        });

        // Create products table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name', 255);
            // $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('status', 255);
            $table->decimal('cost', 10, 2);
            $table->decimal('srp', 10, 2);
            $table->timestamps();
        });

        // Create product images table
        Schema::create('products_images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('product_url', 255);
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        // Create colors table
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('color_name', 255);
            $table->string('hex', 255)->nullable();
        });

        // Create products_colors table
        Schema::create('products_colors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('color_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('color_id')->references('id')->on('colors')->onDelete('cascade');
        });

        // Create order types table
        Schema::create('order_types', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('order_type_name', 255);
        });

        // Create sizes table
        Schema::create('sizes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('size_name', 255);
        });

        // Create size values table
        Schema::create('size_values', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('size_values', 5, 2);
            $table->unsignedBigInteger('size_id');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('cascade');
        });

        // Create products_sizes table
        Schema::create('products_sizes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('size_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        // Create heel heights table
        Schema::create('heel_heights', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name', 255)->default('inches');
            $table->decimal('value', 5, 2);
        });

        // Create products_heel_heights table
        Schema::create('products_heel_heights', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('heel_height_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('heel_height_id')->references('id')->on('heel_heights')->onDelete('cascade');
        });

        // Create warehouses table
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // // Create batches table
        // Schema::create('batches', function (Blueprint $table) {
        //     $table->id();
        //     // This proudct_id should become product_variant_id for future development
        //     $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        //     $table->string('batch_number');
        //     $table->date('manufacture_date');
        //     $table->date('expiration_date')->nullable();
        //     $table->integer('quantity');
        //     $table->timestamps();
        // });

        // // Create serial_numbers table
        // Schema::create('serial_numbers', function (Blueprint $table) {
        //     $table->id();
        //     // this product_id sbhoud lbecome product_variant_id
        //     $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        //     $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
        //     $table->string('serial_number')->unique();
        //     $table->enum('status', ['available', 'sold', 'damaged', 'returned'])->default('available');
        //     $table->timestamps();
        // });


        // Create suppliers table
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->timestamps();
        });

        // Create sales_orders table
        // Schema::create('sales_orders', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('order_number');
        //     $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
        //     $table->enum('status', ['pending', 'preparing', 'shipped', 'delivered', 'cancelled']);
        //     $table->timestamps();
        // });

        // // Create sales_order_items table
        // Schema::create('sales_order_items', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade');
        //     // product id shoudl be product_variant_id
        //     // $table->foreignId('product_variant_id')->references('id')->constrained('product_variants')->onDelete('cascade');
        //     $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('set null');
        //     $table->string('serial_number')->nullable();
        //     $table->integer('quantity');
        //     $table->decimal('price', 10, 2);
        //     $table->decimal('total', 10, 2);
        //     $table->timestamps();
        // });

        // Create products_categories table
        Schema::create('products_categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
        Schema::dropIfExists('product');
        Schema::dropIfExists('products_categories');
        Schema::dropIfExists('products_colors');
        Schema::dropIfExists('products_sizes');
        Schema::dropIfExists('products_heel_heights');
        Schema::dropIfExists('products_images');

        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stock_levels');
        Schema::dropIfExists('serial_numbers');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('size_values');
        Schema::dropIfExists('sizes');
        Schema::dropIfExists('heel_heights');
        Schema::dropIfExists('colors');
        Schema::dropIfExists('order_types');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('batches');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
    
};
