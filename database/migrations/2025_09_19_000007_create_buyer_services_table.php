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
        Schema::create('buyer_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_profile_id')->constrained('buyer_profiles')->cascadeOnDelete();
            $table->boolean('pickup_available')->default(false);
            $table->boolean('weighing_available')->default(false);
            $table->string('payment_method')->nullable(); // e.g., 'cash', 'transfer', 'cod'
            $table->decimal('minimum_quantity', 12, 2)->nullable(); // Minimum quantity in kg/ton
            $table->decimal('pickup_minimum_quantity', 12, 2)->nullable(); // Minimum for pickup service
            $table->text('pickup_notes')->nullable(); // Catatan tentang layanan pickup
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_services');
    }
};
