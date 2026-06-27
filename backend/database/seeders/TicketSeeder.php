<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Organization;
use App\Models\Comment;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::first();
        $admin = User::where('role', 'admin')->first();
        $agents = User::where('role', 'agent')->get();
        $customers = User::where('role', 'customer')->get();

        $subjects = ['Login Issue', 'Cannot access billing', 'App crashes on start', 'Feature request: dark mode', 'Password reset not working', 'My account is locked', 'Export functionality error', 'Page loads too slow', 'Data sync failed', 'How to upgrade?', 'Payment declined', 'API rate limit exceeded'];

        for ($i = 0; $i < 12; $i++) {
            $customer = $customers[$i % 2];
            $agent = $i % 3 === 0 ? null : $agents[$i % 2];

            $ticket = Ticket::create([
                'organization_id' => $org->id,
                'subject' => $subjects[$i],
                'description' => 'I am experiencing an issue with ' . strtolower($subjects[$i]),
                'status' => ['open', 'pending', 'resolved', 'closed'][$i % 4],
                'priority' => ['low', 'medium', 'high', 'urgent'][$i % 4],
                'requester_id' => $customer->id,
                'assignee_id' => $agent ? $agent->id : null,
                'sla_due_at' => now()->addHours(24),
                'sla_breached' => false,
            ]);

            Comment::create([
                'organization_id' => $org->id,
                'ticket_id' => $ticket->id,
                'user_id' => $customer->id,
                'body' => 'Please help with this as soon as possible.',
                'is_internal' => false
            ]);

            if ($agent) {
                Comment::create([
                    'organization_id' => $org->id,
                    'ticket_id' => $ticket->id,
                    'user_id' => $agent->id,
                    'body' => 'Looking into this now.',
                    'is_internal' => false
                ]);
            }
        }
    }
}
