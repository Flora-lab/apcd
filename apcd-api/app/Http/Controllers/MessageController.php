<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'groupe_id' => 'required|exists:groupes,id'
        ]);

        return Message::where('groupe_id', $request->groupe_id)
                      ->with('user')
                      ->orderBy('created_at', 'asc')
                      ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'groupe_id' => 'required|exists:groupes,id',
            'contenu' => 'nullable|string',
            'type' => 'required|string|in:texte,image,video,fichier',
            'fichier_path' => 'nullable|string',
        ]);

        $data['user_id'] = auth()->id();

        $message = Message::create($data);

        // Émettre un événement websocket (optionnel si tu veux le chat en temps réel)
        // broadcast(new \App\Events\MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }
}
