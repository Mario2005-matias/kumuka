<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Phase 1 of the learning model:
 * - lessons become containers of content blocks (video, text, PDF, image, link);
 * - each module gets a question bank used for lesson checkpoints and the module quiz;
 * - progress is measured by mastery (quizzes) instead of time spent on a page;
 * - users get a role so staff can use the admin panel.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student')->after('email')->index();
        });

        Schema::create('lesson_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title')->nullable();
            $table->longText('body')->nullable();
            $table->string('media_url')->nullable();
            $table->string('file_path')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedSmallInteger('position');
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trail_module_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_checkpoint')->default(false);
            $table->string('type');
            $table->text('context')->nullable();
            $table->text('prompt');
            $table->json('options')->nullable();
            $table->json('accepted_answers')->nullable();
            $table->boolean('correct_boolean')->nullable();
            $table->text('explanation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();

            $table->index(['trail_module_id', 'is_checkpoint', 'is_active']);
        });

        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trail_module_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->cascadeOnDelete();
            $table->json('question_ids');
            $table->json('answers')->nullable();
            $table->json('results')->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->boolean('passed')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'trail_module_id', 'lesson_id']);
        });

        Schema::create('lesson_block_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_block_id')->constrained()->cascadeOnDelete();
            $table->text('watched_segments')->nullable();
            $table->unsignedInteger('last_position_seconds')->nullable();
            $table->timestamp('last_heartbeat_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_block_id']);
        });

        Schema::table('trail_modules', function (Blueprint $table) {
            $table->unsignedTinyInteger('quiz_question_count')->default(10);
            $table->unsignedTinyInteger('quiz_passing_score')->default(80);
            $table->unsignedSmallInteger('quiz_cooldown_minutes')->default(5);
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->text('summary')->nullable()->after('title');
            $table->unsignedSmallInteger('duration_minutes')->default(5)->after('summary');
        });

        Schema::table('trail_enrollments', function (Blueprint $table) {
            $table->unsignedTinyInteger('mastery')->default(0)->after('percent');
        });

        $this->moveLessonContentIntoBlocks();
        $this->moveQuizActivitiesIntoQuestionBank();

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['type', 'body', 'media_url', 'media_duration_seconds', 'min_engaged_seconds']);
        });

        Schema::table('lesson_progress', function (Blueprint $table) {
            $table->dropColumn(['engaged_seconds', 'watched_segments', 'last_position_seconds', 'reached_end', 'last_heartbeat_at']);
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn(['passing_score', 'questions']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->unsignedTinyInteger('passing_score')->default(70);
            $table->json('questions')->nullable();
        });

        Schema::table('lesson_progress', function (Blueprint $table) {
            $table->unsignedInteger('engaged_seconds')->default(0);
            $table->text('watched_segments')->nullable();
            $table->unsignedInteger('last_position_seconds')->nullable();
            $table->boolean('reached_end')->default(false);
            $table->timestamp('last_heartbeat_at')->nullable();
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->string('type')->default('texto');
            $table->longText('body')->nullable();
            $table->string('media_url')->nullable();
            $table->unsignedInteger('media_duration_seconds')->nullable();
            $table->unsignedInteger('min_engaged_seconds')->nullable();
            $table->dropColumn(['summary', 'duration_minutes']);
        });

        Schema::table('trail_enrollments', function (Blueprint $table) {
            $table->dropColumn('mastery');
        });

        Schema::table('trail_modules', function (Blueprint $table) {
            $table->dropColumn(['quiz_question_count', 'quiz_passing_score', 'quiz_cooldown_minutes']);
        });

        Schema::dropIfExists('lesson_block_progress');
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('lesson_blocks');

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
    }

    /**
     * Each existing lesson keeps its content as a single block.
     */
    private function moveLessonContentIntoBlocks(): void
    {
        $now = now();

        DB::table('lessons')->orderBy('id')->each(function (object $lesson) use ($now): void {
            DB::table('lesson_blocks')->insert([
                'lesson_id' => $lesson->id,
                'type' => $lesson->type,
                'body' => $lesson->body,
                'media_url' => $lesson->media_url,
                'duration_seconds' => $lesson->media_duration_seconds,
                'position' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        });
    }

    /**
     * Quiz activities become questions in the module's bank; the activities themselves are removed.
     */
    private function moveQuizActivitiesIntoQuestionBank(): void
    {
        $now = now();

        DB::table('activities')->where('type', 'quiz')->orderBy('id')->each(function (object $activity) use ($now): void {
            foreach (json_decode((string) $activity->questions, true) ?? [] as $index => $question) {
                DB::table('questions')->insert([
                    'trail_module_id' => $activity->trail_module_id,
                    'type' => 'single',
                    'prompt' => $question['enunciado'],
                    'options' => json_encode(array_map(fn (array $option): array => [
                        'id' => $option['id'] ?? Str::lower(Str::random(6)),
                        'text' => $option['texto'],
                        'correct' => ($option['id'] ?? null) === $question['respostaCorretaId'],
                    ], $question['opcoes'])),
                    'position' => $index + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        });

        DB::table('activities')->where('type', 'quiz')->delete();
    }
};
