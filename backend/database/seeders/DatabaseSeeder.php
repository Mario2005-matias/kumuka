<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AchievementSeeder::class,
            PilotTrailSeeder::class,
            LearningContentSeeder::class,
            CurriculumSeeder::class,
            OpportunitySeeder::class,
            FaqSeeder::class,
        ]);

        $this->command->call('kumuka:covers');

        if (app()->environment('local')) {
            $this->call([DemoStudentSeeder::class, AdminUserSeeder::class]);
        }
    }
}
