<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\RegistrationController;

Route::prefix('v1')->group(function () {
    Route::get('events', [EventController::class, 'index']);
    Route::post('events', [EventController::class, 'store']);
    Route::get('events/{event}', [EventController::class, 'show']);
    Route::put('events/{event}', [EventController::class, 'update']);
    Route::delete('events/{event}', [EventController::class, 'destroy']);

    Route::post('events/{event}/register', [RegistrationController::class, 'register']);
    Route::get('events/{event}/attendees', [EventController::class, 'attendees']);
});
