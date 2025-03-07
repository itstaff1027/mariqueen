<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {

        // Create sales_orders table
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // Unique reference
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade'); // Warehouse stock is deducted from
            $table->foreignId('outlet_id')->nullable()->constrained('outlets')->onDelete('cascade'); // Store location tracking
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null'); // Store-wide discount
            $table->foreignId('courier_id')->nullable()->constrained('couriers')->onDelete('set null'); // Assigned courier
            $table->decimal('shipping_cost', 10, 2)->nullable(); // Shipping fee (fixed or user input)
            $table->decimal('rush_order_fee', 10, 2)->nullable(); // Additional cost for rush orders
            $table->string('tracking_number')->nullable(); // Tracking number for shipped orders
            $table->enum('status', ['pending', 'paid', 'preparing', 'on-hold', 'shipped', 'delivered', 'cancelled', 'rejected', 'return', 'replacement', 'refund'])->default('pending');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('grand_amount', 10, 2);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Cashier processing the order
            $table->timestamps();
        });

        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade'); // Link to main order
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // Product variant being sold
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null'); // Applied promo
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->onDelete('set null'); // Item-specific discount
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2); // Price per unit
            $table->decimal('total_price', 10, 2); // Calculated price (quantity * unit_price)
            $table->decimal('discount_amount', 10, 2)->nullable(); // Discount applied on this item
            $table->timestamps();
        });

        // Create sales_refunds table
        Schema::create('sales_refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade'); // Which order was refunded
            $table->decimal('refund_amount', 10, 2); // Amount refunded
            $table->text('reason')->nullable(); // Reason for refund
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Employee processing the refund
            $table->timestamps();
        });

        // Create sales_payments table
        Schema::create('sales_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade');
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('change_due', 10, 2)->default(0); // If the client overpaid (excess)
            $table->decimal('remaining_balance', 10, 2)->default(0); // If the client underpaid (partial payment)
            $table->decimal('excess_amount', 10, 2)->default(0);
            $table->enum('status', ['pending', 'partial', 'paid', 'refunded'])->default('pending'); // Payment status
            $table->foreignId('payment_method_id')->constrained('payment_methods')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Cashier processing the payment
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_refunds');
        Schema::dropIfExists('sales_payments');
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
    }
};
