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
        // Inertia::share('routes', function () {
        //     $user = Auth::user();
        
        //     if ($user) {
        //         // Eager load the relationships you need, e.g., user_roles or allowedRoutes
        //         $user->load(relations: ['allowedRoutes', 'roles', 'roles.permissions']);
        //         // $allowedRoutes = $user->allowedRoutes->pluck('route_name')->toArray();
        //     } else {
        //         return [];
        //     }
        
        //     return [
        //         'user' => $user,
        //         // 'allowedRoutes' => $allowedRoutes,
        //     ];
        // });

        // Inertia::share([
            
        //     'auth' =>  function () {
        //     $user = Auth::user();
        
        //     if ($user) {
        //         // Eager load the relationships you need, e.g., user_roles or allowedRoutes
        //         $user->load(relations: ['allowedRoutes', 'roles', 'roles.permissions']);
        //         // $allowedRoutes = $user->allowedRoutes->pluck('route_name')->toArray();
        //     } else {
        //         return [];
        //     }
        
        //     return [
        //         'user' => $user,
        //         // 'allowedRoutes' => $allowedRoutes,
        //     ];
        // }]);
        
    }

    // public function boot(): void
    // {
    //     Vite::prefetch(concurrency: 3);

    //     Inertia::share([
    //         // we’ll still share the user object…
    //         'auth.user' => function () {
    //             return Auth::user()
    //                 ? Auth::user()->only(['id','name','email'])
    //                 : null;
    //         },

    //         // …and now a “can” map of all your route‐abilities:
    //         'auth.can' => function () {
    //             $user = Auth::user();
    //             if (! $user) {
    //                 return [];
    //             }

    //             // Grab every distinct route_name you’ve defined in authorized_roles
    //             $abilities = DB::table('authorized_roles')
    //                            ->distinct()
    //                            ->pluck('route_name');

    //             // Build an array: [ 'couriers.index' => true, 'orders.store' => false, … ]
    //             return collect($abilities)
    //                 ->mapWithKeys(function ($ability) use ($user) {
    //                     return [ $ability => Gate::allows($ability) ];
    //                 })->all();
    //         },
    //     ]);
    // }
}
