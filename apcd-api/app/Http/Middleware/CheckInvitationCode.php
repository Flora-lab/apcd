<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\InvitationCode;

class CheckInvitationCode
{
    public function handle(Request $request, Closure $next)
    {
        $code = $request->input('invitation_code');

        $invitation = InvitationCode::where('code', $code)
            ->where('used', false)
            ->where(function($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->first();

        if (!$invitation) {
            return response()->json(['error' => 'Code d’invitation invalide ou expiré'], 403);
        }

        $request->invitation = $invitation;

        return $next($request);
    }
}
