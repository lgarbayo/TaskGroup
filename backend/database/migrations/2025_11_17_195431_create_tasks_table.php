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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('start_month'); // 0-11
            $table->unsignedTinyInteger('start_week'); // 0-3
            $table->unsignedSmallInteger('start_year');
            $table->unsignedSmallInteger('duration_weeks');
            $table->enum('status', ['pending', 'done'])->default('pending');
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
