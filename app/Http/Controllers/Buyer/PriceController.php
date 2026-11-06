<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriceController extends Controller
{
    /**
     * Display the prices management page.
     */
    public function index()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        $commodities = $buyer->buyerCommodities()
            ->with(['commodity', 'grades.latestPrice'])
            ->where('is_active', true)
            ->get()
            ->map(function ($bc) {
                return [
                    'id' => $bc->id,
                    'commodity' => [
                        'name' => $bc->commodity->name,
                    ],
                    'grades' => $bc->grades->map(function ($grade) {
                        $latestPrice = $grade->latestPrice;
                        $daysSinceConfirm = $latestPrice
                            ? now()->diffInDays($latestPrice->confirmed_at)
                            : null;

                        return [
                            'id' => $grade->id,
                            'name' => $grade->name,
                            'latest_price' => $latestPrice ? [
                                'price' => (float) $latestPrice->price,
                                'unit' => $latestPrice->unit,
                                'confirmed_at' => $latestPrice->confirmed_at->toIso8601String(),
                                'days_since_confirm' => $daysSinceConfirm,
                                'is_expired' => $latestPrice->isExpired(),
                            ] : null,
                        ];
                    }),
                ];
            });

        return Inertia::render('buyer/prices/index', [
            'commodities' => $commodities,
        ]);
    }

    /**
     * Update a grade's price.
     */
    public function update(Request $request, Grade $grade)
    {
        $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        // Verify grade belongs to this buyer
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($grade->buyerCommodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        // Create new price record
        $grade->price()->create([
            'price' => $request->price,
            'unit' => $grade->buyerCommodity->commodity->unit,
            'confirmed_at' => now(),
        ]);

        return back()->with('success', 'Harga berhasil diperbarui. Terima kasih telah mengkonfirmasi harga Anda.');
    }
}
