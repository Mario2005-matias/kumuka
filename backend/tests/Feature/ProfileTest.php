<?php

use App\Models\Achievement;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('saves onboarding answers step by step and completes onboarding once', function () {
    $this->seed(AchievementSeeder::class);
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->patchJson('/api/me/profile', ['nome' => 'Ana', 'onboardingStep' => 3])
        ->assertOk()
        ->assertJsonPath('data.nome', 'Ana')
        ->assertJsonPath('data.onboardingStep', 3);

    $this->patchJson('/api/me/profile', ['onboardingStep' => 1])->assertJsonPath('data.onboardingStep', 3);

    $this->patchJson('/api/me/profile', ['interesses' => ['Tecnologia', 'Finanças'], 'onboardingCompleted' => true])
        ->assertJsonPath('data.onboardingCompleted', true);

    $this->getJson('/api/auth/me')->assertJsonPath('data.onboardingCompleted', true);
    $this->getJson('/api/me/achievements')->assertJsonPath('data.0.id', Achievement::PROFILE_COMPLETED)->assertJsonPath('data.0.unlocked', true);
});

it('adds portfolio projects', function () {
    $this->actingAs(User::factory()->create());

    $this->postJson('/api/me/projects', [
        'titulo' => 'Loja online',
        'descricao' => 'Site para um negócio local.',
        'tipo' => 'tecnico',
        'link' => 'https://github.com/exemplo/loja',
    ])->assertCreated()->assertJsonPath('data.titulo', 'Loja online');

    $this->getJson('/api/me/projects')->assertJsonCount(1, 'data');
});
