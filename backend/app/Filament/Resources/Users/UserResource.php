<?php

namespace App\Filament\Resources\Users;

use App\Enums\UserRole;
use App\Filament\Concerns\AdminOnly;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Admins promote staff (authors, admins) here. Students sign up through the app.
 */
class UserResource extends Resource
{
    use AdminOnly;

    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Comunidade';

    protected static ?string $modelLabel = 'utilizador';

    protected static ?string $pluralModelLabel = 'utilizadores';

    protected static ?string $recordTitleAttribute = 'email';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->label('Nome'),
                TextInput::make('email')->label('Email')->email()->disabled(),
                Select::make('role')->label('Papel')->options(UserRole::class)->required()
                    ->disabled(fn (?User $record): bool => $record?->is(auth()->user()) ?? false)
                    ->helperText('Não podes alterar o teu próprio papel.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('email')
            ->columns([
                TextColumn::make('profile.name')->label('Nome')->placeholder('—')->searchable(),
                TextColumn::make('email')->label('Email')->searchable(),
                TextColumn::make('role')->label('Papel')->badge(),
                TextColumn::make('enrollments_count')->label('Trilhas')->counts('enrollments'),
                TextColumn::make('created_at')->label('Registo')->date('d/m/Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('role')->label('Papel')->options(UserRole::class),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
