<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        $isSelf = fn (): bool => $this->getRecord()->is(auth()->user());

        return [
            DeleteAction::make()->label('Suspender')->modalHeading('Suspender conta')->hidden($isSelf),
            ...UserResource::archiveHeaderActions(),
        ];
    }

    /**
     * Revoke API sessions when a password is changed here, so the student signs in again.
     */
    protected function afterSave(): void
    {
        if ($this->getRecord()->wasChanged('password')) {
            $this->getRecord()->tokens()->delete();
        }
    }
}
