<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales_payment_images', function (Blueprint $table) {
            $table->id();
            // Reference sales_payments; column must be nullable if you want to set null on delete
            $table->foreignId('sales_payment_id')
                  ->nullable()
                  ->constrained('sales_payments')
                  ->onDelete('set null');
            // Reference sales_orders; column must be nullable if you want to set null on delete
            $table->foreignId('sales_order_id')
                  ->nullable()
                  ->constrained('sales_orders')
                  ->onDelete('set null');
            $table->string('image', 1000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_payment_images');
    }
};
