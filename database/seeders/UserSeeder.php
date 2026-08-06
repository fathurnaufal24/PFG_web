<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@localhost.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);
        $admin->curriculum()->create([
            'first_name' => $admin->name,
        ]);

        //Course
        $course1 = Course::create([
            'subject' => 'STEM',
            'description' => 'STEM Creativity'
        ]);
        $course2 = Course::create([
            'subject' => 'IF',
            'description' => 'Islamic Finance'
        ]);
        $course3 = Course::create([
            'subject' => 'ILC',
            'description' => 'Islamic Leadership and Collaborration'
        ]);


        // Teacher 1
        $teacher1 = User::create([
            'name' => 'Guru Besar',
            'email' => 'teacher1@localhost.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher'
        ]);
        $teacher1->teacher()->create([
            'first_name' => $teacher1->name,
            'card_number' => '1234567890',
            'performance' => 67.67
        ]);
        $teacher1->teacher->class_management()->create([
            'course_id' => $course1->id,
            'level' => 1,
            'period' => 1,
            'order' => 1,
            'type' => 'trial',
            'session' => 0,
            'schedule_at' => now()->addDays(5), // TAMBAHKAN INI
            'note' => 'lorem ipsum dolor sit amet',
            'status' => 'inactive' // TAMBAHKAN STATUS
        ]);

        // Teacher 2
        $teacher2 = User::create([
            'name' => 'Guru Sedang',
            'email' => 'teacher2@localhost.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher'
        ]);
        $teacher2->teacher()->create([
            'first_name' => $teacher2->name,
            'card_number' => '2345678901',
            'performance' => 67.67
        ]);
        $teacher2->teacher->class_management()->create([
            'course_id' => $course2->id,
            'level' => 1,
            'period' => 3,
            'order' => 3,
            'type' => 'regular',
            'session' => 0,
            'schedule_at' => now()->addDays(3), // TAMBAHKAN INI
            'note' => 'lorem ipsum dolor sit amet',
            'status' => 'active' // TAMBAHKAN STATUS
        ]);


        // Teacher 3
        $teacher3 = User::create([
            'name' => 'Guru Kecil',
            'email' => 'teacher3@localhost.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher'
        ]);
        $teacher3->teacher()->create([
            'first_name' => $teacher3->name,
            'card_number' => '1234567890',
            'performance' => 67.67
        ]);
        $teacher3->teacher->class_management()->create([
            'course_id' => $course3->id,
            'level' => 1,
            'period' => 1,
            'order' => 2,
            'type' => 'private',
            'session' => 0,
            'schedule_at' => now()->addDays(7), // TAMBAHKAN INI
            'note' => 'lorem ipsum dolor sit amet',
            'status' => 'report' // TAMBAHKAN STATUS
        ]);
    }
}
