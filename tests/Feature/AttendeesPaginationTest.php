<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Event;

class AttendeesPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_attendees_pagination_metadata_and_counts(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 100,
            'start_time' => now()->addHour(),
            'end_time' => now()->addHours(2),
        ]);

        // Register 25 attendees
        for ($i = 1; $i <= 25; $i++) {
            $this->postJson("/api/v1/events/{$event->id}/register", [
                'name' => "User {$i}",
                'email' => "user{$i}@example.com",
            ])->assertCreated();
        }

        $res = $this->getJson("/api/v1/events/{$event->id}/attendees?per_page=10&page=2");
        $res->assertOk();
        $json = $res->json();

        $this->assertArrayHasKey('data', $json);
        $this->assertArrayHasKey('meta', $json);
        $this->assertCount(10, $json['data']);
        $this->assertSame(2, $json['meta']['current_page']);
        $this->assertSame(10, $json['meta']['per_page']);
        $this->assertSame(25, $json['meta']['total']);
        $this->assertSame(3, $json['meta']['last_page']);
    }
}
