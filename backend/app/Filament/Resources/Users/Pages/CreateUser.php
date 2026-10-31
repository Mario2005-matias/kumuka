<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    /**
     * Accounts created here also get a profile, as accounts created through sign-up do.
     */
    protected function afterCreate(): void
    {
        $this->getRecord()->profile()->firstOrCreate();
    }
}
