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
        Schema::create('trails', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('summary');
            $table->text('description');
            $table->string('category')->index();
            $table->string('core_competence');
            $table->string('level')->index();
            $table->unsignedSmallInteger('duration_minutes')->default(0);
            $table->text('expected_outcome');
            $table->text('target_audience')->nullable();
            $table->json('prerequisites')->nullable();
            $table->json('learning_objectives')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('access')->default('free');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('has_certificate')->default(false);
            $table->boolean('is_sequential')->default(true);
            $table->timestamps();
        });

        Schema::create('trail_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trail_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('position');
            $table->timestamps();
        });

        Schema::create('trail_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trail_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trail_phase_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('position');
            $table->unsignedSmallInteger('duration_minutes')->default(0);
            $table->timestamps();

            $table->index(['trail_id', 'position']);
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trail_module_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->longText('body')->nullable();
            $table->string('media_url')->nullable();
            $table->unsignedInteger('media_duration_seconds')->nullable();
            $table->unsignedInteger('min_engaged_seconds')->nullable();
            $table->unsignedTinyInteger('completion_threshold')->default(90);
            $table->boolean('is_required')->default(true);
            $table->unsignedSmallInteger('position');
            $table->timestamps();
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trail_module_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->text('prompt');
            $table->text('instructions')->nullable();
            $table->boolean('is_required')->default(true);
            $table->unsignedSmallInteger('points')->default(0);
            $table->unsignedTinyInteger('passing_score')->default(70);
            $table->json('questions')->nullable();
            $table->timestamps();
        });

        Schema::create('trail_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trail_id')->constrained()->cascadeOnDelete();
            $table->foreignId('current_module_id')->nullable()->constrained('trail_modules')->nullOnDelete();
            $table->unsignedTinyInteger('percent')->default(0);
            $table->timestamp('started_at');
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'trail_id']);
        });

        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('engaged_seconds')->default(0);
            $table->text('watched_segments')->nullable();
            $table->unsignedInteger('last_position_seconds')->nullable();
            $table->boolean('reached_end')->default(false);
            $table->timestamp('last_heartbeat_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });

        Schema::create('activity_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->longText('answer')->nullable();
            $table->string('file_path')->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('passed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'activity_id']);
        });

        Schema::create('module_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trail_module_id')->constrained()->cascadeOnDelete();
            $table->timestamp('completed_at');

            $table->unique(['user_id', 'trail_module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_completions');
        Schema::dropIfExists('activity_submissions');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('trail_enrollments');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('trail_modules');
        Schema::dropIfExists('trail_phases');
        Schema::dropIfExists('trails');
    }
};
