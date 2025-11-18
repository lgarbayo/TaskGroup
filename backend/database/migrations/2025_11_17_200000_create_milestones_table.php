<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('date_year');
            $table->unsignedTinyInteger('date_month'); // 0-11
            $table->unsignedTinyInteger('date_week'); // 0-3
            $table->timestamps();

            $table->index(['project_id', 'date_year', 'date_month', 'date_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milestones');
    }
};
