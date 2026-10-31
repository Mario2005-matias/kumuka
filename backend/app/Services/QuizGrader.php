<?php

namespace App\Services;

use App\Enums\QuestionType;
use App\Models\Question;
use Illuminate\Support\Str;

/**
 * Grades answers and prepares questions for students without leaking the answers.
 */
class QuizGrader
{
    /**
     * Whether the answer is fully correct. Questions are all-or-nothing.
     */
    public function isCorrect(Question $question, mixed $answer): bool
    {
        $options = collect($question->options ?? []);

        return match ($question->type) {
            QuestionType::Single => is_string($answer)
                && (bool) ($options->firstWhere('id', $answer)['correct'] ?? false),
            QuestionType::Multiple => is_array($answer)
                && collect($answer)->sort()->values()->all() === $options->where('correct', true)->pluck('id')->sort()->values()->all(),
            QuestionType::TrueFalse => is_bool($answer) && $answer === $question->correct_boolean,
            QuestionType::Ordering => is_array($answer) && array_values($answer) === $options->pluck('id')->all(),
            QuestionType::Matching => is_array($answer)
                && $options->every(fn (array $pair): bool => ($answer[$pair['id']] ?? null) === $pair['id']),
            QuestionType::FillBlank => is_string($answer)
                && collect($question->accepted_answers ?? [])->contains(
                    fn (string $accepted): bool => $this->normalize($accepted) === $this->normalize($answer),
                ),
        };
    }

    /**
     * The correct answer in the same shape the client submits.
     */
    public function correctAnswer(Question $question): mixed
    {
        $options = collect($question->options ?? []);

        return match ($question->type) {
            QuestionType::Single => $options->firstWhere('correct', true)['id'] ?? null,
            QuestionType::Multiple => $options->where('correct', true)->pluck('id')->values()->all(),
            QuestionType::TrueFalse => $question->correct_boolean,
            QuestionType::Ordering => $options->pluck('id')->all(),
            QuestionType::Matching => $options->mapWithKeys(fn (array $pair): array => [$pair['id'] => $pair['id']])->all(),
            QuestionType::FillBlank => $question->accepted_answers[0] ?? null,
        };
    }

    /**
     * Question as shown to a student: no correct flags, shuffled where order would give it away.
     *
     * @return array<string, mixed>
     */
    public function forStudent(Question $question): array
    {
        $options = collect($question->options ?? []);

        return [
            'id' => (string) $question->id,
            'tipo' => $question->type->value,
            'contexto' => $question->context,
            'enunciado' => $question->prompt,
            'opcoes' => match ($question->type) {
                QuestionType::Single, QuestionType::Multiple => $options->map(fn (array $option): array => ['id' => $option['id'], 'texto' => $option['text']])->values()->all(),
                QuestionType::Ordering => $options->shuffle()->map(fn (array $option): array => ['id' => $option['id'], 'texto' => $option['text']])->values()->all(),
                default => null,
            },
            'esquerda' => $question->type === QuestionType::Matching
                ? $options->map(fn (array $pair): array => ['id' => $pair['id'], 'texto' => $pair['left']])->values()->all()
                : null,
            'direita' => $question->type === QuestionType::Matching
                ? $options->shuffle()->map(fn (array $pair): array => ['id' => $pair['id'], 'texto' => $pair['right']])->values()->all()
                : null,
            'multipla' => $question->type === QuestionType::Multiple,
        ];
    }

    /**
     * Feedback shown after an attempt is submitted.
     *
     * @return array<string, mixed>
     */
    public function feedback(Question $question, mixed $answer): array
    {
        return [
            'questionId' => (string) $question->id,
            'correta' => $this->isCorrect($question, $answer),
            'resposta' => $answer,
            'respostaCorreta' => $this->correctAnswer($question),
            'explicacao' => $question->explanation,
            'lessonId' => $question->lesson_id === null ? null : (string) $question->lesson_id,
        ];
    }

    private function normalize(string $value): string
    {
        return Str::of($value)->ascii()->lower()->squish()->trim(' .')->toString();
    }
}
