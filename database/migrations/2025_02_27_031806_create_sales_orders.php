<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Create couriers table
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Courier name (e.g., FedEx, DHL, etc.)
            $table->decimal('fixed_shipping_cost', 10, 2)->nullable(); // Predefined shipping cost
            $table->boolean('allow_custom_cost')->default(false); // Allow user input cost
            $table->timestamps();
        });

        // Create outlets table
        Schema::create('outlets', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Outlet Name (e.g., "Downtown Store")
            $table->string('location')->nullable(); // Address or store location
            $table->boolean('is_active')->default(true); // Enable/Disable outlets
            $table->timestamps();
        });

        // Create discounts table
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Discount Name (e.g., "Christmas Sale")
            $table->enum('type', ['fixed', 'percentage']); // Type of discount
            $table->decimal('value', 10, 2); // Discount amount or percentage
            $table->boolean('is_active')->default(true); // Enable/Disable discount
            $table->timestamps();
        });

        // Create promotions table
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the promotion (e.g., "Buy 1 Get 1 Free")
            $table->enum('type', ['bundle', 'bogo', 'discount']); // Type: Bundle, Buy One Get One (BOGO), or Discount
            $table->decimal('discount_value', 10, 2)->nullable(); // Discount amount (if applicable)
            $table->boolean('is_active')->default(true); // Enable/Disable the promo
            $table->timestamps();
        });

        // Create promotion_items table
        Schema::create('promotion_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->constrained('promotions')->onDelete('cascade'); // Link to promo
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // Item in the promo
            $table->integer('required_quantity')->default(1); // Quantity required for this item in the bundle
            $table->integer('free_quantity')->default(0); // Free quantity given (for BOGO)
            $table->timestamps();
        });

        // Create payment_methods table
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Payment method name (e.g., Cash, Credit Card)
            $table->boolean('is_active')->default(true); // Enable/Disable payment methods
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('promotion_items');
        Schema::dropIfExists('promotions');
        Schema::dropIfExists('discounts');
        Schema::dropIfExists('outlets');
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('payment_methods'); // Now it's safe to drop
    }
};
