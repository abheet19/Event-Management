<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'location' => $this->faker->city(),
            'start_time' => now()->addDay(),
            'end_time' => now()->addDays(2),
            'max_capacity' => 10,
        ];
    }
}
