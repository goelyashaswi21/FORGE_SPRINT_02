<?php

namespace App\Providers;

use App\Events\SlaBreached;
use App\Listeners\NotifySlaBreach;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(SlaBreached::class, NotifySlaBreach::class);
    }
}
