<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('class_offerings', function (Blueprint $table) {
            $table->json('preferences')->nullable()->after('note');
        });

        Schema::table('class_offering_teacher', function (Blueprint $table) {
            $table->integer('selected_preference')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('class_offerings', function (Blueprint $table) {
            $table->dropColumn('preferences');
        });

        Schema::table('class_offering_teacher', function (Blueprint $table) {
            $table->dropColumn('selected_preference');
        });
    }
};