<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use App\Events\SlaBreached;
use Illuminate\Console\Command;

class CheckSlaBreaches extends Command
{
    protected $signature = 'sla:check-breaches';
    protected $description = 'Detect tickets that have breached their SLA and flag them';

    public function handle(): int
    {
        $tickets = Ticket::whereNull('sla_breached_at')
            ->whereNotNull('sla_due_at')
            ->where('sla_due_at', '<', now())
            ->whereNotIn('status', ['resolved', 'closed'])
            ->get();

        $count = 0;
        foreach ($tickets as $ticket) {
            $ticket->update([
                'sla_breached' => true,
                'sla_breached_at' => now(),
            ]);

            $ticket->activities()->create([
                'organization_id' => $ticket->organization_id,
                'user_id' => $ticket->assignee_id ?? $ticket->requester_id,
                'action' => 'sla_breached',
                'meta' => json_encode(['sla_due_at' => $ticket->sla_due_at->toIso8601String()]),
            ]);

            event(new SlaBreached($ticket));
            $count++;
        }

        $this->info("Flagged {$count} breached tickets.");
        return self::SUCCESS;
    }
}
