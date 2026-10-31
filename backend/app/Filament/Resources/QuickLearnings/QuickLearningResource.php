<?php

namespace App\Filament\Resources\QuickLearnings;

use App\Filament\Resources\QuickLearnings\Pages\CreateQuickLearning;
use App\Filament\Resources\QuickLearnings\Pages\EditQuickLearning;
use App\Filament\Resources\QuickLearnings\Pages\ListQuickLearnings;
use App\Models\QuickLearning;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class QuickLearningResource extends Resource
{
    protected static ?string $model = QuickLearning::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBolt;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = 'aprendizado rápido';

    protected static ?string $pluralModelLabel = 'aprendizados rápidos';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('title')->label('Título')->required()->maxLength(255)->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                TextInput::make('slug')->label('Endereço (slug)')->required()->alphaDash()->unique(ignoreRecord: true),
                TextInput::make('category')->label('Categoria')->required(),
                TextInput::make('duration_minutes')->label('Duração (minutos)')->numeric()->minValue(1)->required()->default(5),
                Select::make('status')->label('Estado')->options(['draft' => 'Rascunho', 'published' => 'Publicado', 'unpublished' => 'Despublicado'])->default('draft')->required(),
                Textarea::make('summary')->label('Resumo')->required()->rows(2)->columnSpanFull(),
                MarkdownEditor::make('body')->label('Conteúdo')->required()->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('Título')->searchable()->wrap(),
                TextColumn::make('category')->label('Categoria')->badge(),
                TextColumn::make('duration_minutes')->label('Min.'),
                TextColumn::make('status')->label('Estado')->badge()->color(fn (string $state): string => $state === 'published' ? 'success' : 'gray'),
                TextColumn::make('updated_at')->label('Actualizado')->since()->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListQuickLearnings::route('/'),
            'create' => CreateQuickLearning::route('/create'),
            'edit' => EditQuickLearning::route('/{record}/edit'),
        ];
    }
}
