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
        Schema::create('sales_order_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique(); // Unique return reference
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade'); // Link to original sales order
            $table->enum('return_type', ['return', 'replacement', 'refund'])->default('return'); // Type of return
            $table->dateTime('return_date')->nullable(); // When the return was processed
            $table->enum('status', ['pending', 'processing', 'complete', 'cancelled'])->default('pending'); // Status of the return
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade'); 
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        Schema::create('sales_order_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_return_id')->constrained('sales_order_returns')->onDelete('cascade'); // Link to return header
            $table->foreignId('sales_order_item_id')->constrained('sales_order_items')->onDelete('cascade'); // Which item is being returned
            $table->integer('quantity'); // How many items are returned/replaced
            $table->text('reason')->nullable(); // Optionally capture reason (e.g., size issue)
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_order_return_items');
        Schema::dropIfExists('sales_order_returns');
    }
};
