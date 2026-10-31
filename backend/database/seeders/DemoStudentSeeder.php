<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Creates a demo student for local development only.
 */
class DemoStudentSeeder extends Seeder
{
    use ReadsSeedData;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profile = $this->seedData('profiles')[0];

        $user = User::updateOrCreate(['email' => 'maria.silva@kumuka.ao'], [
            'name' => $profile['nome'],
            'password' => Hash::make('password'),
        ]);

        $user->profile()->updateOrCreate([], [
            'name' => $profile['nome'],
            'age' => 21,
            'situation' => $profile['situacao'],
            'interests' => $profile['interesses'],
            'goal' => $profile['objetivo'],
            'bio' => $profile['bio'],
            'competences' => $profile['competencias'],
            'onboarding_step' => 7,
            'onboarding_completed_at' => now(),
        ]);

        foreach ($this->seedData('projects') as $project) {
            $user->projects()->updateOrCreate(['slug' => $project['slug']], [
                'title' => $project['titulo'],
                'description' => $project['descricao'],
                'type' => $project['tipo'],
                'link' => $project['link'],
                'competences' => $project['competencias'],
            ]);
        }

        $experience = Experience::query()->orderBy('starts_at')->first();

        if ($experience !== null) {
            $user->experienceRegistrations()->updateOrCreate(['experience_id' => $experience->id], ['status' => 'inscrito']);
        }
    }
}
