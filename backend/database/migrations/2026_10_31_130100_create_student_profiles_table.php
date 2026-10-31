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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('situation')->nullable();
            $table->json('interests')->nullable();
            $table->string('goal')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo')->nullable();
            $table->json('competences')->nullable();
            $table->unsignedTinyInteger('onboarding_step')->default(0);
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('title');
            $table->text('description');
            $table->string('type');
            $table->string('link')->nullable();
            $table->json('competences')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
        Schema::dropIfExists('student_profiles');
    }
};
