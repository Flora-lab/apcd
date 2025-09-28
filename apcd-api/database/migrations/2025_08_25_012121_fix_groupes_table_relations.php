<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('groupes', function (Blueprint $table) {
            // Vérifie si la colonne existe déjà
            if (Schema::hasColumn('groupes', 'sous_communaute_id')) {
                // Ajoute la contrainte FK seulement si elle n'existe pas déjà
                $table->foreign('sous_communaute_id')
                      ->references('id')
                      ->on('sous_communautes')
                      ->onDelete('cascade');
            }
        });
    }

    public function down(): void {
        Schema::table('groupes', function (Blueprint $table) {
            if (Schema::hasColumn('groupes', 'sous_communaute_id')) {
                $table->dropForeign(['sous_communaute_id']);
            }
        });
    }
};
