<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Ticket $ticket): bool {
        return $user->organization_id === $ticket->organization_id;
    }
    public function create(User $user): bool {
        return in_array($user->role, ['admin', 'agent', 'customer']);
    }
    public function update(User $user, Ticket $ticket): bool {
        return $user->organization_id === $ticket->organization_id
            && in_array($user->role, ['admin', 'agent']);
    }
}
