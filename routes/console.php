<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Tasks
|--------------------------------------------------------------------------
|
| Here you may define all of your scheduled tasks. These tasks will be
| run based on the schedule defined below.
|
*/

// Check price expiry daily at 8 AM
Schedule::command('prices:check-expiry')->dailyAt('08:00')->description('Notify buyers about expiring prices');
