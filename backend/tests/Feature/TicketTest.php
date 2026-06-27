<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Organization;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_only_tickets_in_own_org()
    {
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();
        $user1 = User::factory()->for($org1)->create(['role' => 'agent']);
        $user2 = User::factory()->for($org2)->create(['role' => 'agent']);
        Ticket::factory()->for($org1)->create(['requester_id' => $user1->id]);
        Ticket::factory()->for($org2)->create(['requester_id' => $user2->id]);

        Sanctum::actingAs($user1);
        $response = $this->getJson('/api/tickets');
        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_cannot_read_another_orgs_ticket()
    {
        $org1 = Organization::factory()->create();
        $org2 = Organization::factory()->create();
        $user1 = User::factory()->for($org1)->create(['role' => 'agent']);
        $ticket2 = Ticket::factory()->for($org2)->create(['requester_id' => User::factory()->for($org2)->create()->id]);

        Sanctum::actingAs($user1);
        $this->getJson("/api/tickets/{$ticket2->id}")
             ->assertForbidden();
    }
}
