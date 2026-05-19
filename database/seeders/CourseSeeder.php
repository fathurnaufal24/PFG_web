<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Course::create([
            'subject' => 'EQD',
            'description' => 'Emotional Quotient Development'
        ]);
        Course::create([
            'subject' => 'QV',
            'description' => 'Quranic Vibrance'
        ]);
        Course::create([
            'subject' => 'LP',
            'description' => 'Language Project'
        ]);
        Course::create([
            'subject' => 'CPF',
            'description' => 'Coaching Positive Future'
        ]);
    }
}
