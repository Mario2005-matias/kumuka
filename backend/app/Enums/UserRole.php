<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum UserRole: string implements HasLabel
{
    case Student = 'student';

    /** Full access to the admin panel. */
    case Admin = 'admin';

    /** Creates and edits learning content in the admin panel. */
    case Author = 'author';

    /**
     * Label shown in the admin panel.
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Student => 'Estudante',
            self::Admin => 'Administrador',
            self::Author => 'Autor de conteúdo',
        };
    }
}
