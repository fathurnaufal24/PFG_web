<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonPlan extends Model
{
    protected $guarded = [];

    public function classmanagement() {
        return $this->belongsTo(ClassManagement::class);
    }
}
