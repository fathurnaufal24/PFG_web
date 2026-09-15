<?php

use App\Models\ClassManagement;
use App\Models\ClassSchedule;
use App\Models\Course;
use App\Models\LessonPlan;
use App\Models\Teacher;
use App\Models\User;

it('admin can open the class management create form', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)->get('/classmanagement/create');

    $response->assertOk();
});

it('admin can open the class management edit form', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $teacher = User::factory()->create([
        'role' => 'teacher',
    ]);

    $teacherProfile = Teacher::create([
        'user_id' => $teacher->id,
        'first_name' => 'Test',
        'last_name' => 'Teacher',
        'card_number' => '1234567890',
        'performance' => 90,
    ]);

    $course = Course::factory()->create([
        'subject' => 'Math',
    ]);

    $class = ClassManagement::create([
        'course_id' => $course->id,
        'teacher_id' => $teacherProfile->id,
        'level' => 1,
        'period' => 1,
        'order' => 1,
        'type' => 'trial',
        'session' => 0,
        'student' => 5,
        'schedule_at' => now()->addDays(3),
        'note' => 'Test class',
        'status' => 'inactive',
    ]);

    $response = $this->actingAs($admin)->get('/classmanagement/' . $class->id . '/edit');

    $response->assertOk();
});

it('admin can create a class without sending internal status fields', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $course = Course::factory()->create();

    $response = $this->actingAs($admin)->post('/classmanagement', [
        'course_id' => $course->id,
        'type' => 'regular',
        'level' => 2,
        'period' => '2026-Q3',
        'order' => 1,
        'session' => 0,
        'student' => 10,
    ]);

    $response->assertRedirect('/classmanagement');
    $this->assertDatabaseHas('class_management', [
        'course_id' => $course->id,
        'period' => '2026-Q3',
        'status' => 'inactive',
        'note' => '',
    ]);
});

it('admin can update a class with a string period code', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $course = Course::factory()->create();
    $class = ClassManagement::factory()->create([
        'course_id' => $course->id,
        'period' => 1,
    ]);

    $response = $this->actingAs($admin)->put('/classmanagement/' . $class->id, [
        'course_id' => $course->id,
        'type' => 'private',
        'level' => 3,
        'period' => '2026-Q4',
        'order' => 2,
        'session' => 4,
        'student' => 6,
        'note' => 'Updated class',
    ]);

    $response->assertRedirect('/classmanagement');
    $this->assertDatabaseHas('class_management', [
        'id' => $class->id,
        'period' => '2026-Q4',
        'type' => 'private',
    ]);
});

it('teacher can create a class assigned to themselves', function () {
    $teacherUser = User::factory()->create([
        'role' => 'teacher',
    ]);
    $teacher = Teacher::create([
        'user_id' => $teacherUser->id,
        'first_name' => 'New',
        'last_name' => 'Teacher',
        'card_number' => '5555555555',
        'performance' => 80,
    ]);
    $course = Course::factory()->create();

    $response = $this->actingAs($teacherUser)->post('/classmanagement', [
        'course_id' => $course->id,
        'type' => 'regular',
        'level' => 1,
        'period' => '2026-Q3',
        'order' => 1,
        'teacher_id' => null,
    ]);

    $response->assertRedirect('/classmanagement');
    $this->assertDatabaseHas('class_management', [
        'course_id' => $course->id,
        'teacher_id' => $teacher->id,
        'status' => 'inactive',
    ]);
});

it('admin can generate weekly schedules for a class', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $class = ClassManagement::factory()->create();
    $startDate = now()->addDays(3)->startOfDay();

    $response = $this->actingAs($admin)->post('/classmanagement/' . $class->id . '/set-time', [
        'start_date' => $startDate->toDateString(),
        'start_time' => '09:30',
        'meeting_count' => 4,
        'start_this_week' => false,
    ]);

    $response->assertRedirect('/classmanagement');
    expect(ClassSchedule::where('class_management_id', $class->id)->count())->toBe(4);
    expect(ClassSchedule::where('class_management_id', $class->id)->orderBy('meeting_number')->first()->schedule_at->format('H:i'))->toBe('09:30');
    expect($class->fresh()->schedule_at->toDateString())->toBe($startDate->toDateString());
});

it('assigned teacher can create one lesson plan and activate the class', function () {
    $teacherUser = User::factory()->create([
        'role' => 'teacher',
    ]);
    $teacher = Teacher::create([
        'user_id' => $teacherUser->id,
        'first_name' => 'Assigned',
        'last_name' => 'Teacher',
        'card_number' => '9876543210',
        'performance' => 85,
    ]);
    $class = ClassManagement::factory()->create([
        'teacher_id' => $teacher->id,
        'status' => 'inactive',
    ]);

    $response = $this->actingAs($teacherUser)->post('/classmanagement/' . $class->id . '/lesson-plan', [
        'cdev' => ['c1', 'c3'],
        'model' => 'Project Based Learning',
        'method' => 'Discussion',
        'purpose' => 'Build practical understanding.',
        'output' => 'A completed project.',
        'outcome' => 'Students can apply the concept.',
    ]);

    $response->assertRedirect('/classmanagement');
    expect(LessonPlan::where('class_management_id', $class->id)->count())->toBe(1);
    expect($class->fresh()->status)->toBe('active');
});
