<?php

namespace App\Http\Controllers;

use App\Models\Communaute;
use App\Models\Groupe;
use App\Models\DemandeAdhesion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandeAdhesionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // Seules les personnes connectées peuvent accéder
    }

    // Lister toutes les demandes pour un admin
    public function index()
    {
        $user = Auth::user();
    
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
    
        $demandes = DemandeAdhesion::with(['user', 'communaute', 'sousCommunauté', 'groupe'])
            ->where(function($query) use ($user) {
                // demandes pour les communautés créées par l'admin
                $query->whereHas('communaute', function($q) use ($user) {
                    $q->where('created_by', $user->id);
                })
                // ou demandes pour les sous-communautés créées par l'admin
                ->orWhereHas('sousCommunauté', function($q) use ($user) {
                    $q->where('created_by', $user->id);
                })
                // ou demandes pour les groupes créés par l'admin
                ->orWhereHas('groupe', function($q) use ($user) {
                    $q->where('created_by', $user->id);
                });
            })
            ->get();
    
        return response()->json($demandes);
    }    

    // Créer une nouvelle demande
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'communaute_id' => 'nullable|exists:communautes,id',
            'sous_communaute_id' => 'nullable|exists:communautes,id',
            'groupe_id' => 'nullable|exists:groupes,id',
        ]);

        // Vérifications des conditions d'adhésion
        if ($validated['communaute_id']) {
            $communaute = Communaute::find($validated['communaute_id']);
            if ($communaute->membres->contains($user->id)) {
                return response()->json(['message' => 'Vous êtes déjà membre de cette communauté.'], 400);
            }
        }

        if ($validated['sous_communaute_id']) {
            $sousCommunaute = Communaute::find($validated['sous_communaute_id']);
            $parentCommunaute = $sousCommunaute->parent;
            if (!$parentCommunaute || !$parentCommunaute->membres->contains($user->id)) {
                return response()->json(['message' => 'Vous devez être membre de la communauté principale pour rejoindre cette sous-communauté.'], 403);
            }
        }

        if ($validated['groupe_id']) {
            $groupe = Groupe::find($validated['groupe_id']);
            $communaute = $groupe->communaute;
            if (!$communaute->membres->contains($user->id)) {
                return response()->json(['message' => 'Vous devez être membre de la communauté ou sous-communauté pour rejoindre ce groupe.'], 403);
            }
        }

        $demande = DemandeAdhesion::create(array_merge($validated, ['user_id' => $user->id]));

        return response()->json(['message' => 'Demande envoyée avec succès', 'demande' => $demande], 201);
    }

    // Mettre à jour le statut d'une demande (accepter/refuser)
    public function update(Request $request, DemandeAdhesion $demandeAdhesion)
    {
        $validated = $request->validate([
            'status' => 'required|in:accepte,refuse'
        ]);

        $demandeAdhesion->update($validated);

        // Ajouter automatiquement l’utilisateur comme membre si accepté
        if ($validated['status'] === 'accepte') {
            if ($demandeAdhesion->communaute_id) {
                $demandeAdhesion->communaute->membres()->syncWithoutDetaching($demandeAdhesion->user_id);
            } elseif ($demandeAdhesion->sous_communaute_id) {
                $demandeAdhesion->sousCommunauté->membres()->syncWithoutDetaching($demandeAdhesion->user_id);
            } elseif ($demandeAdhesion->groupe_id) {
                $demandeAdhesion->groupe->membres()->syncWithoutDetaching($demandeAdhesion->user_id);
            }
        }

        return response()->json($demandeAdhesion);
    }

    // Supprimer une demande
    public function destroy(DemandeAdhesion $demandeAdhesion)
    {
        $demandeAdhesion->delete();
        return response()->json(['message' => 'Demande supprimée']);
    }
}
