<?php

namespace App\Swagger;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *   schema="Event",
 *   type="object",
 *   @OA\Property(property="id", type="integer", example=1),
 *   @OA\Property(property="name", type="string", example="Demo"),
 *   @OA\Property(property="location", type="string", nullable=true, example="BLR"),
 *   @OA\Property(property="start_time", type="string", format="date-time", example="2025-09-08T10:00:00+05:30"),
 *   @OA\Property(property="end_time", type="string", format="date-time", example="2025-09-08T11:00:00+05:30"),
 *   @OA\Property(property="max_capacity", type="integer", example=50),
 *   @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-06T08:00:00Z"),
 *   @OA\Property(property="updated_at", type="string", format="date-time", example="2025-09-06T08:00:00Z")
 * )
 *
 * @OA\Schema(
 *   schema="EventInput",
 *   type="object",
 *   required={"name","start_time","end_time","max_capacity"},
 *   @OA\Property(property="name", type="string", example="Demo"),
 *   @OA\Property(property="location", type="string", example="BLR"),
 *   @OA\Property(property="start_time", type="string", format="date-time", example="2025-09-08T10:00:00"),
 *   @OA\Property(property="end_time", type="string", format="date-time", example="2025-09-08T11:00:00"),
 *   @OA\Property(property="max_capacity", type="integer", example=50)
 * )
 *
 * @OA\Schema(
 *   schema="Attendee",
 *   type="object",
 *   @OA\Property(property="id", type="integer", example=10),
 *   @OA\Property(property="event_id", type="integer", example=1),
 *   @OA\Property(property="name", type="string", example="Alice"),
 *   @OA\Property(property="email", type="string", example="alice@example.com"),
 *   @OA\Property(property="created_at", type="string", format="date-time"),
 *   @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 *
 * @OA\Schema(
 *   schema="PaginationMeta",
 *   type="object",
 *   @OA\Property(property="current_page", type="integer", example=1),
 *   @OA\Property(property="per_page", type="integer", example=10),
 *   @OA\Property(property="total", type="integer", example=42),
 *   @OA\Property(property="last_page", type="integer", example=5)
 * )
 *
 * @OA\Schema(
 *   schema="EventsResponse",
 *   type="object",
 *   @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Event")),
 *   @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
 * )
 *
 * @OA\Schema(
 *   schema="AttendeesResponse",
 *   type="object",
 *   @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Attendee")),
 *   @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
 * )
 *
 * @OA\Schema(
 *   schema="ErrorResponse",
 *   type="object",
 *   @OA\Property(property="message", type="string", example="Event is at full capacity")
 * )
 */
class Schemas {}
