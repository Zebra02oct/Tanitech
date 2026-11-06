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
        // Add unique constraint on favorites
        // First, drop any existing duplicate records
        DB::statement('DELETE FROM favorites WHERE id NOT IN (SELECT MIN(id) FROM favorites GROUP BY farmer_id, buyer_id)');

        Schema::table('favorites', function (Blueprint $table) {
            $table->unique(['farmer_id', 'buyer_id'], 'favorites_farmer_buyer_unique');
        });

        // Add unique constraint on buyer_commodities
        // First, drop any existing duplicate records
        DB::statement('DELETE FROM buyer_commodities WHERE id NOT IN (SELECT MIN(id) FROM buyer_commodities GROUP BY buyer_profile_id, commodity_id)');

        Schema::table('buyer_commodities', function (Blueprint $table) {
            $table->unique(['buyer_profile_id', 'commodity_id'], 'buyer_commodities_profile_commodity_unique');
        });

        // Add unique constraint on reviews (one review per transaction)
        // First, drop any existing duplicate records
        DB::statement('DELETE FROM reviews WHERE id NOT IN (SELECT MIN(id) FROM reviews GROUP BY transaction_id)');

        Schema::table('reviews', function (Blueprint $table) {
            $table->unique(['transaction_id'], 'reviews_transaction_unique');
        });

        // Add index on transactions.status for better query performance
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('status', 'transactions_status_index');
        });

        // Add index on prices.confirmed_at for expiry queries
        Schema::table('prices', function (Blueprint $table) {
            $table->index('confirmed_at', 'prices_confirmed_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropUnique('favorites_farmer_buyer_unique');
        });

        Schema::table('buyer_commodities', function (Blueprint $table) {
            $table->dropUnique('buyer_commodities_profile_commodity_unique');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique('reviews_transaction_unique');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_status_index');
        });

        Schema::table('prices', function (Blueprint $table) {
            $table->dropIndex('prices_confirmed_at_index');
        });
    }
};
