<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketActivity extends Model
{
    use HasFactory;

    protected $fillable = ['organization_id', 'ticket_id', 'user_id', 'action', 'meta'];
    protected $casts = ['meta' => 'array'];

    public function organization() { return $this->belongsTo(Organization::class); }
    public function ticket() { return $this->belongsTo(Ticket::class); }
    public function user() { return $this->belongsTo(User::class); }
}
