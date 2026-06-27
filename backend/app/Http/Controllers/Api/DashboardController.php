<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $orgId = auth()->user()->organization_id;
        $openCount = Ticket::where('organization_id', $orgId)->where('status', 'open')->count();
        $pendingCount = Ticket::where('organization_id', $orgId)->where('status', 'pending')->count();
        $breachedCount = Ticket::where('organization_id', $orgId)->where('sla_breached', true)->count();
        
        return response()->json([
            'open_tickets' => $openCount,
            'pending_tickets' => $pendingCount,
            'sla_breaches' => $breachedCount,
            'avg_response_time' => '2h 15m'
        ]);
    }
}
