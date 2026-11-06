<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display the farmer's favorites.
     */
    public function index()
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        $favorites = Favorite::where('farmer_id', $farmer->id)
            ->with([
                'buyer.user',
                'buyer.service',
                'buyer.buyerCommodities.commodity',
                'buyer.buyerCommodities.grades.latestPrice',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('farmer/favorites', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Add a buyer to favorites.
     */
    public function store(BuyerProfile $buyer)
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        Favorite::firstOrCreate([
            'farmer_id' => $farmer->id,
            'buyer_id' => $buyer->id,
        ]);

        return back()->with('success', 'Pembeli ditambahkan ke favorit.');
    }

    /**
     * Remove a buyer from favorites.
     */
    public function destroy(BuyerProfile $buyer)
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        Favorite::where('farmer_id', $farmer->id)
            ->where('buyer_id', $buyer->id)
            ->delete();

        return back()->with('success', 'Pembeli dihapus dari favorit.');
    }
}
