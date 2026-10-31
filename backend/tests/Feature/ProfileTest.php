<?php

use App\Models\Achievement;
use App\Models\User;
use Database\Seeders\AchievementSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

it('lets the student edit and clear profile details', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->patchJson('/api/me/profile', [
        'nome' => 'Ana Lopes',
        'idade' => 21,
        'localizacao' => 'Luanda',
        'linkedin' => 'https://linkedin.com/in/ana',
        'bio' => 'Estudante de informática.',
    ])
        ->assertOk()
        ->assertJsonPath('data.localizacao', 'Luanda')
        ->assertJsonPath('data.linkedin', 'https://linkedin.com/in/ana');

    $this->patchJson('/api/me/profile', ['idade' => null, 'bio' => null])
        ->assertOk()
        ->assertJsonPath('data.idade', null)
        ->assertJsonPath('data.bio', '')
        ->assertJsonPath('data.nome', 'Ana Lopes');

    expect($user->fresh()->name)->toBe('Ana Lopes');
});

it('rejects links that are not web addresses', function () {
    $this->actingAs(User::factory()->create());

    $this->patchJson('/api/me/profile', ['portfolio' => 'javascript:alert(1)'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('portfolio');
});

it('uploads, replaces and removes the profile banner', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post('/api/me/profile/banner', ['imagem' => UploadedFile::fake()->image('capa.jpg', 1600, 500)], ['Accept' => 'application/json'])
        ->assertOk();
    $first = $user->profile()->sole()->banner;
    Storage::disk('public')->assertExists($first);

    $this->post('/api/me/profile/banner', ['imagem' => UploadedFile::fake()->image('nova.png')], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.banner', fn (string $url): bool => str_contains($url, "profiles/{$user->id}/"));
    Storage::disk('public')->assertMissing($first);

    $second = $user->profile()->sole()->banner;
    $this->deleteJson('/api/me/profile/banner')->assertOk()->assertJsonPath('data.banner', null);
    Storage::disk('public')->assertMissing($second);
});

it('only accepts images for the profile photo', function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());

    $this->post('/api/me/profile/foto', ['imagem' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf')], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('imagem');
});

it('edits and deletes only the student\'s own projects', function () {
    $owner = User::factory()->create();
    $project = $owner->projects()->create(['slug' => 'site-abc', 'title' => 'Site', 'description' => 'Primeiro site.', 'type' => 'tecnico']);
    $payload = ['titulo' => 'Site novo', 'descricao' => 'Versão melhorada.', 'tipo' => 'criativo'];

    $this->actingAs(User::factory()->create());
    $this->putJson("/api/me/projects/{$project->id}", $payload)->assertNotFound();
    $this->deleteJson("/api/me/projects/{$project->id}")->assertNotFound();

    $this->actingAs($owner);
    $this->putJson("/api/me/projects/{$project->id}", $payload)->assertOk()->assertJsonPath('data.titulo', 'Site novo');
    $this->deleteJson("/api/me/projects/{$project->id}")->assertNoContent();
    expect($owner->projects()->count())->toBe(0);
});
