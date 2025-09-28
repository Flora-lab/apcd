<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function index()
    {
        return Groupe::with(['communaute', 'membres'])->get();
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin');
        
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'communaute_id' => 'required|exists:communautes,id',
        ]);

        $data['created_by'] = auth()->id();

        $groupe = Groupe::create($data);

        // Ajouter automatiquement le créateur comme membre
        $groupe->membres()->attach(auth()->id());

        return response()->json($groupe, 201);
    }

    public function show(Groupe $groupe)
    {
        return $groupe->load(['communaute', 'membres', 'messages']);
    }

    public function update(Request $request, Groupe $groupe)
    {
        $this->authorize('update', $groupe);

        $data = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $groupe->update($data);

        return response()->json($groupe);
    }

    public function destroy(Groupe $groupe)
    {
        $this->authorize('delete', $groupe);
        $groupe->delete();

        return response()->json(['message' => 'Groupe supprimé']);
    }
}
