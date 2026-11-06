<?php

namespace Database\Seeders;

use App\Models\BuyerProfile;
use App\Models\BuyerCommodity;
use App\Models\Commodity;
use App\Models\FarmerProfile;
use App\Models\Grade;
use App\Models\Price;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get buyer profile
        $buyer = BuyerProfile::where('business_name', 'PT Sentra Perdana')->first();
        if (!$buyer) return;

        // Get farmer profile
        $farmer = FarmerProfile::first();
        if (!$farmer) return;

        // Get commodities
        $commodities = Commodity::active()->get();

        // Create sample transactions
        $transactionsData = [
            [
                'commodity' => 'Kopra',
                'quantity' => 250,
                'status' => 'confirmed',
                'days_ago' => 5,
                'ratings' => [
                    'price' => 5,
                    'weighing' => 5,
                    'payment' => 5,
                    'service' => 4,
                    'overall' => 5,
                ],
                'comment' => 'Harga bersaing dan proses penimbangan sangat akurat. Pembayaran cepat!',
            ],
            [
                'commodity' => 'Pala',
                'quantity' => 150,
                'status' => 'confirmed',
                'days_ago' => 12,
                'ratings' => [
                    'price' => 4,
                    'weighing' => 5,
                    'payment' => 4,
                    'service' => 4,
                    'overall' => 4,
                ],
                'comment' => 'Pelayanan baik, pengiriman tepat waktu.',
            ],
            [
                'commodity' => 'Cengkeh',
                'quantity' => 300,
                'status' => 'confirmed',
                'days_ago' => 20,
                'ratings' => [
                    'price' => 4,
                    'weighing' => 4,
                    'payment' => 5,
                    'service' => 5,
                    'overall' => 4,
                ],
                'comment' => 'Sudah 3x bertransaksi, tidak pernah kecewa.',
            ],
            [
                'commodity' => 'Kopra',
                'quantity' => 180,
                'status' => 'confirmed',
                'days_ago' => 28,
                'ratings' => [
                    'price' => 5,
                    'weighing' => 5,
                    'payment' => 5,
                    'service' => 5,
                    'overall' => 5,
                ],
                'comment' => 'Pembeli terpercaya! Highly recommended untuk petani kopra.',
            ],
            [
                'commodity' => 'Pala',
                'quantity' => 100,
                'status' => 'pending',
                'days_ago' => 1,
                'ratings' => null,
                'comment' => null,
            ],
        ];

        foreach ($transactionsData as $data) {
            $commodity = $commodities->where('name', $data['commodity'])->first();
            if (!$commodity) continue;

            $transaction = Transaction::create([
                'farmer_id' => $farmer->id,
                'buyer_id' => $buyer->id,
                'commodity_id' => $commodity->id,
                'quantity' => $data['quantity'],
                'transaction_date' => now()->subDays($data['days_ago']),
                'status' => $data['status'],
                'reported_at' => now()->subDays($data['days_ago'] + 1),
                'confirmed_at' => $data['status'] === 'confirmed' ? now()->subDays($data['days_ago'] - 1) : null,
                'confirmed_by' => $data['status'] === 'confirmed' ? $buyer->user_id : null,
            ]);

            // Create review if confirmed
            if ($data['status'] === 'confirmed' && $data['ratings']) {
                Review::create([
                    'transaction_id' => $transaction->id,
                    'price_rating' => $data['ratings']['price'],
                    'weighing_rating' => $data['ratings']['weighing'],
                    'payment_rating' => $data['ratings']['payment'],
                    'service_rating' => $data['ratings']['service'],
                    'overall_rating' => $data['ratings']['overall'],
                    'comment' => $data['comment'],
                ]);
            }
        }

        $this->command->info('Sample transactions and reviews created!');
    }
}
