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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('social_media_account', 255)->defualt('')->nullable();
            $table->string('gender', 255)->defualt('')->nullable();
            $table->string('birthday', 255)->defualt('')->nullable();
            $table->string('age', 255)->defualt('')->nullable();
            $table->string('region', 255)->defualt('')->nullable();
            $table->string('province', 255)->defualt('')->nullable();
            $table->string('city', 255)->defualt('')->nullable();
            $table->string('brgy', 255)->defualt('')->nullable();
            $table->string('street', 255)->defualt('')->nullable();
            $table->string('zip_code', 255)->defualt('')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'social_media_account',
                'gender', 
                'birthday', 
                'age', 
                'region', 
                'province', 
                'city', 
                'brgy', 
                'street', 
                'zip_code'
            ]);
        });
    }
};
