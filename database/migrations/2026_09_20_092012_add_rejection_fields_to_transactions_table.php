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
        Schema::table('transactions', function (Blueprint $table) {
            // Add rejection reason field - REQUIRED by consultant feedback
            $table->text('rejection_reason')->nullable()->after('status');

            // Add confirmed_by for buyer who confirms transaction
            // Rename or clarify this field since it's used for both confirm and reject
            $table->renameColumn('confirmed_by', 'responded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
            $table->renameColumn('responded_by', 'confirmed_by');
        });
    }
};
