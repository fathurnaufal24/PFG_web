<?php

use App\Models\Course;
use App\Models\Curriculum;
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
        Schema::create('class_offerings', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Curriculum::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Course::class)->constrained()->cascadeOnDelete();
            $table->integer('level');
            $table->integer('period');
            $table->integer('order');
            $table->string('type'); // ['trial', 'regular', 'private']
            $table->integer('student')->default(0);
            $table->dateTime('schedule_at')->nullable();
            $table->longText('note')->nullable();
            $table->json('preferences')->nullable()->after('note');
            $table->boolean('is_archived')->default(true);
            $table->dateTime('close_offering')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_offerings');
    }
};
