<?php

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Services\Analytics\Sales\SalesAnalyticsService;
use App\Repositories\Analytics\Sales\SalesAnalyticsRepository;
use App\Repositories\Inventory\Batches\BatchRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SalesAnalyticsRepository::class, function ($app) {
            return new SalesAnalyticsRepository();
        });

        $this->app->bind(SalesAnalyticsService::class, function ($app) {
            return new SalesAnalyticsService(
                $app->make(SalesAnalyticsRepository::class)
            );
        });
        
        $this->app->bind(BatchRepository::class, function ($app) {
            return new BatchRepository();
        });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Relation::morphMap([
            'product'          => \App\Models\Product::class,
            'product_variant'  => \App\Models\ProductVariant::class,
            'color'            => \App\Models\Color::class,
            'category'         => \App\Models\Categories::class,
            'heel_height'      => \App\Models\HeelHeight::class,
            // …any other types you use
          ]);
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
    //         // we'll still share the user object…
    //         'auth.user' => function () {
    //             return Auth::user()
    //                 ? Auth::user()->only(['id','name','email'])
    //                 : null;
    //         },

    //         // …and now a "can" map of all your route-abilities:
    //         'auth.can' => function () {
    //             $user = Auth::user();
    //             if (! $user) {
    //                 return [];
    //             }

    //             // Grab every distinct route_name you've defined in authorized_roles
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
