<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Communaute;
use App\Models\Groupe;
use App\Models\SousCommunaute;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommunauteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // 🔒 Seules les personnes connectées
    }

    /**
     * Afficher toutes les communautés principales avec sous-communautés et groupes
     */
    public function index()
    {
        $communautes = Communaute::with(['membres', 'groupes'])->get()->map(function ($c) {
            $c->nbMembres = $c->membres->count();
            $totalGroupes = $c->groupes->count();
    
            // Charger les sous-communautés depuis la table dédiée
            $subCommunities = SousCommunaute::where('communaute_id', $c->id)
                ->with(['membres', 'groupes'])
                ->get()
                ->map(function ($s) use (&$totalGroupes) {
                    $nbGroupes = $s->groupes->count();
                    $totalGroupes += $nbGroupes;
    
                    return [
                        'id' => $s->id,
                        'nom' => $s->nom,
                        'description' => $s->description,
                        'categorie' => $s->categorie,
                        'image' => $s->image,
                        'nbMembres' => $s->membres->count(),
                        'groupes' => $s->groupes,
                        'nbGroupes' => $nbGroupes,
                        'created_by' => $s->created_by,
                    ];
                });
    
            return [
                'id' => $c->id,
                'nom' => $c->nom,
                'description' => $c->description,
                'categorie' => $c->categorie,
                'image' => $c->image,
                'nbMembres' => $c->nbMembres,
                'groupes' => $c->groupes,
                'totalGroupes' => $totalGroupes,
                'subCommunities' => $subCommunities,
                'created_by' => $c->created_by,
            ];
        });
    
        return response()->json($communautes);
    }

    /**
     * Créer une communauté
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string',
            'image' => 'nullable|image',
        ]);

        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403, "Seul un administrateur peut créer une communauté.");
        }

        $communaute = Communaute::create([
            'nom' => $request->nom,
            'description' => $request->description,
            'categorie' => $request->categorie,
            'image' => $request->image ? $request->image->store('communautes', 'public') : null,
            'created_by' => $user->id,
        ]);

        $communaute->membres()->attach($user->id);
        $communaute->load('membres');
        $communaute->nbMembres = $communaute->membres->count();

        return response()->json($communaute, 201);
    }

    /**
     * Afficher une communauté spécifique
     */
    public function show($id)
    {
        $communaute = Communaute::with(['membres', 'groupes', 'sousCommunautes.groupes'])->findOrFail($id);

        $user = Auth::user();
        $isMember = $communaute->membres->contains($user->id);
        $isAdmin = $communaute->created_by === $user->id || $user->role === 'admin';

        return response()->json([
            'id' => $communaute->id,
            'nom' => $communaute->nom,
            'description' => $communaute->description,
            'categorie' => $communaute->categorie,
            'image' => $communaute->image ?: null,
            'nbMembres' => $communaute->membres->count(),
            'groupes' => $communaute->groupes,
            'subCommunities' => $communaute->sousCommunautes,
            'isMember' => $isMember,
            'isAdmin' => $isAdmin,
        ]);
    }   

    /**
     * Mettre à jour une communauté
     */
    public function update(Request $request, Communaute $communaute)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $communaute->nom = $request->nom;

        if ($request->hasFile('avatar')) {
            if ($communaute->image) {
                Storage::disk('public')->delete($communaute->image);
            }
            $communaute->image = $request->file('avatar')->store('avatars', 'public');
        }

        $communaute->save();

        return response()->json([
            'message' => 'Communauté mise à jour avec succès !',
            'communaute' => $communaute
        ]);
    }

    /**
     * Mettre à jour l'avatar d'une communauté
     */
    public function updateAvatar(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $communaute = Communaute::findOrFail($id);

        $user = Auth::user();
        if ($communaute->created_by !== $user->id && $user->role !== 'admin') {
            abort(403, "Vous n'avez pas la permission de changer cet avatar.");
        }

        if ($request->hasFile('image')) {
            if ($communaute->image) {
                Storage::disk('public')->delete($communaute->image);
            }
            $path = $request->file('image')->store('communautes', 'public');
            $communaute->image = $path;
            $communaute->save();
        }

        return response()->json([
            'message' => 'Avatar mis à jour',
            'image' => $communaute->image,
        ]);
    }

    // /**
    //  * Créer une sous-communauté
    //  */
    // public function storeSubCommunity(Request $request, $id)
    // {
    //     $parent = Communaute::find($id);
    //     if (!$parent) {
    //         return response()->json(['message' => 'Communauté non trouvée'], 404);
    //     }

    //     $user = Auth::user();
    //     if ($parent->created_by !== $user->id && $user->role !== 'admin') {
    //         return response()->json(['message' => 'Non autorisé'], 403);
    //     }

    //     $request->validate([
    //         'nom' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'categorie' => 'nullable|string|max:255',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    //     ]);

    //     $sub = new Communaute();
    //     $sub->nom = $request->nom;
    //     $sub->description = $request->description;
    //     $sub->categorie = $request->categorie;
    //     $sub->parent_id = $parent->id;
    //     $sub->created_by = $user->id;

    //     if ($request->hasFile('image')) {
    //         $sub->image = $request->file('image')->store('communautes', 'public');
    //     }

    //     $sub->save();

    //     return response()->json($sub, 201);
    // }

    // /**
    //  * Afficher une sous-communauté
    //  */
    // public function showSubCommunity($id)
    // {
    //     $sub = Communaute::with(['membres', 'groupes'])->findOrFail($id);
    
    //     $user = Auth::user();
    //     $isMember = $sub->membres->contains($user->id);
    //     $isAdmin = $sub->created_by === $user->id || $user->role === 'admin';
    
    //     return response()->json([
    //         'id' => $sub->id,
    //         'nom' => $sub->nom,
    //         'image' => $sub->image ?: null,
    //         'description' => $sub->description ?: null,
    //         'categorie' => $sub->categorie ?: null,
    //         'nbMembres' => $sub->membres->count(),
    //         'nbGroupes' => $sub->groupes->count(),
    //         'groupes' => $sub->groupes->map(function ($g) {
    //             return [
    //                 'id' => $g->id,
    //                 'nom' => $g->nom,
    //                 'image' => $g->image,
    //                 'description' => $g->description,
    //                 'communaute_id' => $g->communaute_id,
    //                 'created_by' => $g->created_by,
    //                 'nbMembres' => $g->membres->count(),
    //             ];
    //         }),
    //         'parentId' => $sub->parent_id, // juste pour référence
    //         'created_by' => $sub->created_by,
    //         'isMember' => $isMember,
    //         'isAdmin' => $isAdmin,
    //     ]);
    // }
    


    // /**
    //  * Créer un groupe dans une communauté
    //  */
    // public function storeGroupe(Request $request)
    // {
    //     $request->validate([
    //         'nom' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'image' => 'nullable|image',
    //         'communaute_id' => 'required|exists:communautes,id',
    //     ]);

    //     $user = Auth::user();
    //     $communaute = Communaute::with('membres')->findOrFail($request->communaute_id);

    //     if (!$communaute->membres->contains($user->id)) {
    //         abort(403, "Vous devez être membre de la communauté pour créer un groupe.");
    //     }

    //     if ($user->role !== 'admin') {
    //         abort(403, "Seul un administrateur peut créer un groupe.");
    //     }

    //     $groupe = Groupe::create([
    //         'nom' => $request->nom,
    //         'description' => $request->description,
    //         'image' => $request->image ? $request->image->store('groupes', 'public') : null,
    //         'communaute_id' => $communaute->id,
    //         'created_by' => $user->id,
    //     ]);

    //     $groupe->membres()->attach($user->id);

    //     return response()->json([
    //         'message' => 'Groupe créé avec succès !',
    //         'groupe' => $groupe
    //     ], 201);
    // }
}
