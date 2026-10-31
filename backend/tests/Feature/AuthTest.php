<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

it('registers a student with an empty profile and returns a token', function () {
    $response = $this->postJson('/api/auth/register', [
        'email' => 'Ana@Kumuka.ao',
        'password' => 'segredo-forte',
        'password_confirmation' => 'segredo-forte',
    ]);

    $response->assertCreated()
        ->assertJsonPath('user.email', 'ana@kumuka.ao')
        ->assertJsonPath('user.onboardingCompleted', false)
        ->assertJsonStructure(['token']);

    expect(User::sole()->profile)->not->toBeNull();
});

it('rejects a duplicate email and short passwords', function () {
    User::factory()->create(['email' => 'ana@kumuka.ao']);

    $this->postJson('/api/auth/register', [
        'email' => 'ana@kumuka.ao',
        'password' => 'curta',
        'password_confirmation' => 'curta',
    ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
});

it('logs in with valid credentials only', function () {
    User::factory()->create(['email' => 'ana@kumuka.ao']);

    $this->postJson('/api/auth/login', ['email' => 'ana@kumuka.ao', 'password' => 'errada'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');

    $this->postJson('/api/auth/login', ['email' => 'ana@kumuka.ao', 'password' => 'password'])
        ->assertOk()
        ->assertJsonStructure(['user' => ['id', 'email'], 'token']);
});

it('requires a valid token and revokes it on logout', function () {
    $this->getJson('/api/auth/me')->assertUnauthorized();

    $user = User::factory()->create();
    $token = $user->createToken('spa')->plainTextToken;

    $this->withToken($token)->getJson('/api/auth/me')->assertOk()->assertJsonPath('data.email', $user->email);
    $this->withToken($token)->postJson('/api/auth/logout')->assertNoContent();

    expect($user->tokens()->count())->toBe(0);
});

it('rejects expired tokens', function () {
    $user = User::factory()->create();
    $token = $user->createToken('spa')->plainTextToken;

    $this->travel(config('sanctum.expiration') + 1)->minutes();

    $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
});

it('emails a reset link pointing at the frontend and resets the password', function () {
    Notification::fake();
    $user = User::factory()->create(['email' => 'ana@kumuka.ao']);
    $user->createToken('old');

    $this->postJson('/api/auth/forgot-password', ['email' => 'ana@kumuka.ao'])->assertOk();

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        return str_contains($notification->toMail($user)->actionUrl, config('app.frontend_url').'/auth/recuperar/');
    });

    $this->postJson('/api/auth/reset-password', [
        'token' => Password::createToken($user),
        'email' => 'ana@kumuka.ao',
        'password' => 'nova-password',
        'password_confirmation' => 'nova-password',
    ])->assertOk();

    expect($user->tokens()->count())->toBe(0);
    $this->postJson('/api/auth/login', ['email' => 'ana@kumuka.ao', 'password' => 'nova-password'])->assertOk();
});

it('does not reveal whether an email is registered', function () {
    $this->postJson('/api/auth/forgot-password', ['email' => 'ninguem@kumuka.ao'])->assertOk();
});
