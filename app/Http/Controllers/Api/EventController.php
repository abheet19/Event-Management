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
use Illuminate\Support\Facades\DB;

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
     *   summary="List events (upcoming by default)",
     *   @OA\Parameter(name="tz", in="query", description="IANA timezone (e.g., Asia/Kolkata)", @OA\Schema(type="string")),
     *   @OA\Parameter(name="page", in="query", description="Page number (default 1)", @OA\Schema(type="integer")),
     *   @OA\Parameter(name="per_page", in="query", description="Items per page (default 10)", @OA\Schema(type="integer")),
     *   @OA\Parameter(name="include_past", in="query", description="Include past events when set to 1", @OA\Schema(type="integer", enum={0,1})),
     *   @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/EventsResponse"))
     * )
     */
    public function index(Request $request)
    {
        $tz = $this->resolveTz($request);
        $perPage = (int) $request->query('per_page', 10);
        $includePast = (string) $request->query('include_past', '0') === '1';

        $query = Event::query();
        if (!$includePast) {
            $query->where('end_time', '>=', now('UTC'));
        }

        $paginator = $query->orderBy('start_time')->paginate($perPage);

        $data = collect($paginator->items())->map(fn ($e) => $this->toDto($e, $tz))->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * Create an event
     * @OA\Post(
     *   path="/events",
     *   summary="Create event",
     *   @OA\Parameter(name="tz", in="query", description="IANA timezone for interpreting input times", @OA\Schema(type="string")),
     *   @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/EventInput")),
     *   @OA\Response(response=201, description="Created", @OA\JsonContent(ref="#/components/schemas/Event")),
     *   @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ErrorResponse"))
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
     * @OA\Get(path="/events/{id}", summary="Get event", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="tz", in="query", @OA\Schema(type="string")), @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Event")), @OA\Response(response=404, description="Not Found", @OA\JsonContent(ref="#/components/schemas/ErrorResponse")))
     */
    public function show(Request $request, Event $event)
    {
        $tz = $this->resolveTz($request);
        return response()->json($this->toDto($event, $tz));
    }

    /**
     * Update event
     * @OA\Put(path="/events/{id}", summary="Update event", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="tz", in="query", @OA\Schema(type="string")), @OA\RequestBody(@OA\JsonContent(ref="#/components/schemas/EventInput")), @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/Event")), @OA\Response(response=409, description="Conflict: capacity below current attendees", @OA\JsonContent(ref="#/components/schemas/ErrorResponse")))
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $tz = $this->resolveTz($request);
        $data = $request->validated();
        foreach (["start_time","end_time"] as $key) {
            if (!empty($data[$key])) {
                $data[$key] = Carbon::parse($data[$key], $tz)->setTimezone('UTC');
            }
        }

        // Use a transaction and row lock to keep capacity checks consistent with concurrent registrations
        $updated = DB::transaction(function () use ($event, $data) {
            $locked = Event::whereKey($event->id)->lockForUpdate()->firstOrFail();

            if (array_key_exists('max_capacity', $data) && $data['max_capacity'] > 0) {
                $current = $locked->attendees()->count();
                if ($data['max_capacity'] < $current) {
                    abort(Response::HTTP_CONFLICT, "Max capacity ({$data['max_capacity']}) cannot be less than current attendees ({$current})");
                }
            }

            $locked->update($data);
            return $locked;
        }, 3);

        return response()->json($this->toDto($updated, $tz));
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
     * @OA\Get(path="/events/{id}/attendees", summary="List attendees", @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")), @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")), @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/AttendeesResponse")))
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
