<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Ticket;
use App\Models\TicketActivity;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Ticket $ticket)
    {
        if ($ticket->organization_id !== auth()->user()->organization_id) {
            abort(403);
        }
        $query = $ticket->comments()->with('user');
        if (auth()->user()->role === 'customer') {
            $query->where('is_internal', false);
        }
        return response()->json($query->oldest()->get());
    }

    public function store(Request $request, Ticket $ticket)
    {
        if ($ticket->organization_id !== auth()->user()->organization_id) {
            abort(403);
        }
        $data = $request->validate([
            'body' => 'required|string',
            'is_internal' => 'boolean'
        ]);
        
        if (auth()->user()->role === 'customer') {
            $data['is_internal'] = false;
        }

        $comment = $ticket->comments()->create([
            'organization_id' => $ticket->organization_id,
            'user_id' => auth()->id(),
            'body' => $data['body'],
            'is_internal' => $data['is_internal'] ?? false,
        ]);
        
        TicketActivity::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'action' => 'commented'
        ]);
        return response()->json($comment->load('user'), 201);
    }
}
