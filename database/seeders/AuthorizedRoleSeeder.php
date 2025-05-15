<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin\AuthorizedRoles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AuthorizedRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

        foreach ($route_name as $route) {
            AuthorizedRoles::create([
                'route_name' => $route,
                'role_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
