<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class CheckAuthorizedRoute
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Get the current route's name
        $routeName = $request->route()->getName();

        // If there's no route name, skip further checks
        if (!$routeName) {
            return $next($request);
        }

        // Get the latest update timestamp for authorized routes for this route.
        $maxUpdatedAt = DB::table('authorized_roles')
            ->where('route_name', $routeName)
            ->max('updated_at');

        // Create a version based on updated_at (if none, use 'none')
        $version = $maxUpdatedAt ? Carbon::parse($maxUpdatedAt)->format('YmdHis') : 'none';

        // Build a cache key that includes the version.
        $cacheKey = "authorized_routes:{$routeName}:{$version}";

        // Retrieve allowed role IDs from the cache, or if not present, fetch from DB and cache them.
        $allowedRoleIds = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($routeName) {
            return DB::table('authorized_roles')
                ->where('route_name', $routeName)
                ->pluck('role_id')
                ->toArray();
        });

        // If no restrictions are set for this route, allow the request.
        if (empty($allowedRoleIds)) {
            return $next($request);
        }

        // Check if the authenticated user has any of the allowed roles.
        if (!$request->user() || !$request->user()->hasAnyRole($allowedRoleIds)) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
