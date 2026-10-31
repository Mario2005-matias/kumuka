<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Opportunity;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Opportunity>
 */
class OpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'company_id' => fn () => Company::query()->create([
                'slug' => Str::slug(fake()->unique()->company()),
                'name' => fake()->company(),
                'description' => fake()->sentence(),
                'area' => 'Tecnologia',
            ])->id,
            'slug' => Str::slug($title),
            'title' => $title,
            'summary' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'type' => 'estagio',
            'area' => 'Tecnologia',
            'location' => 'Luanda',
            'modality' => 'presencial',
            'deadline_at' => now()->addWeeks(2),
            'cta_type' => 'candidatura',
            'status' => 'aberta',
        ];
    }
}
