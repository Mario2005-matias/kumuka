<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[RouteKey('slug')]
#[Fillable(['slug', 'title', 'summary', 'category', 'body', 'status'])]
class Guide extends Model
{
    /**
     * @param  Builder<Guide>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', 'published');
    }
}
