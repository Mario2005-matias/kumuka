<?php

namespace App\Filament\Resources\Users;

use App\Enums\UserRole;
use App\Filament\Concerns\AdminOnly;
use App\Filament\Concerns\ArchivesRecords;
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\RelationManagers\AchievementsRelationManager;
use App\Filament\Resources\Users\RelationManagers\EnrollmentsRelationManager;
use App\Filament\Resources\Users\RelationManagers\ProjectsRelationManager;
use App\Filament\Support\TableActions;
use App\Models\User;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Students and staff. "Eliminar" suspends the account (soft delete): the person can no
 * longer sign in, and the account can be restored.
 */
class UserResource extends Resource
{
    use AdminOnly, ArchivesRecords;

    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Comunidade';

    protected static ?string $modelLabel = 'utilizador';

    protected static ?string $pluralModelLabel = 'utilizadores';

    protected static ?string $navigationLabel = 'Utilizadores';

    protected static ?string $recordTitleAttribute = 'email';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Conta')
                    ->columns(2)
                    ->schema([
                        TextInput::make('email')->label('Email')->email()->required()->unique(ignoreRecord: true),
                        Select::make('role')->label('Papel')->options(UserRole::class)->default(UserRole::Student)->required()
                            ->disabled(fn (?User $record): bool => $record?->is(auth()->user()) ?? false)
                            ->helperText(fn (?User $record): ?string => $record?->is(auth()->user()) ? 'Não podes alterar o teu próprio papel.' : null),
                        TextInput::make('password')
                            ->label(fn (string $operation): string => $operation === 'create' ? 'Password' : 'Nova password')
                            ->helperText(fn (string $operation): ?string => $operation === 'edit' ? 'Deixa em branco para manter a actual.' : null)
                            ->password()
                            ->revealable()
                            ->minLength(8)
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state)),
                    ]),
                Section::make('Perfil')
                    ->relationship('profile')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')->label('Nome'),
                        TextInput::make('age')->label('Idade')->numeric()->minValue(10)->maxValue(99),
                        TextInput::make('situation')->label('Situação'),
                        TextInput::make('goal')->label('Objectivo'),
                        TagsInput::make('interests')->label('Interesses'),
                        TagsInput::make('competences')->label('Competências declaradas'),
                        Textarea::make('bio')->label('Bio')->rows(3)->columnSpanFull(),
                        DateTimePicker::make('onboarding_completed_at')->label('Onboarding concluído em')->native(false),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        $isSelf = fn (User $record): bool => $record->is(auth()->user());

        return $table
            ->recordTitleAttribute('email')
            ->columns([
                TextColumn::make('profile.name')->label('Nome')->placeholder('—')->searchable(),
                TextColumn::make('email')->label('Email')->searchable()->copyable(),
                TextColumn::make('role')->label('Papel')->badge(),
                TextColumn::make('enrollments_count')->label('Trilhas')->counts('enrollments')->sortable(),
                TextColumn::make('created_at')->label('Registo')->date('d/m/Y')->sortable(),
                TextColumn::make('deleted_at')->label('Suspenso em')->date('d/m/Y')->placeholder('—')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('role')->label('Papel')->options(UserRole::class),
                TableActions::trashedFilter()->label('Suspensos'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make()->label('Suspender')->modalHeading('Suspender conta')->hidden($isSelf),
                RestoreAction::make()->label('Reactivar'),
                ForceDeleteAction::make()->hidden($isSelf)
                    ->modalDescription('Apaga a conta e todo o progresso do estudante para sempre.'),
            ])
            ->toolbarActions(TableActions::bulk());
    }

    public static function getRelations(): array
    {
        return [
            EnrollmentsRelationManager::class,
            ProjectsRelationManager::class,
            AchievementsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
