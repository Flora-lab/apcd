<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\InvitationCode;

class AuthController extends Controller
{



    public function register(Request $request)
    {
        $request->validate([
            'full_name'     => 'required|string|max:255',
            'email'         => 'required|email|unique:users',
            'country_code'  => 'required|string',
            'phone_number'  => 'required|string|max:20',
            'address'       => 'required|string|max:255',
            'postal_code'   => 'required|string|max:20',
            'profession'    => 'required|string|max:255',
            'gender'        => 'required|in:male,female',
            'invitation_code' => 'required|string',
            'password'      => 'required|string|confirmed|min:6',
        ]);
    
        // Vérifier le code d’invitation
        $invitation = InvitationCode::where('code', $request->invitation_code)
            ->where('used', false) // non utilisé
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now()); // pas expiré
            })
            ->first();
    
        if (!$invitation) {
            return response()->json(['message' => 'Code d’invitation invalide ou expiré.'], 400);
        }
    
        // Créer l’utilisateur
        $user = User::create([
            'full_name'   => $request->full_name,
            'email'       => $request->email,
            'phone_number'=> $request->phone_number,
            'address'     => $request->address,
            'postal_code' => $request->postal_code,
            'country_code'=> $request->country_code,
            'profession'  => $request->profession,
            'gender'      => $request->gender,
            'password'    => Hash::make($request->password),
            'role'        => 'user', // rôle par défaut
        ]);
    
        // Marquer le code comme utilisé
        $invitation->update([
            'used'    => true,
            'used_by' => $user->id,
            'used_at' => now(),
        ]);
    
        return response()->json([
            'message' => 'Inscription réussie !',
            'user'    => $user
        ], 201);
    }
    

    /**
     * Login (admin ou user)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'role'  => $user->role, // important pour redirection côté React
            'token' => $token
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }

    /**
     * Récupérer l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
