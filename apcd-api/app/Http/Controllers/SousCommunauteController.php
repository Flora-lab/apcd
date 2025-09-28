<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SousCommunaute;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SousCommunauteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // Seules les personnes connectées
    }

    /**
     * Créer une sous-communauté rattachée à une communauté
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'communaute_id' => 'required|exists:communautes,id',
        ]);

        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Seul un administrateur peut créer une sous-communauté.'], 403);
        }

        $sub = new SousCommunaute();
        $sub->nom = $request->nom;
        $sub->description = $request->description;
        $sub->categorie = $request->categorie;
        $sub->communaute_id = $request->communaute_id;
        $sub->created_by = $user->id;

        if ($request->hasFile('image')) {
            $sub->image = $request->file('image')->store('sous_communautes', 'public');
        }

        $sub->save();

        // Ajouter automatiquement le créateur comme membre
        $sub->membres()->attach($user->id);

        return response()->json($sub, 201);
    }

    /**
     * Afficher une sous-communauté spécifique
     */
    public function show($id)
    {
        $sub = SousCommunaute::with(['membres', 'groupes'])->findOrFail($id);

        $user = Auth::user();
        $isMember = $sub->membres->contains($user->id);
        $isAdmin = $sub->created_by === $user->id || $user->role === 'admin';

        return response()->json([
            'id' => $sub->id,
            'nom' => $sub->nom,
            'description' => $sub->description,
            'categorie' => $sub->categorie,
            'image' => $sub->image,
            'nbMembres' => $sub->membres->count(),
            'groupes' => $sub->groupes,
            'communaute_id' => $sub->communaute_id,
            'created_by' => $sub->created_by,
            'isMember' => $isMember,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Ajouter un utilisateur à une sous-communauté
     */
    public function join($id)
    {
        $sub = SousCommunaute::findOrFail($id);
        $user = Auth::user();

        if ($sub->membres->contains($user->id)) {
            return response()->json(['message' => 'Vous êtes déjà membre.'], 400);
        }

        $sub->membres()->attach($user->id);

        return response()->json(['message' => 'Adhésion réussie.', 'user_id' => $user->id]);
    }

    /**
     * Retirer un utilisateur d'une sous-communauté
     */
    public function leave($id)
    {
        $sub = SousCommunaute::findOrFail($id);
        $user = Auth::user();

        if (!$sub->membres->contains($user->id)) {
            return response()->json(['message' => 'Vous n’êtes pas membre.'], 400);
        }

        $sub->membres()->detach($user->id);

        return response()->json(['message' => 'Vous avez quitté la sous-communauté.', 'user_id' => $user->id]);
    }
}
