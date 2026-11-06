<?php

namespace App\Http\Controllers;

use App\Models\Commodity;
use App\Models\BuyerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $featuredCommodities = Commodity::active()
            ->withCount('buyerCommodities')
            ->orderBy('buyer_commodities_count', 'desc')
            ->limit(4)
            ->get();

        $stats = [
            'commodities' => Commodity::active()->count(),
            'buyers' => BuyerProfile::where('is_active', true)->count(),
        ];

        return Inertia::render('public/home', [
            'featuredCommodities' => $featuredCommodities,
            'stats' => $stats,
        ]);
    }
}
