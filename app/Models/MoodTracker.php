<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MoodTracker extends Model
{
    /** @use HasFactory<\Database\Factories\MoodTrackerFactory> */
    use HasFactory;

    public function teachers() {
        return $this->belongsTo(Teacher::class);
    }
}
