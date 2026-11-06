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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->unique()->constrained('transactions')->cascadeOnDelete();
            $table->tinyInteger('price_rating')->unsigned()->comment('Rating 1-5 untuk harga');
            $table->tinyInteger('weighing_rating')->unsigned()->comment('Rating 1-5 untuk penimbangan');
            $table->tinyInteger('payment_rating')->unsigned()->comment('Rating 1-5 untuk pembayaran');
            $table->tinyInteger('service_rating')->unsigned()->comment('Rating 1-5 untuk layanan');
            $table->tinyInteger('overall_rating')->unsigned()->comment('Rating keseluruhan 1-5');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
