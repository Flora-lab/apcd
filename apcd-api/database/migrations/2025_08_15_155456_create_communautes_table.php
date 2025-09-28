<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('communautes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('categorie')->nullable(); // Ex : médecine, ingénierie
            $table->string('image')->nullable(); // profil ou bannière
            $table->foreignId('parent_id')->nullable()->constrained('communautes')->onDelete('cascade'); // sous-communauté
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // admin créateur
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('communautes');
    }
};
