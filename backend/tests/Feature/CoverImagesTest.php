<?php

use App\Models\Opportunity;
use App\Models\Trail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(fn () => Storage::fake('public'));

it('generates covers for records without an image and never replaces uploads', function () {
    $generated = Trail::factory()->create(['image' => null]);
    $uploaded = Trail::factory()->create(['image' => 'trails/foto-da-turma.jpg']);
    $opportunity = Opportunity::factory()->create(['banner' => null]);

    $this->artisan('kumuka:covers')->assertSuccessful();

    expect($generated->fresh()->image)->toBe("covers/trails/{$generated->slug}.svg")
        ->and($uploaded->fresh()->image)->toBe('trails/foto-da-turma.jpg')
        ->and($opportunity->fresh()->banner)->toStartWith('covers/opportunities/');
    Storage::disk('public')->assertExists("covers/trails/{$generated->slug}.svg");
    expect(Storage::disk('public')->get("covers/trails/{$generated->slug}.svg"))->toContain('<svg');
});

it('returns absolute image URLs from the API', function () {
    $trail = Trail::factory()->create(['image' => 'covers/trails/web.svg']);
    $this->actingAs(User::factory()->create());

    $this->getJson("/api/trails/{$trail->slug}")
        ->assertJsonPath('data.imagem', Storage::disk('public')->url('covers/trails/web.svg'));
});
