<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tz = $request->query('tz') ?: $request->header('X-Timezone') ?: 'UTC';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'start_time' => optional($this->start_time)->clone()->setTimezone($tz)->toAtomString(),
            'end_time' => optional($this->end_time)->clone()->setTimezone($tz)->toAtomString(),
            'max_capacity' => $this->max_capacity,
            'created_at' => optional($this->created_at)->clone()->setTimezone($tz)->toAtomString(),
            'updated_at' => optional($this->updated_at)->clone()->setTimezone($tz)->toAtomString(),
        ];
    }
}
