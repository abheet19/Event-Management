<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Event;

class CapacityDecreaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_decrease_capacity_below_current_attendees(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 10,
            'start_time' => now()->addHour(),
            'end_time' => now()->addHours(2),
        ]);

        // Register 4 attendees
        foreach ([
            ['n' => 'A', 'e' => 'a@example.com'],
            ['n' => 'B', 'e' => 'b@example.com'],
            ['n' => 'C', 'e' => 'c@example.com'],
            ['n' => 'D', 'e' => 'd@example.com'],
        ] as $u) {
            $this->postJson("/api/v1/events/{$event->id}/register", [
                'name' => $u['n'],
                'email' => $u['e'],
            ])->assertCreated();
        }

        // Try to reduce capacity to 3 -> should be 409
        $res = $this->putJson("/api/v1/events/{$event->id}", [
            'max_capacity' => 3,
        ]);
        $res->assertStatus(409);

        // Capacity remains unchanged
        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'max_capacity' => 10,
        ]);
    }
}
