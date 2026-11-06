<?php

namespace Database\Seeders;

use App\Models\Commodity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CommoditySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commodities = [
            [
                'name' => 'Kopra',
                'description' => 'Daging buah kelapa yang telah dikeringkan, digunakan sebagai bahan baku minyak kelapa.',
                'unit' => 'kg',
            ],
            [
                'name' => 'Pala',
                'description' => 'Biji buah pala yang digunakan sebagai rempah dan bahan industri.',
                'unit' => 'kg',
            ],
            [
                'name' => 'Cengkeh',
                'description' => 'Bunga kering dari pohon cengkeh, digunakan sebagai rempah dan bahan industri.',
                'unit' => 'kg',
            ],
            [
                'name' => 'Arang Batok Kelapa',
                'description' => 'Arang yang terbuat dari tempurung atau batok kelapa, digunakan untuk bahan bakar dan industri.',
                'unit' => 'kg',
            ],
        ];

        foreach ($commodities as $commodity) {
            Commodity::updateOrCreate(
                ['slug' => Str::slug($commodity['name'])],
                [
                    'name' => $commodity['name'],
                    'description' => $commodity['description'],
                    'unit' => $commodity['unit'],
                    'is_active' => true,
                ]
            );
        }
    }
}
