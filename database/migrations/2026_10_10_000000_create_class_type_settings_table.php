<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_type_settings', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique(); // 'trial', 'regular', 'private'
            $table->unsignedInteger('max_student');
            $table->timestamps();
        });

        $now = now();
        DB::table('class_type_settings')->insert([
            ['type' => 'trial', 'max_student' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['type' => 'regular', 'max_student' => 8, 'created_at' => $now, 'updated_at' => $now],
            ['type' => 'private', 'max_student' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('class_type_settings');
    }
};
