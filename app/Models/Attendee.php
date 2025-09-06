<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendee extends Model
{
    protected $fillable = ['event_id', 'name', 'email'];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
