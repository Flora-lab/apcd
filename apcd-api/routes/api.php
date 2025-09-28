<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommunauteController;
use App\Http\Controllers\SousCommunauteController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\MessageController;

// -------------------- Auth --------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']); // unifie /me et /user
});

// -------------------- Admin --------------------
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function() {
    Route::post('/invitation/generate', [InvitationController::class,'generate']);
    Route::get('/invitations', [InvitationController::class,'index']);
    Route::delete('/invitation/{id}', [InvitationController::class,'delete']);
    Route::get('/users', [AdminController::class,'listUsers']);
    Route::put('/users/{id}/role', [AdminController::class,'updateRole']);
    Route::delete('/users/{id}', [AdminController::class,'deleteUser']); 
    Route::get('/my-invited-users', [AdminController::class, 'myInvitedUsers']);
});

// -------------------- Communautés --------------------
Route::middleware('auth:sanctum')->prefix('communautes')->group(function () {
    // Création / Modification admins
    Route::middleware('can:isAdmin')->group(function () {
        Route::post('/', [CommunauteController::class, 'store']);
        Route::put('/{communaute}', [CommunauteController::class, 'update']);
        Route::delete('/{communaute}', [CommunauteController::class, 'destroy']);
        Route::post('/{communaute}/avatar', [CommunauteController::class, 'updateAvatar']);
    });

    // Mise à jour avatar avec policy spécifique
    Route::middleware('can:updateAvatar,communaute')->put('/{communaute}/avatar', [CommunauteController::class, 'updateAvatar']);

    // Affichage pour tous les utilisateurs connectés
    Route::get('/', [CommunauteController::class, 'index']);
    Route::get('/{communaute}', [CommunauteController::class, 'show']);
});

// -------------------- Sous-communautés --------------------
Route::middleware('auth:sanctum')->prefix('subcommunautes')->group(function () {
    Route::get('/', [SousCommunauteController::class, 'index']); // liste toutes les sous-communautés
    Route::get('/{subcommunautes}', [SousCommunauteController::class, 'show']); // affiche une sous-communauté spécifique
    Route::post('/', [SousCommunauteController::class, 'store']); // création d'une sous-communauté
    Route::put('/{subcommunautes}', [SousCommunauteController::class, 'update']); // mise à jour
    Route::delete('/{subcommunautes}', [SousCommunauteController::class, 'destroy']); // suppression
});

// -------------------- Groupes --------------------
Route::middleware('auth:sanctum')->group(function () {
    // Création / Modification admins
    Route::middleware('can:isAdmin')->group(function () {
        Route::post('/groupes', [GroupeController::class, 'store']);
        Route::put('/groupes/{groupe}', [GroupeController::class, 'update']);
        Route::delete('/groupes/{groupe}', [GroupeController::class, 'destroy']);
    });

    // Affichage pour tous
    Route::get('/groupes', [GroupeController::class, 'index']);
    Route::get('/groupes/{groupe}', [GroupeController::class, 'show']);
});

// -------------------- Messages --------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']); // avec ?groupe_id=1
    Route::post('/messages', [MessageController::class, 'store']);
});
