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
            $table->date('received_date');
            $table->text('description', 1000);
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });

        Schema::create('serial_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('serial_number', 255)->unique();
            $table->integer('quantity');
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
