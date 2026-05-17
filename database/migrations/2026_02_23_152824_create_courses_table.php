<?php

use App\Models\Course;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->integer('level');
            $table->integer('period');
            $table->integer('order');
            $table->string('type');
            $table->integer('session')->default(0);
            $table->integer('student')->default(0);
            $table->dateTime('schedule_at')->nullable();
            $table->longText('note');
            $table->foreignIdFor(Teacher::class)->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('course_student', function (Blueprint $table) { //enrollment
            $table->id();
            $table->foreignIdFor(Course::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
