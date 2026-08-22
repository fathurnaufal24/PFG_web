<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonPlan extends Model
{
    protected $guarded = [];
    protected $casts = [
        'cdev' => 'array', // Otomatis cast JSON ke array
    ];

    public function classmanagement() {
        return $this->belongsTo(ClassManagement::class);
    }
}
