<?php

namespace App\Filament\Resources\Achievements;

use App\Filament\Concerns\AdminOnly;
use App\Filament\Resources\Achievements\Pages\CreateAchievement;
use App\Filament\Resources\Achievements\Pages\EditAchievement;
use App\Filament\Resources\Achievements\Pages\ListAchievements;
use App\Models\Achievement;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use UnitEnum;

/**
 * Achievements shown to students. Platform achievements are unlocked automatically and keep
 * their code; extra ones can be created and granted by hand from a student's page.
 */
class AchievementResource extends Resource
{
    use AdminOnly;

    protected static ?string $model = Achievement::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|UnitEnum|null $navigationGroup = 'Comunidade';

    protected static ?string $modelLabel = 'conquista';

    protected static ?string $pluralModelLabel = 'conquistas';

    protected static ?string $navigationLabel = 'Conquistas';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(120),
                TextInput::make('code')->label('Código')->required()->alphaDash()->unique(ignoreRecord: true)
                    ->disabled(fn (?Achievement $record): bool => $record?->isSystem() ?? false)
                    ->helperText(fn (?Achievement $record): ?string => $record?->isSystem() ? 'Usado pela plataforma para desbloquear automaticamente.' : null),
                Textarea::make('description')->label('Descrição')->required()->rows(2)->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Conquista')->searchable(),
                TextColumn::make('description')->label('Descrição')->limit(60)->wrap(),
                IconColumn::make('is_system')->label('Automática')->boolean()->state(fn (Achievement $record): bool => $record->isSystem()),
                TextColumn::make('users_count')->label('Estudantes')->counts('users')->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()->hidden(fn (Achievement $record): bool => $record->isSystem()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->using(fn (Collection $records) => $records->reject->isSystem()->each->delete()),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAchievements::route('/'),
            'create' => CreateAchievement::route('/create'),
            'edit' => EditAchievement::route('/{record}/edit'),
        ];
    }
}
