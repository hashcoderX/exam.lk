<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Seed the application's database with a default super admin account.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'superadmin@exam.lk'],
            [
                'name' => 'Super Admin',
                'role' => 'super_admin',
                'password' => 'Admin@12345',
                'email_verified_at' => now(),
            ]
        );
    }
}