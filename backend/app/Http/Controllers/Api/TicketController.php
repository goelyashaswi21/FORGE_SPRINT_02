<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\SlaPolicy;
use App\Models\TicketActivity;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TicketController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request) {
        $query = Ticket::where('organization_id', auth()->user()->organization_id)
            ->with(['requester','assignee']);
        if ($request->status) $query->where('status', $request->status);
        if ($request->priority) $query->where('priority', $request->priority);
        if ($request->assignee_id) $query->where('assignee_id', $request->assignee_id);
        if ($request->search) {
            $query->where(fn($q) => $q->where('subject','like','%'.$request->search.'%')
                                      ->orWhere('description','like','%'.$request->search.'%'));
        }
        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request) {
        $data = $request->validate(['subject'=>'required','description'=>'required',
            'priority'=>'in:low,medium,high,urgent']);
        $data['organization_id'] = auth()->user()->organization_id;
        $data['requester_id'] = auth()->id();
        $data['status'] = 'open';
        // Apply SLA
        $sla = SlaPolicy::where('organization_id', $data['organization_id'])
            ->where('priority', $data['priority'] ?? 'medium')->first();
        if ($sla) $data['sla_due_at'] = now()->addHours($sla->resolution_hours);
        
        $ticket = Ticket::create($data);
        TicketActivity::create(['organization_id'=>$data['organization_id'],
            'ticket_id'=>$ticket->id,'user_id'=>auth()->id(),'action'=>'created']);
        return response()->json($ticket->load(['requester','assignee']), 201);
    }

    public function show(Ticket $ticket) {
        $this->authorize('view', $ticket);
        return response()->json($ticket->load(['requester', 'assignee', 'comments.user', 'activities']));
    }

    public function update(Request $request, Ticket $ticket) {
        $this->authorize('update', $ticket);
        $data = $request->validate([
            'status' => 'in:open,pending,resolved,closed',
            'priority' => 'in:low,medium,high,urgent',
        ]);
        $ticket->update($data);
        TicketActivity::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'action' => 'updated'
        ]);
        return response()->json($ticket);
    }
    
    public function assign(Request $request, Ticket $ticket) {
        $this->authorize('update', $ticket);
        $data = $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);
        $ticket->update(['assignee_id' => $data['assignee_id']]);
        TicketActivity::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'action' => 'assigned'
        ]);
        return response()->json($ticket);
    }

    public function destroy(Ticket $ticket) {
        $this->authorize('update', $ticket);
        $ticket->delete();
        return response()->json(null, 204);
    }
}
