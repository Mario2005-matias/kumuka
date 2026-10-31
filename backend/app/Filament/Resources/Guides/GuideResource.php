<?php

namespace App\Filament\Resources\Guides;

use App\Filament\Resources\Guides\Pages\CreateGuide;
use App\Filament\Resources\Guides\Pages\EditGuide;
use App\Filament\Resources\Guides\Pages\ListGuides;
use App\Models\Guide;
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

class GuideResource extends Resource
{
    protected static ?string $model = Guide::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Aprendizagem';

    protected static ?int $navigationSort = 5;

    protected static ?string $modelLabel = 'guia';

    protected static ?string $pluralModelLabel = 'guias';

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
            'index' => ListGuides::route('/'),
            'create' => CreateGuide::route('/create'),
            'edit' => EditGuide::route('/{record}/edit'),
        ];
    }
}
