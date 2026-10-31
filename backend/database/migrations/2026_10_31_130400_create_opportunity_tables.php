<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->text('description');
            $table->string('area');
            $table->string('website')->nullable();
            $table->text('culture')->nullable();
            $table->string('status')->default('publicado');
            $table->timestamps();
        });

        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('summary');
            $table->text('description');
            $table->string('type')->index();
            $table->string('area')->index();
            $table->string('location');
            $table->string('modality');
            $table->json('responsibilities')->nullable();
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();
            $table->timestamp('deadline_at')->index();
            $table->string('cta_type')->default('candidatura');
            $table->string('cta_url')->nullable();
            $table->string('status')->default('aberta')->index();
            $table->string('banner')->nullable();
            $table->timestamps();
        });

        Schema::create('opportunity_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('opportunity_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('status')->default('registado');
            $table->timestamps();

            $table->unique(['user_id', 'opportunity_id']);
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('summary');
            $table->text('description');
            $table->string('type')->index();
            $table->string('organizer');
            $table->string('organizer_logo')->nullable();
            $table->timestamp('starts_at')->index();
            $table->timestamp('ends_at')->nullable();
            $table->string('location');
            $table->string('location_details')->nullable();
            $table->string('modality');
            $table->json('benefits')->nullable();
            $table->json('requirements')->nullable();
            $table->json('schedule')->nullable();
            $table->json('speakers')->nullable();
            $table->unsignedInteger('capacity');
            $table->boolean('is_closed')->default(false);
            $table->string('banner')->nullable();
            $table->json('gallery')->nullable();
            $table->timestamps();
        });

        Schema::create('experience_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('experience_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('inscrito');
            $table->timestamps();

            $table->unique(['user_id', 'experience_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experience_registrations');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('opportunity_applications');
        Schema::dropIfExists('opportunities');
        Schema::dropIfExists('companies');
    }
};
