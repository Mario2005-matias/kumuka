<?php

namespace App\Filament\Resources\Experiences\RelationManagers;

use App\Models\Achievement;
use App\Models\ExperienceRegistration;
use App\Services\AchievementService;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\Select;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/**
 * Attendance tracking: marking a registration as "participou" unlocks the student's achievement.
 */
class RegistrationsRelationManager extends RelationManager
{
    protected static string $relationship = 'registrations';

    protected static ?string $title = 'Inscrições';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.profile.name')->label('Estudante')->placeholder('—')->searchable(),
                TextColumn::make('user.email')->label('Email')->searchable()->copyable(),
                SelectColumn::make('status')
                    ->label('Estado')
                    ->options(['inscrito' => 'Inscrito', 'confirmado' => 'Confirmado', 'participou' => 'Participou', 'cancelado' => 'Cancelado'])
                    ->selectablePlaceholder(false)
                    ->afterStateUpdated(function (ExperienceRegistration $record, string $state): void {
                        if ($state === 'participou') {
                            app(AchievementService::class)->unlock($record->user, Achievement::FIRST_EXPERIENCE);
                        }
                    }),
                TextColumn::make('created_at')->label('Inscrito em')->date('d/m/Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->headerActions([
                CreateAction::make()->label('Inscrever estudante')->modalHeading('Inscrever estudante'),
            ])
            ->recordActions([DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('Estudante')
                    ->relationship('user', 'email')
                    ->searchable()
                    ->required()
                    ->unique(ignoreRecord: true, modifyRuleUsing: fn ($rule) => $rule->where('experience_id', $this->getOwnerRecord()->getKey())),
                Select::make('status')
                    ->label('Estado')
                    ->options(['inscrito' => 'Inscrito', 'confirmado' => 'Confirmado', 'participou' => 'Participou', 'cancelado' => 'Cancelado'])
                    ->default('inscrito')
                    ->required(),
            ]);
    }
}
