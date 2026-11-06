<?php

namespace Database\Seeders;

use App\Models\BuyerProfile;
use App\Models\BuyerCommodity;
use App\Models\Commodity;
use App\Models\Grade;
use App\Models\Price;
use Illuminate\Database\Seeder;

class BuyerCommoditySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get buyer profile
        $buyer = BuyerProfile::where('business_name', 'PT Sentra Perdana')->first();
        if (!$buyer) return;

        // Get commodities
        $commodities = Commodity::active()->get();

        // Define grades and prices for each commodity
        $commodityData = [
            'Kopra' => [
                'grades' => [
                    ['name' => 'Super', 'price' => 15000, 'description' => 'Kualitas premium, kering sempurna'],
                    ['name' => 'Grade A', 'price' => 13500, 'description' => 'Kualitas baik, standar export'],
                    ['name' => 'Grade B', 'price' => 12000, 'description' => 'Kualitas standar'],
                ],
            ],
            'Pala' => [
                'grades' => [
                    ['name' => 'Super', 'price' => 180000, 'description' => 'Biji utuh, tidak cacat'],
                    ['name' => 'Grade A', 'price' => 160000, 'description' => 'Biji utuh, sedikit瑕疵'],
                    ['name' => 'Grade B', 'price' => 140000, 'description' => 'Biji pecah, kualitas baik'],
                ],
            ],
            'Cengkeh' => [
                'grades' => [
                    ['name' => 'Super', 'price' => 420000, 'description' => 'Kuntum sempurna, kering'],
                    ['name' => 'Grade A', 'price' => 380000, 'description' => 'Kualitas baik'],
                    ['name' => 'Grade B', 'price' => 340000, 'description' => 'Standar industri'],
                ],
            ],
            'Arang Batok Kelapa' => [
                'grades' => [
                    ['name' => 'Premium', 'price' => 8000, 'description' => 'Arang keras, tidak mudah hancur'],
                    ['name' => 'Standar', 'price' => 6500, 'description' => 'Kualitas baik untuk BBQ'],
                    ['name' => 'Industri', 'price' => 5000, 'description' => 'Untuk kebutuhan industri'],
                ],
            ],
        ];

        foreach ($commodityData as $commodityName => $data) {
            $commodity = $commodities->where('name', $commodityName)->first();
            if (!$commodity) continue;

            // Create buyer commodity
            $buyerCommodity = BuyerCommodity::firstOrCreate([
                'buyer_profile_id' => $buyer->id,
                'commodity_id' => $commodity->id,
            ], [
                'is_active' => true,
            ]);

            // Create grades and prices
            foreach ($data['grades'] as $gradeData) {
                $grade = Grade::firstOrCreate([
                    'buyer_commodity_id' => $buyerCommodity->id,
                    'name' => $gradeData['name'],
                ], [
                    'description' => $gradeData['description'],
                    'is_active' => true,
                ]);

                // Create latest price (randomize confirmation date within last 7 days)
                $confirmedAt = now()->subDays(rand(0, 7));

                Price::firstOrCreate(
                    ['grade_id' => $grade->id],
                    [
                        'price' => $gradeData['price'],
                        'unit' => $commodity->unit,
                        'confirmed_at' => $confirmedAt,
                    ]
                );
            }
        }

        $this->command->info('Buyer commodities, grades, and prices created!');
    }
}
