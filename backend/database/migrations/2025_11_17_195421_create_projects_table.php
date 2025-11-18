<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('start_year');
            $table->unsignedTinyInteger('start_month'); // 0-11
            $table->unsignedTinyInteger('start_week'); // 0-3
            $table->unsignedSmallInteger('end_year');
            $table->unsignedTinyInteger('end_month'); // 0-11
            $table->unsignedTinyInteger('end_week'); // 0-3
            $table->json('additional_fields')->nullable();
            $table->timestamps();

            $table->unique(['owner_id', 'title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
