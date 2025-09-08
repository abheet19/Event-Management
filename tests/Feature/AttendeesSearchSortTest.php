<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Event;

class AttendeesSearchSortTest extends TestCase
{
    use RefreshDatabase;    private function seedAttendees(Event $event): void
    {
        $this->postJson("/api/v1/events/{$event->id}/register", [ 'name' => 'Charlie', 'email' => 'charlie@sample.org' ])->assertCreated();
        usleep(10000); // 10ms delay
        $this->postJson("/api/v1/events/{$event->id}/register", [ 'name' => 'Alice Smith', 'email' => 'alice@example.com' ])->assertCreated();
        usleep(10000); // 10ms delay
        $this->postJson("/api/v1/events/{$event->id}/register", [ 'name' => 'Bob Jones', 'email' => 'bob@example.com' ])->assertCreated();
    }

    public function test_search_by_q_filters_name_and_email_case_insensitive(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 100,
            'start_time' => now()->addHour(),
            'end_time' => now()->addHours(2),
        ]);
        $this->seedAttendees($event);

        // Search by name fragment
        $res = $this->getJson("/api/v1/events/{$event->id}/attendees?q=ali");
        $res->assertOk();
        $names = collect($res->json('data'))->pluck('name')->all();
        $this->assertSame(['Alice Smith'], $names);

        // Search by email fragment
        $res2 = $this->getJson("/api/v1/events/{$event->id}/attendees?q=EXAMPLE");
        $res2->assertOk();
        $emails = collect($res2->json('data'))->pluck('email')->all();
        sort($emails);
        $this->assertSame(['alice@example.com','bob@example.com'], $emails);
    }

    public function test_sorting_orders_correctly(): void
    {
        $event = Event::factory()->create([
            'max_capacity' => 100,
            'start_time' => now()->addHour(),
            'end_time' => now()->addHours(2),
        ]);
        $this->seedAttendees($event);

        // default created_at_desc (last registered first)
        $res = $this->getJson("/api/v1/events/{$event->id}/attendees");
        $res->assertOk();
        $names = collect($res->json('data'))->pluck('name')->all();
        $this->assertSame(['Bob Jones','Alice Smith','Charlie'], $names);

        // created_at_asc (registration order)
        $res2 = $this->getJson("/api/v1/events/{$event->id}/attendees?sort=created_at_asc");
        $res2->assertOk();
        $names2 = collect($res2->json('data'))->pluck('name')->all();
        $this->assertSame(['Charlie','Alice Smith','Bob Jones'], $names2);

        // name_asc A→Z
        $res3 = $this->getJson("/api/v1/events/{$event->id}/attendees?sort=name_asc");
        $res3->assertOk();
        $names3 = collect($res3->json('data'))->pluck('name')->all();
        $this->assertSame(['Alice Smith','Bob Jones','Charlie'], $names3);

        // name_desc Z→A
        $res4 = $this->getJson("/api/v1/events/{$event->id}/attendees?sort=name_desc");
        $res4->assertOk();
        $names4 = collect($res4->json('data'))->pluck('name')->all();
        $this->assertSame(['Charlie','Bob Jones','Alice Smith'], $names4);
    }
}
