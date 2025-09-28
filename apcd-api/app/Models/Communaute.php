<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Communaute extends Model
{
    use HasFactory;
    
    protected $fillable = ['nom', 'description', 'categorie', 'image', 'created_by'];

    // Relation avec les membres
    public function membres()
    {
        return $this->belongsToMany(User::class, 'communaute_user', 'communaute_id', 'user_id')
                    ->withTimestamps();
    }

    // Relation avec les sous-communautés
    public function sousCommunautes()
    {
        return $this->hasMany(SousCommunaute::class, 'communaute_id');
    }

    // Nombre de membres
    public function getNbMembresAttribute()
    {
        return $this->membres()->count();
    }

    // Relation avec les groupes
    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }

    // Créateur de la communauté
    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
