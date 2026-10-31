<?php

namespace App\Filament\Resources\ActivitySubmissions;

use App\Enums\ActivityType;
use App\Filament\Resources\ActivitySubmissions\Pages\ListActivitySubmissions;
use App\Models\ActivitySubmission;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use UnitEnum;

/**
 * Practical tasks handed in by students: read answers, open links and download files.
 */
class ActivitySubmissionResource extends Resource
{
    protected static ?string $model = ActivitySubmission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 6;

    protected static ?string $modelLabel = 'entrega';

    protected static ?string $pluralModelLabel = 'entregas de tarefas';

    protected static ?string $navigationLabel = 'Entregas de tarefas';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['user.profile', 'activity.module.trail']);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextEntry::make('user.email')->label('Estudante'),
                TextEntry::make('activity.module.trail.title')->label('Trilha'),
                TextEntry::make('activity.module.title')->label('Módulo'),
                TextEntry::make('submitted_at')->label('Entregue em')->dateTime('d/m/Y H:i')->placeholder('Rascunho'),
                TextEntry::make('activity.prompt')->label('Enunciado')->columnSpanFull(),
                TextEntry::make('answer')->label('Resposta')->placeholder('—')->columnSpanFull()
                    ->url(fn (ActivitySubmission $record): ?string => $record->activity->type === ActivityType::Link ? $record->answer : null, shouldOpenInNewTab: true),
                TextEntry::make('file_path')->label('Ficheiro')->placeholder('Sem ficheiro')
                    ->formatStateUsing(fn (?string $state): ?string => $state === null ? null : basename($state)),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.profile.name')->label('Estudante')->placeholder('—')->searchable(),
                TextColumn::make('user.email')->label('Email')->searchable(),
                TextColumn::make('activity.module.trail.title')->label('Trilha')->limit(30),
                TextColumn::make('activity.module.title')->label('Módulo')->limit(30),
                TextColumn::make('activity.type')->label('Tipo')->badge(),
                TextColumn::make('submitted_at')->label('Entregue em')->dateTime('d/m/Y H:i')->placeholder('Rascunho')->sortable(),
            ])
            ->defaultSort('submitted_at', 'desc')
            ->filters([
                TernaryFilter::make('submitted')->label('Estado')->trueLabel('Entregues')->falseLabel('Rascunhos')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('submitted_at'),
                        false: fn (Builder $query) => $query->whereNull('submitted_at'),
                    ),
                SelectFilter::make('trail')->label('Trilha')->relationship('activity.module.trail', 'title'),
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('download')
                    ->label('Ficheiro')
                    ->icon(Heroicon::OutlinedArrowDownTray)
                    ->visible(fn (ActivitySubmission $record): bool => $record->file_path !== null)
                    ->action(fn (ActivitySubmission $record): StreamedResponse => Storage::download($record->file_path)),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListActivitySubmissions::route('/'),
        ];
    }
}
