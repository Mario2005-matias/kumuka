<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Creates a local administrator for the admin panel. Local development only.
 */
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@kumuka.ao'], [
            'name' => 'Administrador KUMUKA',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
        ]);
    }
}
