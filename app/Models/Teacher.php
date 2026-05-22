<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    /** @use HasFactory<\Database\Factories\TeacherFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'pob',
        'dob',
        'domicile',
        'card_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function class_management() {
        return $this->hasMany(ClassManagement::class);
    }

    public function mood_trackers()
    {
        return $this->hasMany(MoodTracker::class);
    }
}
