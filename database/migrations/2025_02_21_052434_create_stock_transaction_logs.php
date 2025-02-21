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
        Schema::create('stock_transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_transaction_id')->constrained('stock_transactions')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null'); // ✅ Who made the change
            $table->enum('previous_status', ['draft', 'pending', 'approved', 'rejected'])->nullable(); // ✅ Old status
            $table->enum('new_status', ['draft', 'pending', 'approved', 'rejected']); // ✅ New status
            $table->longText('remarks')->nullable(); // ✅ Reason for status change
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transaction_logs');
    }
};
