<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

/**
 * Kinds of content block a lesson can contain.
 */
enum LessonType: string implements HasLabel
{
    case Text = 'texto';
    case Video = 'video';
    case Pdf = 'pdf';
    case Image = 'imagem';
    case Link = 'link';

    /**
     * Label shown in the admin panel.
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Text => 'Texto',
            self::Video => 'Vídeo',
            self::Pdf => 'PDF',
            self::Image => 'Imagem',
            self::Link => 'Link externo',
        };
    }
}
