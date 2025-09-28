<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sous_communautes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('categorie')->nullable();
            $table->string('image')->nullable(); 
            $table->foreignId('communaute_id')->constrained('communautes')->onDelete('cascade'); // rattachement
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // admin créateur
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sous_communautes');
    }
};
