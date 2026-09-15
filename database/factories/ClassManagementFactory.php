<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassManagement>
 */
class ClassManagementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'level' => 1,
            'period' => '2026-Q1',
            'order' => 1,
            'type' => 'regular',
            'session' => 0,
            'student' => 0,
            'note' => '',
            'status' => 'inactive',
        ];
    }
}
