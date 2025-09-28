<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\InvitationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{

    public function myInvitedUsers()
    {
        // récupère les invitations générées par l'admin connecté
        $invitations = InvitationCode::where('created_by', Auth::id())
            ->whereNotNull('used_by')
            ->with('usedBy')
            ->get();

        // extrait les utilisateurs uniques
        $users = $invitations->pluck('usedBy')->unique('id')->values();

        return response()->json($users);
    }

    public function generateInvitation(Request $request)
    {
        $request->validate([
            'expires_at' => 'nullable|date|after:now',
        ]);

        $code = bin2hex(random_bytes(5)); // code aléatoire 10 caractères

        $invitation = InvitationCode::create([
            'code' => $code,
            'created_by' => auth()->id(),
            'expires_at' => $request->expires_at,
        ]);

        return response()->json([
            'success' => true,
            'code' => $invitation->code,
        ]);
    }

      // Liste des utilisateurs invités
    public function listUsers()
    {
        $users = User::with('invitedBy:id,full_name') // on récupère aussi celui qui a invité
            ->orderBy('created_at', 'desc')
            ->get(['id','full_name','email','role','created_at','invited_by']);

        return response()->json($users);
    }

    // Modifier le rôle d’un utilisateur
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,user'
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'Rôle mis à jour avec succès',
            'user' => $user
        ]);
    }

    // Supprimer un utilisateur
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // on empêche de supprimer soi-même (optionnel)
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

}
