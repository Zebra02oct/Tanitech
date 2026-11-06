<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\BuyerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the profile edit form.
     */
    public function edit()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            $buyer = BuyerProfile::create([
                'user_id' => $user->id,
                'business_name' => '',
                'phone' => $user->email,
                'verification_status' => 'pending',
            ]);

            BuyerService::create([
                'buyer_profile_id' => $buyer->id,
            ]);
        }

        return Inertia::render('buyer/profile/edit', [
            'buyer' => $buyer->load('service'),
        ]);
    }

    /**
     * Update the profile.
     */
    public function update(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'phone' => 'required|string|max:20',
            'village' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'regency' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'pickup_available' => 'boolean',
            'weighing_available' => 'boolean',
            'payment_method' => 'nullable|string|max:100',
            'minimum_quantity' => 'nullable|numeric|min:0',
            'pickup_minimum_quantity' => 'nullable|numeric|min:0',
            'pickup_notes' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            $buyer = BuyerProfile::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'phone' => $request->phone,
            ]);

            BuyerService::create([
                'buyer_profile_id' => $buyer->id,
            ]);
        }

        $buyer->update($request->only([
            'business_name',
            'description',
            'phone',
            'village',
            'district',
            'regency',
            'province',
            'address',
            'latitude',
            'longitude',
        ]));

        $buyer->service()->updateOrCreate(
            ['buyer_profile_id' => $buyer->id],
            $request->only([
                'pickup_available',
                'weighing_available',
                'payment_method',
                'minimum_quantity',
                'pickup_minimum_quantity',
                'pickup_notes',
            ])
        );

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
