<?php

namespace App\Providers;

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void
    {
        // Override the login view
        Fortify::loginView(function () {
            return inertia('auth/login');
        });

        // Override the registration view
        Fortify::registerView(function () {
            return inertia('auth/register');
        });

        // Override the registration controller
        $this->app->bind(
            \Laravel\Fortify\Contracts\CreatesNewUsers::class,
            RegisteredUserController::class
        );
    }
}
