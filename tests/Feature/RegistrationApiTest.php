<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Event;

class RegistrationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_and_duplicate(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 1,
            'start_time' => now()->addHour(),
            'end_time' => now()->addHours(2),
        ]);

        $res = $this->postJson("/api/v1/events/{$event->id}/register", [
            'name' => 'Jane',
            'email' => 'jane@example.com',
        ]);
        $res->assertCreated();

        $dup = $this->postJson("/api/v1/events/{$event->id}/register", [
            'name' => 'Jane',
            'email' => 'jane@example.com',
        ]);
        $dup->assertStatus(409);

        $full = $this->postJson("/api/v1/events/{$event->id}/register", [
            'name' => 'John',
            'email' => 'john@example.com',
        ]);
        $full->assertStatus(409);
    }
}
