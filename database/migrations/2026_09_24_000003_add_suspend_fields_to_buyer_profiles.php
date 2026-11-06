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
        Schema::table('buyer_profiles', function (Blueprint $table) {
            // Add suspension related fields
            $table->timestamp('suspended_at')->nullable()->after('inactive_reason');
            $table->foreignId('suspended_by')->nullable()->constrained('users')->nullOnDelete()->after('suspended_at');
            $table->string('suspension_reason', 500)->nullable()->after('suspended_by');

            // Add suspension status for better clarity
            $table->enum('suspension_status', ['active', 'suspended', 'pending_review'])
                ->default('active')
                ->after('suspension_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buyer_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'suspended_at',
                'suspended_by',
                'suspension_reason',
                'suspension_status',
            ]);
        });
    }
};
