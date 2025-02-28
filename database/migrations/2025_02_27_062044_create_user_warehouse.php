<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('user_warehouse', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Assigns an agent to a warehouse
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade'); // Assigned warehouse
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_warehouse');
    }
};
