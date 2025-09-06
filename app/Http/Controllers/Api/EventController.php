<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(title="Mini Event Management API", version="1.0.0")
 * @OA\Server(url="/api/v1")
 */
class EventController extends Controller
{
    /**
     * List upcoming events
     * @OA\Get(
     *   path="/events",
     *   summary="List upcoming events",
     *   @OA\Parameter(name="tz", in="query", description="IANA timezone (e.g., Asia/Kolkata)", @OA\Schema(type="string")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function index(Request $request)
    {
        $tz = $this->resolveTz($request);
        $events = Event::where('end_time', '>=', now('UTC'))->orderBy('start_time')->get();
        $payload = $events->map(fn ($e) => $this->toDto($e, $tz));
        return response()->json($payload);
    }

    /**
     * Create an event
     * @OA\Post(
     *   path="/events",
     *   summary="Create event",
     *   @OA\Parameter(name="tz", in="query", description="IANA timezone for interpreting input times", @OA\Schema(type="string")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","start_time","end_time","max_capacity"},
     *       @OA\Property(property="name", type="string"),
     *       @OA\Property(property="location", type="string"),
     *       @OA\Property(property="start_time", type="string", format="date-time"),
     *       @OA\Property(property="end_time", type="string", format="date-time"),
     *       @OA\Property(property="max_capacity", type="integer", minimum=0)
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created")
     * )
     */
    public function store(StoreEventRequest $request)
    {
        $tz = $this->resolveTz($request);
        $data = $request->validated();
        foreach (['start_time','end_time'] as $key) {
            if (!empty($data[$key])) {
                $data[$key] = Carbon::parse($data[$key], $tz)->setTimezone('UTC');
            }
        }
        $event = Event::create($data);
        return response()->json($this->toDto($event, $tz), Response::HTTP_CREATED);
    }

    /**
     * Show a single event
     * @OA\Get(path="/events/{id}", summary="Get event", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="tz", in="query", @OA\Schema(type="string")), @OA\Response(response=200, description="OK"))
     */
    public function show(Request $request, Event $event)
    {
        $tz = $this->resolveTz($request);
        return response()->json($this->toDto($event, $tz));
    }

    /**
     * Update event
     * @OA\Put(path="/events/{id}", summary="Update event", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="tz", in="query", @OA\Schema(type="string")), @OA\RequestBody(@OA\JsonContent()), @OA\Response(response=200, description="OK"))
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $tz = $this->resolveTz($request);
        $data = $request->validated();
        foreach (['start_time','end_time'] as $key) {
            if (!empty($data[$key])) {
                $data[$key] = Carbon::parse($data[$key], $tz)->setTimezone('UTC');
            }
        }
        $event->update($data);
        return response()->json($this->toDto($event, $tz));
    }

    /**
     * Delete event
     * @OA\Delete(path="/events/{id}", summary="Delete event", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=204, description="No Content"))
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * List attendees
     * @OA\Get(path="/events/{id}/attendees", summary="List attendees", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")), @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")), @OA\Response(response=200, description="OK"))
     */
    public function attendees(Request $request, Event $event)
    {
        $perPage = (int) $request->query('per_page', 20);
        $attendees = $event->attendees()->orderBy('created_at', 'desc')->paginate($perPage);
        return response()->json([
            'data' => $attendees->items(),
            'meta' => [
                'current_page' => $attendees->currentPage(),
                'per_page' => $attendees->perPage(),
                'total' => $attendees->total(),
                'last_page' => $attendees->lastPage(),
            ],
        ]);
    }

    private function resolveTz(Request $request): string
    {
        return $request->query('tz') ?: $request->header('X-Timezone') ?: 'UTC';
    }

    private function toDto(Event $e, string $tz): array
    {
        return [
            'id' => $e->id,
            'name' => $e->name,
            'location' => $e->location,
            'start_time' => optional($e->start_time)->clone()->setTimezone($tz)->toAtomString(),
            'end_time' => optional($e->end_time)->clone()->setTimezone($tz)->toAtomString(),
            'max_capacity' => $e->max_capacity,
            'created_at' => optional($e->created_at)->clone()->setTimezone($tz)->toAtomString(),
            'updated_at' => optional($e->updated_at)->clone()->setTimezone($tz)->toAtomString(),
        ];
    }
}
