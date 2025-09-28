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
        Schema::table('demande_adhesion', function (Blueprint $table) {
            // Supprime uniquement la contrainte FK
            $table->dropForeign(['sous_communaute_id']);

            // Ajoute la nouvelle contrainte FK vers sous_communautes
            $table->foreign('sous_communaute_id')
                ->references('id')
                ->on('sous_communautes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demande_adhesion', function (Blueprint $table) {
            $table->dropForeign(['sous_communaute_id']);
            $table->foreign('sous_communaute_id')
                ->references('id')
                ->on('communautes')
                ->onDelete('cascade');
        });
    }
};
