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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_commodity_id')->constrained('buyer_commodities')->cascadeOnDelete();
            $table->string('name'); // e.g., 'Grade A', 'Grade B', 'Super', 'Standard'
            $table->text('description')->nullable();
            $table->text('criteria')->nullable(); // Kriteria/standar grade
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
