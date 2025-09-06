<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterAttendeeRequest;
use App\Models\Attendee;
use App\Models\Event;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

class RegistrationController extends Controller
{
    /**
     * Register attendee
     * @OA\Post(
     *   path="/events/{id}/register",
     *   summary="Register attendee",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(required=true, @OA\JsonContent(required={"name","email"}, @OA\Property(property="name", type="string"), @OA\Property(property="email", type="string"))),
     *   @OA\Response(response=201, description="Created", @OA\JsonContent(ref="#/components/schemas/Attendee")),
     *   @OA\Response(response=409, description="Conflict", @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ErrorResponse"))
     * )
     */
    public function register(RegisterAttendeeRequest $request, Event $event)
    {
        $data = $request->validated();

        try {
            $attendee = DB::transaction(function () use ($event, $data) {
                // Re-fetch with row-level lock to serialize capacity checks per event
                $lockedEvent = Event::whereKey($event->id)->lockForUpdate()->first();

                // Count without FOR UPDATE (aggregates cannot be locked). Event row lock provides serialization.
                $current = Attendee::where('event_id', $lockedEvent->id)->count();
                if ($lockedEvent->max_capacity > 0 && $current >= $lockedEvent->max_capacity) {
                    abort(Response::HTTP_CONFLICT, 'Event is at full capacity');
                }

                return Attendee::create([
                    'event_id' => $lockedEvent->id,
                    'name' => $data['name'],
                    'email' => $data['email'],
                ]);
            }, 3);
        } catch (QueryException $e) {
            // Postgres unique violation code
            $sqlState = $e->errorInfo[0] ?? null;
            if ($sqlState === '23505') {
                return response()->json(['message' => 'You are already registered for this event with this email'], Response::HTTP_CONFLICT);
            }
            throw $e;
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            if ($e->getStatusCode() === Response::HTTP_CONFLICT) {
                return response()->json(['message' => $e->getMessage()], Response::HTTP_CONFLICT);
            }
            throw $e;
        }

        return response()->json($attendee, Response::HTTP_CREATED);
    }
}
