<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum QuestionType: string implements HasLabel
{
    /** One correct option. */
    case Single = 'single';

    /** Several correct options; all must be selected. */
    case Multiple = 'multiple';

    case TrueFalse = 'true_false';

    /** Put the options in the correct order. */
    case Ordering = 'ordering';

    /** Pair each left item with its right item. */
    case Matching = 'matching';

    /** Type the missing word or number. */
    case FillBlank = 'fill_blank';

    /**
     * Label shown in the admin panel.
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Single => 'Escolha única',
            self::Multiple => 'Escolha múltipla',
            self::TrueFalse => 'Verdadeiro ou falso',
            self::Ordering => 'Ordenar passos',
            self::Matching => 'Ligar colunas',
            self::FillBlank => 'Preencher espaço',
        };
    }
}
