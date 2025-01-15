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
        Schema::create('products', function (Blueprint $table) {
            // $table->engine = 'InnoDB';  // Ensure InnoDB engine is used
            $table->id();
            $table->string('product_name', 255);
            $table->string('status', 255);
            $table->timestamps();
        });

        Schema::create('products_images', function (Blueprint $table) {
            // $table->engine = 'InnoDB';  // Ensure InnoDB engine is used
            $table->id();
            $table->timestamps();
            $table->string('product_url', 255);
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('colors', function (Blueprint $table) {
            // $table->engine = 'InnoDB'; 
            $table->id();
            $table->timestamps();
            $table->string('color_name', 255);
            $table->string('hex', 255)->nullable();
        });

        Schema::create('products_colors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('color_id');
            // $table->unsignedBigInteger('order_type_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('color_id')->references('id')->on('colors')->onDelete('cascade');
            // $table->foreign('order_type_id')->references('id')->on('order_types')->onDelete('cascade');
        });

        Schema::create('order_types', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('order_type_name', 255);
        });

        Schema::create('sizes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('size_name', 255);
        });

        Schema::create('size_values', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('size_values', 5, 2);
            $table->unsignedBigInteger('size_id');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('cascade');
        });

        Schema::create('products_sizes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('size_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('heel_heights', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name', 255)->default('inches');
            $table->decimal('value', 5, 2);
        });

        Schema::create('products_heel_heights', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('heel_height_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('heel_height_id')->references('id')->on('heel_heights')->onDelete('cascade');
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('category_name', 255);
            $table->string('category_label', 255)->nullable();
        });

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
        Schema::dropIfExists('products_images'); // Drop the dependent table first
        Schema::dropIfExists('products_colors');
        Schema::dropIfExists('products_sizes');
        Schema::dropIfExists('products_heel_heights');
        Schema::dropIfExists('products_categories');

        Schema::dropIfExists('products');

        Schema::dropIfExists('colors');

        Schema::dropIfExists('size_values');
        Schema::dropIfExists('sizes');

        Schema::dropIfExists('heel_heights');

        Schema::dropIfExists('categories');

        Schema::dropIfExists('order_types');
    }
};
