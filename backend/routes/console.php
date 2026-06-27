<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// SLA breach detection — runs every 5 minutes
Schedule::command('sla:check-breaches')->everyFiveMinutes()
    ->withoutOverlapping()
    ->runInBackground();
