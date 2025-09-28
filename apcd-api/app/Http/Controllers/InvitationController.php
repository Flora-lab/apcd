<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InvitationCode;

class InvitationController extends Controller
{
    // Liste toutes les invitations (admin)
    public function index()
    {
        try {
            $invitations = InvitationCode::with([
                'createdBy:id,full_name',
                'usedBy:id,full_name'
            ])->latest()->get();
    
            return response()->json($invitations);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    // Génère un code aléatoire et le sauvegarde
    public function generate(Request $request)
    {
        $request->validate([
            'expires_at' => 'nullable|date|after:now'
        ]);

        try {
            $code = bin2hex(random_bytes(5)); // génère un code de 10 caractères

            $invitation = InvitationCode::create([
                'code' => $code,
                'created_by' => $request->user()->id,
                'expires_at' => now()->addDays(14),
            ]);

            return response()->json($invitation, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Supprime un code d'invitation
    public function delete($id)
    {
        try {
            $invitation = InvitationCode::findOrFail($id);
            $invitation->delete();

            return response()->json(['message' => 'Code supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
