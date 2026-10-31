<?php

use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists published questions publicly with the support contact', function () {
    config(['app.support_email' => 'apoio@kumuka.ao']);
    Faq::factory()->create(['question' => 'Visível?']);
    Faq::factory()->create(['question' => 'Rascunho?', 'is_published' => false]);

    $this->getJson('/api/faqs')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.pergunta', 'Visível?')
        ->assertJsonPath('suporte.email', 'apoio@kumuka.ao');
});

it('lets staff manage questions in the admin panel', function () {
    $faq = Faq::factory()->create();
    $this->actingAs(User::factory()->author()->create());

    $this->get('/admin/faqs')->assertOk();
    $this->get("/admin/faqs/{$faq->id}/edit")->assertOk();
});
