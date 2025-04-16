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
        Schema::create('made_to_order_payment_images', function (Blueprint $table) {
            $table->id();
            // Reference sales_payments; column must be nullable if you want to set null on delete
            $table->foreignId('mto_payment_id')
                ->nullable()
                ->constrained('made_to_order_payments')
                ->onDelete('set null');
            // Reference sales_orders; column must be nullable if you want to set null on delete
            $table->foreignId('mto_order_id')
                ->nullable()
                ->constrained('made_to_orders')
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
        Schema::dropIfExists('made_to_order_payment_images');
    }
};
