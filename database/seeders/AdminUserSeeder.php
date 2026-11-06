<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\FarmerProfile;
use App\Models\BuyerProfile;
use App\Models\BuyerService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@tanitech.com'],
            [
                'name' => 'Admin TANI TECH',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Create sample Farmer User
        $farmer = User::firstOrCreate(
            ['email' => 'petani@tanitech.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $farmer->assignRole('farmer');
        FarmerProfile::firstOrCreate(
            ['user_id' => $farmer->id],
            [
                'village' => 'Kampung Baru',
                'district' => 'Kota Juliana',
                'regency' => 'Maluku Tengah',
                'province' => 'Maluku',
            ]
        );

        // Create sample Buyer User
        $buyerUser = User::firstOrCreate(
            ['email' => 'pembeli@tanitech.com'],
            [
                'name' => 'PT Sentra Perdana',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $buyerUser->assignRole('buyer');

        $buyer = BuyerProfile::firstOrCreate(
            ['user_id' => $buyerUser->id],
            [
                'business_name' => 'PT Sentra Perdana',
                'description' => 'Distributor komoditas pertanian terpercaya sejak 2015. Kami membeli kopra, pala, cengkeh, dan arang batok kelapa dengan harga kompetitif.',
                'phone' => '081234567890',
                'village' => 'Passo',
                'district' => 'Baguala',
                'regency' => 'Kota Ambon',
                'province' => 'Maluku',
                'latitude' => -3.6438,
                'longitude' => 128.2789,
                'verification_status' => 'approved',
                'verified_at' => now(),
                'is_active' => true,
            ]
        );

        BuyerService::firstOrCreate(
            ['buyer_profile_id' => $buyer->id],
            [
                'pickup_available' => true,
                'weighing_available' => true,
                'payment_method' => 'transfer',
                'minimum_quantity' => 100,
                'pickup_minimum_quantity' => 500,
                'pickup_notes' => 'Kami melayani penjemputan untuk quantity di atas 500 kg dalam radius 50 km.',
            ]
        );

        $this->command->info('Admin, Farmer, and Buyer users created successfully!');
    }
}
