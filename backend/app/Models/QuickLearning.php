<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[RouteKey('slug')]
#[Fillable(['slug', 'title', 'summary', 'category', 'duration_minutes', 'body', 'status'])]
class QuickLearning extends Model
{
    use SoftDeletes;

    /**
     * @param  Builder<QuickLearning>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', 'published');
    }
}
