<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Show the create review form.
     */
    public function create(Transaction $transaction)
    {
        $user = auth()->user();
        $farmer = $user->farmerProfile;

        // Verify ownership
        if ($transaction->farmer_id !== $farmer->id) {
            abort(403);
        }

        // Verify transaction is confirmed
        if ($transaction->status !== Transaction::STATUS_CONFIRMED) {
            return redirect()->route('farmer.transactions.index')
                ->with('error', 'Hanya transaksi yang sudah dikonfirmasi yang dapat direview.');
        }

        // Verify no existing review
        if ($transaction->review) {
            return redirect()->route('farmer.transactions.index')
                ->with('error', 'Transaksi ini sudah memiliki review.');
        }

        $transaction->load(['buyer', 'commodity']);

        return Inertia::render('farmer/reviews/create', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Store a new review.
     */
    public function store(Request $request, Transaction $transaction)
    {
        $request->validate([
            'price_rating' => 'required|integer|min:1|max:5',
            'weighing_rating' => 'required|integer|min:1|max:5',
            'payment_rating' => 'required|integer|min:1|max:5',
            'service_rating' => 'required|integer|min:1|max:5',
            'overall_rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $farmer = $user->farmerProfile;

        // Verify ownership
        if ($transaction->farmer_id !== $farmer->id) {
            abort(403);
        }

        // Verify transaction is confirmed
        if ($transaction->status !== Transaction::STATUS_CONFIRMED) {
            return back()->with('error', 'Hanya transaksi yang sudah dikonfirmasi yang dapat direview.');
        }

        // Verify no existing review
        if ($transaction->review) {
            return back()->with('error', 'Transaksi ini sudah memiliki review.');
        }

        Review::create([
            'transaction_id' => $transaction->id,
            'price_rating' => $request->price_rating,
            'weighing_rating' => $request->weighing_rating,
            'payment_rating' => $request->payment_rating,
            'service_rating' => $request->service_rating,
            'overall_rating' => $request->overall_rating,
            'comment' => $request->comment,
        ]);

        return redirect()->route('farmer.transactions.index')
            ->with('success', 'Review berhasil dikirim. Terima kasih atas feedback Anda!');
    }
}
