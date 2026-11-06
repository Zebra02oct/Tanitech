<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the farmer dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        if (!$farmer) {
            return redirect()->route('profile.setup');
        }

        // Stats
        $totalTransactions = Transaction::where('farmer_id', $farmer->id)->count();
        $confirmedTransactions = Transaction::where('farmer_id', $farmer->id)
            ->where('status', 'confirmed')
            ->count();
        $pendingTransactions = Transaction::where('farmer_id', $farmer->id)
            ->where('status', 'pending')
            ->count();
        $favoriteCount = Favorite::where('farmer_id', $farmer->id)->count();

        // Calculate average rating from all reviews
        $avgOverallRating = Transaction::where('farmer_id', $farmer->id)
            ->where('status', 'confirmed')
            ->with('review')
            ->get()
            ->pluck('review')
            ->filter()
            ->avg('overall_rating');

        // Recent transactions
        $recentTransactions = Transaction::where('farmer_id', $farmer->id)
            ->with(['buyer', 'commodity', 'review'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Monthly transactions (last 6 months)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = Transaction::where('farmer_id', $farmer->id)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $monthlyStats[] = [
                'month' => $month->format('M'),
                'count' => $count,
            ];
        }

        // Top buyers by transaction count
        $topBuyers = Transaction::where('farmer_id', $farmer->id)
            ->where('status', 'confirmed')
            ->with('buyer')
            ->get()
            ->groupBy('buyer_id')
            ->map(function ($items) {
                return [
                    'name' => $items->first()->buyer->business_name,
                    'count' => $items->count(),
                ];
            })
            ->sortByDesc('count')
            ->take(5)
            ->values();

        $stats = [
            'total_transactions' => $totalTransactions,
            'confirmed_transactions' => $confirmedTransactions,
            'pending_transactions' => $pendingTransactions,
            'favorite_count' => $favoriteCount,
            'avg_rating' => $avgOverallRating ? round($avgOverallRating, 1) : null,
        ];

        return Inertia::render('farmer/dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'monthlyStats' => $monthlyStats,
            'topBuyers' => $topBuyers,
        ]);
    }
}
