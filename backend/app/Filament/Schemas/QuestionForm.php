<?php

namespace App\Filament\Schemas;

use App\Enums\QuestionType;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Utilities\Get;

/**
 * Form fields for a bank question. The answer fields change with the question type.
 */
class QuestionForm
{
    /**
     * @param  array<int, Component>  $extra  Fields shown before the answer fields.
     * @return array<int, Component>
     */
    public static function components(array $extra = []): array
    {
        $is = fn (QuestionType ...$types) => fn (Get $get): bool => in_array(self::type($get), $types, true);

        return [
            Select::make('type')
                ->label('Tipo de pergunta')
                ->options(QuestionType::class)
                ->default(QuestionType::Single)
                ->required()
                ->live(),
            ...$extra,
            Textarea::make('context')
                ->label('Cenário (opcional)')
                ->helperText('Uma situação real antes da pergunta. Ex.: "O teu chefe pede-te um relatório para amanhã…"')
                ->rows(2)
                ->columnSpanFull(),
            Textarea::make('prompt')->label('Pergunta')->required()->rows(2)->columnSpanFull(),

            Repeater::make('options')
                ->label(fn (Get $get): string => match (self::type($get)) {
                    QuestionType::Ordering => 'Passos na ordem certa',
                    QuestionType::Matching => 'Pares para ligar',
                    default => 'Opções',
                })
                ->helperText(fn (Get $get): string => match (self::type($get)) {
                    QuestionType::Ordering => 'Escreve os passos pela ordem correcta. O estudante vê-os baralhados.',
                    QuestionType::Matching => 'A coluna da direita é baralhada para o estudante.',
                    default => 'Marca a(s) opção(ões) certa(s).',
                })
                ->schema(fn (Get $get): array => match (self::type($get)) {
                    QuestionType::Ordering => [Hidden::make('id'), TextInput::make('text')->label('Passo')->required()],
                    QuestionType::Matching => [
                        Hidden::make('id'),
                        TextInput::make('left')->label('Esquerda')->required(),
                        TextInput::make('right')->label('Direita')->required(),
                    ],
                    default => [
                        Hidden::make('id'),
                        TextInput::make('text')->label('Texto')->required(),
                        Toggle::make('correct')->label('Certa')->inline(false),
                    ],
                })
                ->columns(2)
                ->minItems(2)
                ->maxItems(8)
                ->defaultItems(3)
                ->reorderable()
                ->visible($is(QuestionType::Single, QuestionType::Multiple, QuestionType::Ordering, QuestionType::Matching))
                ->columnSpanFull(),
            Radio::make('correct_boolean')
                ->label('Resposta certa')
                ->boolean('Verdadeiro', 'Falso')
                ->inline()
                ->required($is(QuestionType::TrueFalse))
                ->visible($is(QuestionType::TrueFalse)),
            TagsInput::make('accepted_answers')
                ->label('Respostas aceites')
                ->helperText('Variações aceites. Maiúsculas, acentos e espaços são ignorados.')
                ->required($is(QuestionType::FillBlank))
                ->visible($is(QuestionType::FillBlank))
                ->columnSpanFull(),

            Textarea::make('explanation')
                ->label('Explicação')
                ->helperText('Mostrada depois de responder. Explica porque a resposta certa está certa — é aqui que se aprende.')
                ->required()
                ->rows(3)
                ->columnSpanFull(),
            Toggle::make('is_active')->label('Activa')->default(true),
        ];
    }

    private static function type(Get $get): ?QuestionType
    {
        $type = $get('type');

        return $type instanceof QuestionType ? $type : QuestionType::tryFrom((string) $type);
    }
}
