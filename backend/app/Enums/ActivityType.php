<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/**
 * Practical tasks a module may ask for. Knowledge checks live in the question bank.
 */
enum ActivityType: string implements HasLabel
{
    case Writing = 'escrita';
    case Upload = 'upload';
    case Link = 'link';

    /**
     * Label shown in the admin panel.
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Writing => 'Resposta escrita',
            self::Upload => 'Envio de ficheiro',
            self::Link => 'Link para o trabalho',
        };
    }
}
