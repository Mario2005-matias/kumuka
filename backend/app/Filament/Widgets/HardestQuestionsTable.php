<?php

namespace App\Filament\Widgets;

use App\Models\Question;
use App\Models\QuizAttempt;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

/**
 * Questions students get wrong most often in the last 90 days: a hint about which lessons need
 * better explanations.
 */
class HardestQuestionsTable extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Perguntas mais erradas (90 dias)';

    /**
     * Minimum answers before a question is ranked.
     */
    private const MIN_ANSWERS = 3;

    public function table(Table $table): Table
    {
        return $table
            ->records(fn (): array => $this->rankedQuestions())
            ->columns([
                TextColumn::make('prompt')->label('Pergunta')->limit(70)->wrap(),
                TextColumn::make('module')->label('Módulo')->limit(30),
                TextColumn::make('answers')->label('Respostas'),
                TextColumn::make('correct_rate')->label('Acerto')->suffix('%')->badge()
                    ->color(fn (int $state): string => $state < 50 ? 'danger' : 'warning'),
            ])
            ->paginated(false);
    }

    /**
     * @return array<string, array{prompt: string, module: string, answers: int, correct_rate: int}>
     */
    private function rankedQuestions(): array
    {
        $tally = [];

        QuizAttempt::query()
            ->whereNotNull('submitted_at')
            ->where('submitted_at', '>=', now()->subDays(90))
            ->select(['id', 'results'])
            ->lazyById(500)
            ->each(function (QuizAttempt $attempt) use (&$tally): void {
                foreach ($attempt->results ?? [] as $result) {
                    $id = (int) $result['questionId'];
                    $tally[$id]['answers'] = ($tally[$id]['answers'] ?? 0) + 1;
                    $tally[$id]['correct'] = ($tally[$id]['correct'] ?? 0) + ($result['correta'] ? 1 : 0);
                }
            });

        $ranked = collect($tally)
            ->filter(fn (array $row): bool => $row['answers'] >= self::MIN_ANSWERS)
            ->map(fn (array $row): int => (int) round($row['correct'] / $row['answers'] * 100))
            ->sort()
            ->take(10);

        $questions = Question::query()->with('module')->whereIn('id', $ranked->keys())->get()->keyBy('id');

        return $ranked
            ->filter(fn (int $rate, int $id): bool => $questions->has($id))
            ->mapWithKeys(fn (int $rate, int $id): array => [(string) $id => [
                'prompt' => $questions[$id]->prompt,
                'module' => $questions[$id]->module->title,
                'answers' => $tally[$id]['answers'],
                'correct_rate' => $rate,
            ]])
            ->all();
    }
}
