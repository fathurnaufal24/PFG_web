<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassManagement;
use App\Models\Course;
use App\Models\Teacher;

class ClassManagementSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        $teachers = Teacher::all();

        $statuses = ['inactive', 'active', 'report', 'pm', 'ended'];
        $types = ['trial', 'regular', 'private'];

        for ($i = 0; $i < 20; $i++) {
            ClassManagement::create([
                'course_id' => $courses->random()->id,
                'teacher_id' => $teachers->random()->id,
                'level' => rand(1, 5),
                'period' => rand(1, 4),
                'order' => rand(1, 10),
                'type' => $types[array_rand($types)],
                'session' => rand(0, 10),
                'student' => rand(1, 8),
                'schedule_at' => now()->addDays(rand(1, 30)),
                'note' => 'Sample note ' . $i,
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}
