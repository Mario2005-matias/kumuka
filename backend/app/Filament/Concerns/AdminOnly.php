<?php

namespace App\Filament\Concerns;

use App\Enums\UserRole;

/**
 * Restricts a resource to administrators; content authors only see learning content.
 */
trait AdminOnly
{
    public static function canAccess(): bool
    {
        return auth()->user()?->role === UserRole::Admin;
    }
}
