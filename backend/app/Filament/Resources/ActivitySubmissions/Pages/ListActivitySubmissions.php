<?php

namespace App\Filament\Resources\ActivitySubmissions\Pages;

use App\Filament\Resources\ActivitySubmissions\ActivitySubmissionResource;
use Filament\Resources\Pages\ListRecords;

class ListActivitySubmissions extends ListRecords
{
    protected static string $resource = ActivitySubmissionResource::class;
}
