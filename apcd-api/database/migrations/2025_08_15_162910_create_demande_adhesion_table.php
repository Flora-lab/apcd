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
        Schema::create('demande_adhesion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('communaute_id')->nullable()->constrained('communautes')->onDelete('cascade');
            $table->foreignId('sous_communaute_id')->nullable()->constrained('communautes')->onDelete('cascade'); // si c’est une sous-communauté
            $table->foreignId('groupe_id')->nullable()->constrained('groupes')->onDelete('cascade');
            $table->enum('status', ['en_attente', 'accepte', 'refuse'])->default('en_attente');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_adhesion');
    }
};
