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
        Schema::create('lesson_plans', function (Blueprint $table) {
            $table->id();
            $table->string('class_management_id');
            $table->foreign('class_management_id')->references('id')->on('class_management')->cascadeOnDelete();
            $table->json('cdev');
            $table->string('model');
            $table->string('method');
            $table->longText('purpose');
            $table->longText('output');
            $table->longText('outcome');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_plans');
    }
};
