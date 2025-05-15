<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuthorizedRole>
 */
class AuthorizedRoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $route_name = [
            'dashboard',
            'admin-panel.create',
            'admin-panel.edit',
            'admin-panel.index',
            'admin-panel.show',
            'admin-permission.create',
            'admin-permission.edit',
            'admin-permission.index',
            'admin-permission.show',
            'admin-routes.create',
            'admin-routes.edit',
            'admin-routes.index',
            'admin-routes.show',
            'admin-user.create',
            'admin-user.edit',
            'admin-user.index',
            'admin-user.show',
        ];

        return [
            'route_name' => $route_name[array_rand($route_name)],
            'role_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
} 