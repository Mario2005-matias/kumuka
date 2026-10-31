<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            Achievement::PROFILE_COMPLETED => ['Perfil Completo', 'Completa o perfil para apresentar os teus interesses.'],
            Achievement::FIRST_LEARNING => ['Primeira Aprendizagem', 'Conclui a tua primeira aprendizagem.'],
            Achievement::FIRST_ACTIVITY => ['Primeira Actividade', 'Conclui uma actividade de aprendizagem.'],
            Achievement::FIRST_PROJECT => ['Primeiro Projecto', 'Adiciona um projecto ao teu portefólio.'],
            Achievement::FIRST_EXPERIENCE => ['Primeira Experiência', 'Participa numa experiência em que te inscreveste.'],
            Achievement::FIRST_CERTIFICATE => ['Primeiro Certificado', 'Conclui uma trilha que disponibilize certificado.'],
            Achievement::FIRST_TRAIL => ['Primeira Trilha Concluída', 'Conclui todos os módulos de uma trilha de aprendizagem.'],
        ];

        foreach ($achievements as $code => [$title, $description]) {
            Achievement::updateOrCreate(['code' => $code], ['title' => $title, 'description' => $description]);
        }
    }
}
