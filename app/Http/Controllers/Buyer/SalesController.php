<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\SaleRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Display the sales requests page.
     */
    public function index()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        $saleRequests = SaleRequest::where('buyer_id', $buyer->id)
            ->with('farmer.user', 'commodity')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $pendingTransactions = Transaction::where('buyer_id', $buyer->id)
            ->where('status', 'pending')
            ->with('farmer.user', 'commodity')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('buyer/sales/index', [
            'saleRequests' => $saleRequests,
            'pendingTransactions' => $pendingTransactions,
        ]);
    }

    /**
     * Update a sale request status.
     * Decline MUST have a reason - per consultant recommendation.
     */
    public function update(Request $request, SaleRequest $saleRequest)
    {
        $request->validate([
            'status' => 'required|in:accepted,declined',
            'decline_reason' => 'required_if:status,declined|nullable|string|max:500',
        ]);

        // Verify buyer owns this request
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($saleRequest->buyer_id !== $buyer->id) {
            abort(403);
        }

        $updateData = ['status' => $request->status];

        // If declining, add the reason
        if ($request->status === 'declined' && $request->decline_reason) {
            $updateData['decline_reason'] = $request->decline_reason;
        }

        $saleRequest->update($updateData);

        return back()->with('success', 'Status permintaan penjualan berhasil diperbarui.');
    }
}
