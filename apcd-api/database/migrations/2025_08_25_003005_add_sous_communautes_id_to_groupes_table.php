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
        Schema::table('groupes', function (Blueprint $table) {
            $table->foreignId('sous_communautes_id') // <-- nom correct
                  ->after('communaute_id')
                  ->constrained('sous_communautes') // <-- table correcte
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('groupes', function (Blueprint $table) {
            $table->dropForeign(['sous_communautes_id']);
            $table->dropColumn('sous_communautes_id');
        });
    }
};
