<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketActivity;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $orgId = auth()->user()->organization_id;

        $baseQuery = Ticket::where('organization_id', $orgId);

        $openCount = (clone $baseQuery)->where('status', 'open')->count();
        $pendingCount = (clone $baseQuery)->where('status', 'pending')->count();

        // Compute breaches live instead of relying on stored boolean
        $breachedCount = (clone $baseQuery)
            ->where('sla_due_at', '<', now())
            ->whereNotIn('status', ['resolved', 'closed'])
            ->count();

        $atRiskCount = (clone $baseQuery)
            ->whereNotNull('sla_due_at')
            ->where('sla_due_at', '>', now())
            ->whereNotIn('status', ['resolved', 'closed'])
            ->get()
            ->filter(fn ($t) => $t->sla_status === 'at_risk')
            ->count();

        // Compute avg first-response time from activities
        $responseTimes = TicketActivity::whereHas('ticket', fn ($q) =>
                $q->where('organization_id', $orgId)
            )
            ->where('action', 'commented')
            ->where('created_at', '>', now()->subDays(30))
            ->get()
            ->map(function ($activity) {
                $ticket = $activity->ticket;
                if ($ticket && $ticket->created_at) {
                    return $ticket->created_at->diffInMinutes($activity->created_at);
                }
                return null;
            })
            ->filter();

        $avgResponseMinutes = $responseTimes->count() > 0
            ? round($responseTimes->avg())
            : 0;

        $avgResponseFormatted = $avgResponseMinutes > 0
            ? floor($avgResponseMinutes / 60) . 'h ' . ($avgResponseMinutes % 60) . 'm'
            : 'N/A';

        return response()->json([
            'open_tickets' => $openCount,
            'pending_tickets' => $pendingCount,
            'sla_breaches' => $breachedCount,
            'sla_at_risk' => $atRiskCount,
            'avg_response_time' => $avgResponseFormatted,
        ]);
    }
}
