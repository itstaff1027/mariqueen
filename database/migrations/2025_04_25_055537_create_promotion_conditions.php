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
        Schema::create('promotion_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->nullable()->constrained('promotions')->onDelete('set null');
            $table->string('conditional_type', 255);
            $table->string('conditional_id');
            $table->enum('discount_type', ['percentage', 'fixed']);
            $table->decimal('discount_value', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_conditions');
    }
};
