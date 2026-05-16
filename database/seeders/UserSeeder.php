<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'name' => $admin->name,
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
            'card_number' => '1234567890'
        ]);
        $teacher1->teacher->course()->create([
            'subject' => 'QV',
            'level' => 1,
            'period' => 1,
            'order' => 1,
            'type' => 'trial',
            'session' => 0,
            'note' => 'lorem ipsum dolor sit amet'
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
            'card_number' => '2345678901'
        ]);
        $teacher2->teacher->course()->create([
            'subject' => 'IF',
            'level' => 1,
            'period' => 3,
            'order' => 3,
            'type' => 'trial',
            'session' => 0,
            'note' => 'lorem ipsum dolor sit amet'
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
            'card_number' => '1234567890'
        ]);
        $teacher3->teacher->course()->create([
            'subject' => 'STEM-C',
            'level' => 1,
            'period' => 1,
            'order' => 2,
            'type' => 'trial',
            'session' => 0,
            'note' => 'lorem ipsum dolor sit amet'
        ]);
    }
}
