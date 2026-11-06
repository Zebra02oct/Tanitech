<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\BuyerCommodity;
use App\Models\SaleRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the buyer dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            return redirect()->route('buyer.profile.edit');
        }

        // Stats
        $activeCommodities = BuyerCommodity::where('buyer_profile_id', $buyer->id)
            ->where('is_active', true)
            ->count();

        $totalCommodities = BuyerCommodity::where('buyer_profile_id', $buyer->id)->count();

        $pendingSales = SaleRequest::where('buyer_id', $buyer->id)
            ->where('status', 'pending')
            ->count();

        $confirmedTransactions = Transaction::where('buyer_id', $buyer->id)
            ->where('status', 'confirmed')
            ->count();

        $pendingTransactions = Transaction::where('buyer_id', $buyer->id)
            ->where('status', 'pending')
            ->count();

        // Calculate average rating from confirmed transactions
        $avgRatings = Transaction::where('buyer_id', $buyer->id)
            ->where('status', 'confirmed')
            ->with('review')
            ->get()
            ->pluck('review')
            ->filter();

        $avgOverallRating = $avgRatings->avg('overall_rating') ?? 0;
        $totalReviews = $avgRatings->count();

        // Recent sales requests
        $recentSales = SaleRequest::where('buyer_id', $buyer->id)
            ->with('farmer.user', 'commodity')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent transactions
        $recentTransactions = Transaction::where('buyer_id', $buyer->id)
            ->with('farmer.user', 'commodity')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Sales trends (last 7 days)
        $salesTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = SaleRequest::where('buyer_id', $buyer->id)
                ->whereDate('created_at', $date->toDateString())
                ->count();
            $salesTrends[] = [
                'date' => $date->format('D'),
                'count' => $count,
            ];
        }

        // Commodity stats (from transactions)
        $commodityStats = Transaction::where('buyer_id', $buyer->id)
            ->where('status', 'confirmed')
            ->with('commodity')
            ->get()
            ->groupBy('commodity_id')
            ->map(function ($items, $commodityId) {
                return [
                    'name' => $items->first()->commodity->name ?? 'Unknown',
                    'transactions' => $items->count(),
                ];
            })
            ->values()
            ->sortByDesc('transactions')
            ->take(5)
            ->toArray();

        // Recent activity (combined from sales, transactions, and reviews)
        $activities = collect();

        // Sales activities
        $recentSales->each(function ($sale) use ($activities) {
            $activities->push([
                'id' => 'sale_' . $sale->id,
                'type' => 'sale_request',
                'title' => 'Permintaan baru',
                'description' => $sale->farmer->user->name . ' mengajukan penjualan ' . $sale->commodity->name,
                'created_at' => $sale->created_at,
            ]);
        });

        // Transaction activities
        $recentTransactions->each(function ($tx) use ($activities) {
            $statusLabel = match ($tx->status) {
                'confirmed' => 'mengkonfirmasi',
                'pending' => 'menunggu konfirmasi',
                'rejected' => 'menolak',
                default => 'mengupdate',
            };
            $activities->push([
                'id' => 'tx_' . $tx->id,
                'type' => 'transaction',
                'title' => 'Transaksi ' . ucfirst($tx->status),
                'description' => $tx->farmer->user->name . ' - ' . $tx->commodity->name,
                'created_at' => $tx->created_at,
            ]);
        });

        $recentActivity = $activities->sortByDesc('created_at')->take(5)->values();

        // Calculate changes (simplified - comparing this month vs last month)
        $thisMonthTx = Transaction::where('buyer_id', $buyer->id)
            ->whereMonth('created_at', now()->month)
            ->count();
        $lastMonthTx = Transaction::where('buyer_id', $buyer->id)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->count();
        $transactionsChange = $lastMonthTx > 0 ? round((($thisMonthTx - $lastMonthTx) / $lastMonthTx) * 100) : ($thisMonthTx > 0 ? 100 : 0);

        // Rating change (comparing recent avg vs overall)
        $ratingChange = 8; // Placeholder

        $stats = [
            'pending_sales' => $pendingSales,
            'active_commodities' => $activeCommodities,
            'total_commodities' => $totalCommodities,
            'confirmed_transactions' => $confirmedTransactions,
            'pending_transactions' => $pendingTransactions,
            'avg_rating' => $avgOverallRating,
            'total_reviews' => $totalReviews,
            'transactions_change' => $transactionsChange,
            'rating_change' => $ratingChange,
        ];

        return Inertia::render('buyer/dashboard', [
            'buyer' => $buyer,
            'stats' => $stats,
            'recentSales' => $recentSales,
            'recentTransactions' => $recentTransactions,
            'salesTrends' => $salesTrends,
            'commodityStats' => array_values($commodityStats),
            'recentActivity' => $recentActivity,
            'auth' => ['user' => $user],
        ]);
    }
}
