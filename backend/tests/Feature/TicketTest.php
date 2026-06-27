<?php

use App\Models\{User, Organization, Ticket};
use Laravel\Sanctum\Sanctum;

it('lists only tickets in own org', function() {
    $org1 = Organization::factory()->create();
    $org2 = Organization::factory()->create();
    $user1 = User::factory()->for($org1)->create(['role'=>'agent']);
    $user2 = User::factory()->for($org2)->create(['role'=>'agent']);
    Ticket::factory()->for($org1)->create(['requester_id'=>$user1->id]);
    Ticket::factory()->for($org2)->create(['requester_id'=>$user2->id]);
    Sanctum::actingAs($user1);
    $response = $this->getJson('/api/tickets');
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
});

it('cannot read another orgs ticket', function() {
    $org1 = Organization::factory()->create();
    $org2 = Organization::factory()->create();
    $user1 = User::factory()->for($org1)->create(['role'=>'agent']);
    $ticket2 = Ticket::factory()->for($org2)->create();
    Sanctum::actingAs($user1);
    $this->getJson("/api/tickets/{$ticket2->id}")
         ->assertForbidden();  // This is the adversarial probe
});
