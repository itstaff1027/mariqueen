<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Create permissions
        $permissions = [
            'create',
            'edit',
            'update',
            'delete',
            'show',
            'view',
            'view all',
            'print',
            'export',
            'submit',
            'approve',
            'reject'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo($permissions);

        // Create a user and assign the role
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),  // Ensure this is hashed correctly
        ]);

        $adminUser = User::findOrFail(1);

        // Assign admin role to the user
        $adminUser->assignRole('admin');
    }
}
