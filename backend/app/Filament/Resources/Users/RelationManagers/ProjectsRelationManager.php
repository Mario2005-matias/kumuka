<?php

namespace App\Filament\Resources\Users\RelationManagers;

use App\Filament\Support\TableActions;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProjectsRelationManager extends RelationManager
{
    protected static string $relationship = 'projects';

    protected static ?string $title = 'Portefólio';

    protected static ?string $modelLabel = 'projecto';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(160)->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                TextInput::make('slug')->label('Endereço (slug)')->required()->alphaDash(),
                Select::make('type')->label('Tipo')->options(['tecnico' => 'Técnico', 'criativo' => 'Criativo'])->required(),
                TextInput::make('link')->label('Link')->url(),
                Textarea::make('description')->label('Descrição')->required()->rows(3)->columnSpanFull(),
                TagsInput::make('competences')->label('Competências')->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Projecto')->wrap(),
                TextColumn::make('type')->label('Tipo')->badge(),
                TextColumn::make('link')->label('Link')->url(fn ($record) => $record->link, shouldOpenInNewTab: true)->limit(40),
            ])
            ->headerActions([CreateAction::make()])
            ->recordActions(TableActions::row())
            ->toolbarActions(TableActions::bulk());
    }
}
