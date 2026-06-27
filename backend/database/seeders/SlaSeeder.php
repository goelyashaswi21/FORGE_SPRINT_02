<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SlaPolicy;
use App\Models\Organization;

class SlaSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::first();
        SlaPolicy::create(['organization_id' => $org->id, 'priority' => 'low', 'response_hours' => 24, 'resolution_hours' => 72]);
        SlaPolicy::create(['organization_id' => $org->id, 'priority' => 'medium', 'response_hours' => 12, 'resolution_hours' => 48]);
        SlaPolicy::create(['organization_id' => $org->id, 'priority' => 'high', 'response_hours' => 4, 'resolution_hours' => 24]);
        SlaPolicy::create(['organization_id' => $org->id, 'priority' => 'urgent', 'response_hours' => 1, 'resolution_hours' => 4]);
    }
}
