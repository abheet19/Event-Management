<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Attendee;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Indian names for realistic demo data
        $indianNames = [
            'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Rahul Gupta',
            'Pooja Verma', 'Vikram Yadav', 'Kavya Joshi', 'Arjun Reddy', 'Meera Iyer',
            'Sanjay Dubey', 'Ritu Agarwal', 'Karan Malhotra', 'Divya Nair', 'Rohit Saxena',
            'Anita Bhatt', 'Suresh Tiwari', 'Neha Kapoor', 'Manish Jain', 'Shruti Bansal',
            'Deepak Mehta', 'Anjali Roy', 'Vinod Kumar', 'Swati Chopra', 'Nikhil Sinha',
            'Preeti Goel', 'Ashok Pandey', 'Sunita Rao', 'Rajeev Mishra', 'Jyoti Sethi'
        ];

        // Create 12 upcoming events and 2 past events
        $events = [];
        // Past events (for testing pagination with mixed data)
        $pastBase1 = Carbon::now('Asia/Kolkata')->subDays(30);
        $events[] = Event::create([
            'name' => 'Mumbai Tech Meetup 2024',
            'start_time' => $pastBase1->clone()->setTimezone('UTC'),
            'end_time' => $pastBase1->clone()->addHours(3)->setTimezone('UTC'),
            'location' => 'BKC, Mumbai',
            'max_capacity' => 50,
        ]);

        $pastBase2 = Carbon::now('Asia/Kolkata')->subDays(15);
        $events[] = Event::create([
            'name' => 'Delhi AI Workshop',
            'start_time' => $pastBase2->clone()->setTimezone('UTC'),
            'end_time' => $pastBase2->clone()->addHours(4)->setTimezone('UTC'),
            'location' => 'Connaught Place, Delhi',
            'max_capacity' => 30,
        ]);

        // Upcoming events
        $upcomingEvents = [
            ['name' => 'Bangalore DevOps Conference', 'days' => 5, 'hours' => 6, 'capacity' => 100],
            ['name' => 'Chennai React Workshop', 'days' => 10, 'hours' => 4, 'capacity' => 40],
            ['name' => 'Pune Startup Pitch Event', 'days' => 15, 'hours' => 5, 'capacity' => 80],
            ['name' => 'Hyderabad Blockchain Summit', 'days' => 20, 'hours' => 7, 'capacity' => 120],
            ['name' => 'Kolkata Data Science Bootcamp', 'days' => 25, 'hours' => 8, 'capacity' => 60],
            ['name' => 'Ahmedabad Mobile App Hackathon', 'days' => 30, 'hours' => 48, 'capacity' => 150],
            ['name' => 'Kochi Digital Marketing Seminar', 'days' => 35, 'hours' => 3, 'capacity' => 70],
            ['name' => 'Jaipur Cybersecurity Conference', 'days' => 40, 'hours' => 5, 'capacity' => 90],
            ['name' => 'Lucknow E-commerce Workshop', 'days' => 45, 'hours' => 6, 'capacity' => 55],
            ['name' => 'Bhubaneswar IoT Innovation Day', 'days' => 50, 'hours' => 4, 'capacity' => 75],
            ['name' => 'Indore Cloud Computing Summit', 'days' => 55, 'hours' => 7, 'capacity' => 110],
            ['name' => 'Chandigarh UX/UI Design Workshop', 'days' => 60, 'hours' => 5, 'capacity' => 45],
        ];

        foreach ($upcomingEvents as $eventData) {
            $base = Carbon::now('Asia/Kolkata')->addDays($eventData['days']);
            $events[] = Event::create([
                'name' => $eventData['name'],
                'start_time' => $base->clone()->setTimezone('UTC'),
                'end_time' => $base->clone()->addHours($eventData['hours'])->setTimezone('UTC'),
                'location' => explode(' ', $eventData['name'])[0],
                'max_capacity' => $eventData['capacity'],
            ]);
        }

        // Create attendees for each event (varying numbers for pagination testing)
        foreach ($events as $index => $event) {
            $attendeeCount = rand(15, min($event->max_capacity - 5, 35)); // Leave some spots available
            
            for ($i = 0; $i < $attendeeCount; $i++) {
                $name = $indianNames[array_rand($indianNames)];
                $email = strtolower(str_replace(' ', '.', $name)) . rand(1, 999) . '@example.com';
                
                Attendee::create([
                    'event_id' => $event->id,
                    'name' => $name,
                    'email' => $email,
                    'created_at' => Carbon::now()->subMinutes(rand(1, 1440 * 30)), // Random time in last 30 days
                ]);
                
                // Small delay to ensure different timestamps for testing
                usleep(1000); // 1ms delay
            }
        }

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Created ' . count($events) . ' events with realistic attendee data.');
        $this->command->info('Events include past and upcoming events for comprehensive testing.');
    }
}
