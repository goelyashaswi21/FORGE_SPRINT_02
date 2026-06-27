<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrganizationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'slug' => Str::slug($this->faker->unique()->company()),
        ];
    }
}
