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
        // ✅ Create Stock Transactions Table (Parent Table)
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null'); // For transfers
            $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null'); // For stock addition or transfer
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null'); // Who created the request
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // Who approved the request
            $table->enum('transaction_type', ['purchase', 'return', 'adjustment', 'correction', 'repair', 'transfer']); // Defines what type of stock transaction
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft'); // Approval process
            $table->longText('remarks')->nullable(); // General remarks for transaction
            $table->timestamps();
        });

        // ✅ Create Stock Transaction Items Table (Child Table)
        Schema::create('stock_transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_transaction_id')->constrained('stock_transactions')->onDelete('cascade'); // Links items to transactions
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade'); // Product variant in the transaction
            $table->integer('quantity'); // Quantity of the product in this transaction
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transaction_items'); // Drop child table first to avoid constraint issues
        Schema::dropIfExists('stock_transactions');
    }
};
