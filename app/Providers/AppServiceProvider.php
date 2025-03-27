<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Share global auth data with Inertia
        Inertia::share('routes', function () {
            $user = Auth::user();
        
            if ($user) {
                // Eager load the relationships you need, e.g., user_roles or allowedRoutes
                $user->load(relations: ['allowedRoutes', 'roles', 'roles.permissions']);
                // $allowedRoutes = $user->allowedRoutes->pluck('route_name')->toArray();
            } else {
                return [];
            }
        
            return [
                'user' => $user,
                // 'allowedRoutes' => $allowedRoutes,
            ];
        });
        
    }
}
