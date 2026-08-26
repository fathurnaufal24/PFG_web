<?php

use App\Models\ClassOffering;
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
        Schema::create('class_offering_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ClassOffering::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Teacher::class)->constrained()->cascadeOnDelete();
            $table->string('status'); // 'pending', 'accepted', 'rejected'
            $table->integer('selected_preference')->nullable()->after('status');
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_offering_teacher');
    }
};
