<?php

namespace Database\Seeders;

use App\Models\Guide;
use App\Models\QuickLearning;
use App\Models\Trail;
use Illuminate\Database\Seeder;

/**
 * Seeds the learning catalogue. Former courses become trails without phases.
 */
class LearningContentSeeder extends Seeder
{
    use ReadsSeedData;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->seedData('trails') as $trail) {
            $this->seedTrail($trail, $trail['fases'] ?? [], $trail['certificado'] ?? false);
        }

        foreach ($this->seedData('courses') as $course) {
            $this->seedTrail($course, [], $course['certifica'] ?? false);
        }

        foreach ($this->seedData('quickLearnings') as $item) {
            QuickLearning::updateOrCreate(['slug' => $item['slug']], [
                'title' => $item['titulo'],
                'summary' => $item['descricao'],
                'category' => $item['categoria'],
                'duration_minutes' => $item['duracao'],
                'body' => $item['conteudo'],
                'status' => $item['status'],
            ]);
        }

        foreach ($this->seedData('guides') as $item) {
            Guide::updateOrCreate(['slug' => $item['slug']], [
                'title' => $item['titulo'],
                'summary' => $item['descricao'],
                'category' => $item['categoria'],
                'body' => $item['conteudo'],
                'status' => $item['status'],
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  list<array<string, mixed>>  $phases
     */
    private function seedTrail(array $data, array $phases, bool $hasCertificate): void
    {
        $trail = Trail::updateOrCreate(['slug' => $data['slug']], [
            'title' => $data['titulo'],
            'summary' => $data['descricao'],
            'description' => $data['descricaoLonga'],
            'category' => $data['categoria'],
            'core_competence' => $data['competenciaCentral'],
            'level' => $data['nivel'],
            'duration_minutes' => (int) round($data['duracao'] * 60),
            'expected_outcome' => $data['resultadoEsperado'],
            'target_audience' => $data['publicoAlvo'] ?? null,
            'prerequisites' => $data['preRequisitos'] ?? [],
            'learning_objectives' => $data['objetivosAprendizagem'] ?? [],
            'status' => $data['status'],
            'access' => $data['acesso'],
            'price' => $data['preco'],
            'image' => $data['imagem'],
            'has_certificate' => $hasCertificate,
            'is_sequential' => true,
        ]);

        if (! $trail->wasRecentlyCreated) {
            return;
        }

        $phaseIds = [];
        foreach ($phases as $phase) {
            $phaseIds[$phase['id']] = $trail->phases()->create([
                'title' => $phase['titulo'],
                'description' => $phase['descricao'] ?? null,
                'position' => $phase['ordem'],
            ])->id;
        }

        foreach ($data['modulos'] as $moduleData) {
            $module = $trail->modules()->create([
                'trail_phase_id' => $phaseIds[$moduleData['faseId'] ?? ''] ?? null,
                'title' => $moduleData['titulo'],
                'description' => $moduleData['descricao'],
                'position' => $moduleData['ordem'],
                'duration_minutes' => $moduleData['duracao'],
            ]);

            foreach ($moduleData['contentItems'] as $item) {
                $lesson = $module->lessons()->create([
                    'title' => $item['titulo'],
                    'duration_minutes' => 5,
                    'position' => $item['ordem'],
                ]);
                $lesson->blocks()->create(['type' => $item['tipo'], 'body' => $item['conteudo'], 'position' => 1]);
            }

            $activity = $moduleData['atividade'] ?? $moduleData['activity'] ?? null;

            if ($activity !== null && $activity['tipo'] === 'quiz') {
                foreach ($activity['perguntas'] ?? [] as $index => $question) {
                    $module->questions()->create([
                        'type' => 'single',
                        'prompt' => $question['enunciado'],
                        'options' => array_map(fn (array $option): array => [
                            'id' => $option['id'],
                            'text' => $option['texto'],
                            'correct' => $option['id'] === $question['respostaCorretaId'],
                        ], $question['opcoes']),
                        'position' => $index + 1,
                    ]);
                }
            } elseif ($activity !== null) {
                $module->activity()->create([
                    'type' => $activity['tipo'],
                    'prompt' => $activity['enunciado'],
                    'instructions' => $activity['instrucoes'],
                    'is_required' => $activity['obrigatoria'],
                    'points' => $activity['pontos'],
                ]);
            }
        }
    }
}
