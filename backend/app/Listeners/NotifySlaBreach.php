<?php

namespace App\Listeners;

use App\Events\SlaBreached;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class NotifySlaBreach implements ShouldQueue
{
    public function __construct()
    {
    }

    public function handle(SlaBreached $event): void
    {
        $ticket = $event->ticket;

        // Log the breach — hook in email/Slack notifications here
        Log::warning("SLA breached for ticket #{$ticket->id} in org {$ticket->organization_id}", [
            'subject' => $ticket->subject,
            'priority' => $ticket->priority,
            'sla_due_at' => $ticket->sla_due_at,
            'assignee_id' => $ticket->assignee_id,
        ]);

        // TODO: Send notification to assignee/admin
        // Notification::send($ticket->assignee, new SlaBreachNotification($ticket));
    }
}
