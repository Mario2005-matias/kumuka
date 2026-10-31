<?php

namespace App\Filament\Widgets;

use App\Models\TrailEnrollment;
use App\Models\TrailModule;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shows where students stop: for each module, how many of the trail's students completed it.
 */
class ModuleFunnelTable extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Onde os estudantes param';

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => TrailModule::query()
                ->whereHas('trail', fn (Builder $query) => $query->where('status', 'published')->whereHas('enrollments'))
                ->with('trail')
                ->withCount('completions')
                ->addSelect(['enrolled_count' => TrailEnrollment::query()
                    ->selectRaw('count(*)')
                    ->whereColumn('trail_enrollments.trail_id', 'trail_modules.trail_id'),
                ]))
            ->columns([
                TextColumn::make('trail.title')->label('Trilha')->limit(35),
                TextColumn::make('position')->label('#'),
                TextColumn::make('title')->label('Módulo')->limit(40),
                TextColumn::make('enrolled_count')->label('Inscritos na trilha'),
                TextColumn::make('completions_count')->label('Concluíram'),
                TextColumn::make('completion_rate')
                    ->label('Taxa')
                    ->state(fn (TrailModule $record): string => $record->enrolled_count > 0
                        ? round($record->completions_count / $record->enrolled_count * 100).'%'
                        : '—')
                    ->badge()
                    ->color(fn (TrailModule $record): string => $record->enrolled_count > 0 && $record->completions_count / $record->enrolled_count < 0.4 ? 'danger' : 'success'),
            ])
            ->defaultSort('trail_id')
            ->paginated([10, 25]);
    }
}
