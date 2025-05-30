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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number', 255)->unique();
            $table->date('manufacturing_date');
            $table->date('expiry_date');
            $table->date('received_date')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamps();
        });

        Schema::create('serial_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('restrict');
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('restrict');
            $table->string('serial_number')->unique();
            $table->enum('status', [
                'in_stock',
                'sold',
                'returned',
                'damaged',
                'replacement',
                'repaired',
                'lost',
                'expired',
                'invalid'
            ]);
            $table->integer('quantity');
            $table->foreignId('warehouse_id')->nullabel()->constrained('warehouses')->onDelete('restrict');
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamps();
        });

        Schema::create('batch_and_serial_numbers', function (Blueprint $table) {
            $table->foreignId('batch_id')->constrained('batches')->onDelete('restrict');
            $table->foreignId('serial_number')->constrained('serial_numbers')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_and_serial_numbers');
        Schema::dropIfExists('batches');
        Schema::dropIfExists('serial_numbers');
    }
};
