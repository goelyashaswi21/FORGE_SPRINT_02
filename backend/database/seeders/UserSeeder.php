<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::first();
        $pwd = Hash::make('password');

        User::create(['organization_id' => $org->id, 'name' => 'Admin', 'email' => 'admin@acme.com', 'password' => $pwd, 'role' => 'admin']);
        User::create(['organization_id' => $org->id, 'name' => 'Agent 1', 'email' => 'agent1@acme.com', 'password' => $pwd, 'role' => 'agent']);
        User::create(['organization_id' => $org->id, 'name' => 'Agent 2', 'email' => 'agent2@acme.com', 'password' => $pwd, 'role' => 'agent']);
        User::create(['organization_id' => $org->id, 'name' => 'Customer 1', 'email' => 'customer1@acme.com', 'password' => $pwd, 'role' => 'customer']);
        User::create(['organization_id' => $org->id, 'name' => 'Customer 2', 'email' => 'customer2@acme.com', 'password' => $pwd, 'role' => 'customer']);
    }
}
