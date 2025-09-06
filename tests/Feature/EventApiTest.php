<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_and_list_event_with_timezone(): void
    {
        $payload = [
            'name' => 'Test',
            'location' => 'BLR',
            'start_time' => '2025-09-08T10:00:00',
            'end_time' => '2025-09-08T11:00:00',
            'max_capacity' => 10,
        ];

        $res = $this->postJson('/api/v1/events?tz=Asia/Kolkata', $payload);
        $res->assertCreated();

        $list = $this->getJson('/api/v1/events?tz=Asia/Kolkata');
        $list->assertOk();
        $this->assertNotEmpty($list->json());
    }
}
