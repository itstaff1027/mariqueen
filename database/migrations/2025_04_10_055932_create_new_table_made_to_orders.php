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
        Schema::create('made_to_orders', function (Blueprint $table) {
            $table->id();
            $table->string('mto_order_number', 255)->unique();
            $table->string('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null'); // Store-wide discount
            $table->foreignId('courier_id')->nullable()->constrained('couriers')->onDelete('set null');
            $table->string('shipping_cost', 255)->nullable();
            $table->string('rush_order_fee', 255)->nullable();
            $table->string('tracking_number', 255)->nullable();
            $table->enum('status', ['pending', 'paid', 'un-paid', 'partial', 'refunded', 'on-hold', 'received', 'preparing', 'shipped', 'delivered', 'cancelled', 'rejected', 'return', 'replacement', 'refund'])->default('pending');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('grand_amount', 10, 2);
            $table->decimal('balance', 10, 2);
            $table->decimal('excess', 10, 2);
            $table->enum('shoulder_by', ['bragais', 'client'])->default('bragais');
            $table->foreignId('packaging_type_id')->nullable()->constrained('packaging_types')->onDelete('set null');
            $table->longText('remarks')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('made_to_order_products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name', 255)->nullable();
            $table->string('color', 255)->nullable();
            $table->string('size', 255)->nullable();
            $table->string('heel_height', 255)->nullable();
            $table->string('type_of_heel', 255)->nullable();
            $table->string('round', 255)->nullable();
            $table->string('length', 255)->nullable();
            $table->string('back_strap', 255)->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('made_to_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('made_to_order_id')->constrained('made_to_orders')->onDelete('cascade'); // Link to main order
            $table->foreignId('made_to_order_product_id')->constrained('made_to_order_products')->onDelete('cascade'); // Product variant being sold
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null'); // Item-specific discount
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2); // Price per unit
            $table->decimal('total_price', 10, 2); // Calculated price (quantity * unit_price)
            $table->decimal('discount_amount', 10, 2)->nullable(); // Discount applied on this item
            $table->timestamps();
        });

        // Create sales_payments table
        Schema::create('made_to_order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('made_to_order_id')->constrained('made_to_orders')->onDelete('cascade');
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('change_due', 10, 2)->default(0); // If the client overpaid (excess)
            $table->decimal('remaining_balance', 10, 2)->default(0); // If the client underpaid (partial payment)
            $table->decimal('excess_amount', 10, 2)->default(0);
            $table->date('payment_date')->nullable();
            $table->longText('remarks')->nullable();
            $table->enum('status', ['pending', 'un-paid', 'cancelled', 'partial', 'paid', 'refunded'])->default('pending'); // Payment status
            $table->foreignId('payment_method_id')->constrained('payment_methods')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Cashier processing the payment
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('made_to_order_payments');
        Schema::dropIfExists('made_to_order_items');
        Schema::dropIfExists('made_to_order_products');
        Schema::dropIfExists('made_to_orders');
    }
};
