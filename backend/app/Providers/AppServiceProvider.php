<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! $this->app->isProduction());

        RateLimiter::for('auth', fn (Request $request): Limit => Limit::perMinute(10)->by(
            Str::lower($request->string('email')->toString()).'|'.$request->ip(),
        ));

        RateLimiter::for('heartbeats', fn (Request $request): Limit => Limit::perMinute(30)->by(
            (string) ($request->user()?->id ?? $request->ip()),
        ));

        ResetPassword::createUrlUsing(fn (User $user, string $token): string => config('app.frontend_url')
            .'/auth/recuperar/'.$token.'?email='.urlencode($user->email));
    }
}
