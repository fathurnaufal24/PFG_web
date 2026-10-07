<?php

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
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('class_management_id');
            $table->foreign('class_management_id')->references('id')->on('class_management')->cascadeOnDelete();
            $table->integer('meeting_number'); // 1-10
            $table->dateTime('schedule_at');
            $table->timestamps();

            // Unique constraint untuk mencegah duplikasi pertemuan
            $table->unique(['class_management_id', 'meeting_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};
