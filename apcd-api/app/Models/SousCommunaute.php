<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SousCommunaute extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'categorie',
        'image',
        'communaute_id',
        'created_by'
    ];

    // Relation avec la communauté parente
    public function communaute()
    {
        return $this->belongsTo(Communaute::class, 'communaute_id');
    }

    // Relation avec le créateur
    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relation avec les membres
    public function membres()
    {
        return $this->belongsToMany(User::class, 'sous_communaute_user', 'sous_communaute_id', 'user_id')
                    ->withTimestamps();
    }

    // Relation avec les groupes
    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'sous_communaute_id');
    }
}
