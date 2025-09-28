<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeAdhesion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'communaute_id',       // nullable si c'est une sous-communauté ou groupe
        'sous_communaute_id',  // nullable si c'est une communauté principale ou groupe
        'groupe_id',           // nullable si c'est une communauté ou sous-communauté
        'status',              // 'en_attente', 'accepte', 'refuse'
    ];

    // Relation avec l'utilisateur qui fait la demande
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Relation avec la communauté principale
    public function communaute() {
        return $this->belongsTo(Communaute::class, 'communaute_id');
    }

    // Relation avec la sous-communauté
    public function sousCommunaute() {
        return $this->belongsTo(Communaute::class, 'sous_communaute_id');
    }

    // Relation avec le groupe
    public function groupe() {
        return $this->belongsTo(Groupe::class);
    }
}
