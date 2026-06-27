<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = ['organization_id','subject','description','status',
                           'priority','requester_id','assignee_id','tags',
                           'sla_due_at','sla_breached','sla_breached_at',
                           'first_response_due_at','first_responded_at'];
    protected $casts = [
        'tags' => 'array',
        'sla_breached' => 'boolean',
        'sla_due_at' => 'datetime',
        'sla_breached_at' => 'datetime',
        'first_response_due_at' => 'datetime',
        'first_responded_at' => 'datetime',
    ];

    public function organization() { return $this->belongsTo(Organization::class); }
    public function requester() { return $this->belongsTo(User::class,'requester_id'); }
    public function assignee() { return $this->belongsTo(User::class,'assignee_id'); }
    public function comments() { return $this->hasMany(Comment::class); }
    public function activities() { return $this->hasMany(TicketActivity::class); }

    // ---- SLA Computed Accessors (real-time, not dependent on cron) ----

    public function getIsSlaBreachedAttribute(): bool
    {
        return $this->sla_due_at
            && $this->sla_due_at->isPast()
            && !in_array($this->status, ['resolved', 'closed']);
    }

    public function getSlaStatusAttribute(): string
    {
        if (!$this->sla_due_at) return 'none';
        if (in_array($this->status, ['resolved', 'closed'])) {
            return $this->sla_due_at->isPast() ? 'met_late' : 'met';
        }
        if ($this->sla_due_at->isPast()) return 'breached';

        $totalWindow = $this->created_at->diffInHours($this->sla_due_at);
        $hoursLeft = Carbon::now()->diffInHours($this->sla_due_at, false);

        if ($totalWindow > 0 && $hoursLeft < ($totalWindow * 0.25)) {
            return 'at_risk';
        }

        return 'on_track';
    }

    public function getHoursUntilSlaAttribute(): ?float
    {
        if (!$this->sla_due_at) return null;
        return round(Carbon::now()->diffInHours($this->sla_due_at, false), 1);
    }
}
