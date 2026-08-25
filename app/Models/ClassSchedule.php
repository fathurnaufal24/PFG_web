<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_management_id',
        'meeting_number',
        'schedule_at',
    ];

    protected $casts = [
        'schedule_at' => 'datetime',
    ];

    public function classManagement()
    {
        return $this->belongsTo(ClassManagement::class);
    }
}
