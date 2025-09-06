<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimezoneConversionTest extends TestCase
{
    use RefreshDatabase;

    public function test_times_are_stored_in_utc_and_returned_in_requested_tz(): void
    {
        $payload = [
            'name' => 'TZ Event',
            'location' => 'IST',
            'start_time' => '2025-09-08T10:00:00', // Asia/Kolkata
            'end_time' => '2025-09-08T11:00:00',
            'max_capacity' => 5,
        ];

        $create = $this->postJson('/api/v1/events?tz=Asia/Kolkata', $payload);
        $create->assertCreated();
        $eventId = $create->json('id');

        // Fetch in UTC; times should be converted to UTC (Asia/Kolkata is +05:30)
        $showUtc = $this->getJson("/api/v1/events/{$eventId}?tz=UTC");
        $showUtc->assertOk();
        $this->assertSame('2025-09-08T04:30:00+00:00', $showUtc->json('start_time'));

        // Fetch in IST; times should match original input local time
        $showIst = $this->getJson("/api/v1/events/{$eventId}?tz=Asia/Kolkata");
        $showIst->assertOk();
        $this->assertSame('2025-09-08T10:00:00+05:30', $showIst->json('start_time'));
    }
}
