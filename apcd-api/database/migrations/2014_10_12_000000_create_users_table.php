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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('country_code');
            $table->string('phone_number');
            $table->string('address')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('profession')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->string('invitation_code')->nullable();
            $table->string('role')->default('user'); // user / admin
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
