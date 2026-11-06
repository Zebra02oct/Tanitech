<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\Commodity;
use App\Models\Report;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // User Stats
        $totalUsers = User::count();
        $totalFarmers = User::role('farmer')->count();
        $totalBuyers = User::role('buyer')->count();

        // Buyer Stats
        $verifiedBuyers = BuyerProfile::where('verification_status', 'approved')->count();
        $pendingVerifications = BuyerProfile::where('verification_status', 'pending')->count();
        $revisionVerifications = BuyerProfile::where('verification_status', 'revision')->count();

        // Transaction Stats
        $totalTransactions = Transaction::count();
        $confirmedTransactions = Transaction::where('status', 'confirmed')->count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $rejectedTransactions = Transaction::where('status', 'rejected')->count();

        // Report Stats
        $pendingReports = Report::where('status', 'pending')->count();
        $resolvedReports = Report::where('status', 'resolved')->count();

        // Commodity Stats
        $totalCommodities = Commodity::active()->count();

        // Recent Transactions
        $recentTransactions = Transaction::with('farmer.user', 'buyer', 'commodity')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Pending Verifications
        $pendingVerificationList = BuyerProfile::with('user')
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'asc')
            ->limit(5)
            ->get();

        // Monthly Stats (last 6 months)
        $monthlyUserStats = [];
        $monthlyTransactionStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $userCount = User::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $transactionCount = Transaction::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $monthlyUserStats[] = [
                'month' => $month->format('M'),
                'count' => $userCount,
            ];
            $monthlyTransactionStats[] = [
                'month' => $month->format('M'),
                'count' => $transactionCount,
            ];
        }

        // Top Commodities by transaction
        $topCommodities = Transaction::selectRaw('commodities.name, COUNT(*) as count')
            ->join('commodities', 'transactions.commodity_id', '=', 'commodities.id')
            ->groupBy('commodities.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            });

        $stats = [
            'total_users' => $totalUsers,
            'total_farmers' => $totalFarmers,
            'total_buyers' => $totalBuyers,
            'verified_buyers' => $verifiedBuyers,
            'pending_verifications' => $pendingVerifications,
            'revision_verifications' => $revisionVerifications,
            'total_transactions' => $totalTransactions,
            'confirmed_transactions' => $confirmedTransactions,
            'pending_transactions' => $pendingTransactions,
            'rejected_transactions' => $rejectedTransactions,
            'pending_reports' => $pendingReports,
            'resolved_reports' => $resolvedReports,
            'total_commodities' => $totalCommodities,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'pendingVerifications' => $pendingVerificationList,
            'monthlyUserStats' => $monthlyUserStats,
            'monthlyTransactionStats' => $monthlyTransactionStats,
            'topCommodities' => $topCommodities,
        ]);
    }
}
