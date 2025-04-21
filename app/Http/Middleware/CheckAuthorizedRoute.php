<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CheckAuthorizedRoute
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // If there’s no named route, skip permission checks entirely.
        $routeName = optional($request->route())->getName();
        if (! $routeName) {
            return $next($request);
        }

        // Map HTTP verbs to permission names:
        $verbMap = [
            'GET'    => 'view',
            'POST'   => 'create',
            'PUT'    => 'update',
            'PATCH'  => 'update',
            'DELETE' => 'delete',
        ];

        $method = $request->method();

        // If it's a write (POST/PUT/PATCH/DELETE)…
        if (isset($verbMap[$method]) && $method !== 'GET') {
            $ability = $verbMap[$method];

            // Grab only the permissions your roles grant
            $rolePermNames = $user
                ->getPermissionsViaRoles()
                ->pluck('name')
                ->toArray();

            if (! $user || ! in_array($ability, $rolePermNames, true)) {
                return Inertia::render('Errors/ErrorPage', ['status' => 403])
                              ->toResponse($request)
                              ->setStatusCode(403);
            }

            return $next($request);
        }

        //
        // Otherwise it’s a GET, so fall back to your route‑cache logic:
        //
        $maxUpdatedAt = DB::table('authorized_roles')
            ->where('route_name', $routeName)
            ->max('updated_at');
        $version  = $maxUpdatedAt
                    ? Carbon::parse($maxUpdatedAt)->format('YmdHis')
                    : 'none';
        $cacheKey = "authorized_routes:{$routeName}:{$version}";

        $allowedRoleIds = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($routeName) {
            return DB::table('authorized_roles')
                     ->where('route_name', $routeName)
                     ->pluck('role_id')
                     ->toArray();
        });

        if (! $user || ! $user->hasAnyRole($allowedRoleIds)) {
            return Inertia::render('Errors/ErrorPage', ['status' => 403])
                          ->toResponse($request)
                          ->setStatusCode(403);
        }

        return $next($request);
    }
}
