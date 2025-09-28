<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;
    
    protected $fillable = ['nom', 'description', 'image', 'communaute_id', 'created_by'];

    public function communaute()
    {
        return $this->belongsTo(Communaute::class);
    }

    public function membres()
    {
        return $this->belongsToMany(User::class, 'groupe_user')->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

