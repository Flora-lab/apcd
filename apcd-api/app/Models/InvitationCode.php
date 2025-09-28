<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvitationCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'created_by',
        'used_by',
        'expires_at',
        'used',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'used' => 'boolean',
    ];

    // Relation pour savoir qui a créé le code
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relation pour savoir qui a utilisé le code
    public function usedBy()
    {
        return $this->belongsTo(User::class, 'used_by');
    }

    // Si tu utilises 'creator' et 'user' dans list(), alias pour compatibilité :
    public function creator()
    {
        return $this->createdBy();
    }

    public function user()
    {
        return $this->usedBy();
    }
    
}
