<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\Commodity;
use App\Models\Favorite;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display the farmer's transactions.
     */
    public function index()
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        if (!$farmer) {
            return redirect('/');
        }

        $transactions = Transaction::where('farmer_id', $farmer->id)
            ->with(['buyer', 'commodity', 'review'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get all active commodities
        $commodities = Commodity::active()->orderBy('name')->get(['id', 'name', 'unit']);

        // Get buyers that the farmer has favorited or transacted with
        $recentBuyerIds = Transaction::where('farmer_id', $farmer->id)
            ->distinct()
            ->pluck('buyer_id');

        $favoriteBuyerIds = Favorite::where('farmer_id', $farmer->id)
            ->pluck('buyer_id');

        $allBuyerIds = $recentBuyerIds->merge($favoriteBuyerIds)->unique();

        $recentBuyers = BuyerProfile::whereIn('id', $allBuyerIds)
            ->where('is_active', true)
            ->where('verification_status', 'approved')
            ->get(['id', 'business_name']);

        return Inertia::render('farmer/transactions', [
            'transactions' => $transactions,
            'commodities' => $commodities,
            'recentBuyers' => $recentBuyers,
        ]);
    }

    /**
     * Store a new transaction report.
     */
    public function store(Request $request)
    {
        $request->validate([
            'buyer_id' => 'required|exists:buyer_profiles,id',
            'commodity_id' => 'required|exists:commodities,id',
            'quantity' => 'required|numeric|min:1',
            'transaction_date' => 'required|date|before_or_equal:today',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $farmer = $user->farmerProfile;

        if (!$farmer) {
            return back()->with('error', 'Silakan lengkapi profil Anda terlebih dahulu.');
        }

        // Check if buyer exists and is active
        $buyer = BuyerProfile::find($request->buyer_id);
        if (!$buyer || !$buyer->is_active) {
            return back()->with('error', 'Pembeli tidak ditemukan atau sedang tidak aktif.');
        }

        Transaction::create([
            'farmer_id' => $farmer->id,
            'buyer_id' => $request->buyer_id,
            'commodity_id' => $request->commodity_id,
            'quantity' => $request->quantity,
            'transaction_date' => $request->transaction_date,
            'status' => Transaction::STATUS_PENDING,
            'reported_at' => now(),
        ]);

        return back()->with('success', 'Transaksi berhasil dilaporkan. Menunggu konfirmasi dari pembeli.');
    }

    /**
     * Withdraw a pending transaction.
     */
    public function withdraw(Transaction $transaction)
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        if ($transaction->farmer_id !== $farmer->id) {
            abort(403);
        }

        if ($transaction->status !== Transaction::STATUS_PENDING) {
            return back()->with('error', 'Hanya transaksi pending yang dapat dibatalkan.');
        }

        $transaction->update([
            'status' => Transaction::STATUS_WITHDRAWN,
        ]);

        return back()->with('success', 'Transaksi berhasil dibatalkan.');
    }
}
