<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassOfferingTeacher extends Model
{
    use HasFactory;

    protected $table = 'class_offering_teacher';

    protected $fillable = [
        'class_offering_id',
        'teacher_id',
        'status',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function classOffering()
    {
        return $this->belongsTo(ClassOffering::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}