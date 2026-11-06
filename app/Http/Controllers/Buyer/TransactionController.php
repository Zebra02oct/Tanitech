<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display pending transactions for confirmation.
     */
    public function index()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            return redirect('/');
        }

        $pendingTransactions = Transaction::where('buyer_id', $buyer->id)
            ->where('status', Transaction::STATUS_PENDING)
            ->with(['farmer.user', 'commodity'])
            ->orderBy('created_at', 'desc')
            ->get();

        $allTransactions = Transaction::where('buyer_id', $buyer->id)
            ->with(['farmer.user', 'commodity'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('buyer/sales/index', [
            'pendingTransactions' => $pendingTransactions,
            'allTransactions' => $allTransactions,
        ]);
    }

    /**
     * Confirm a pending transaction.
     */
    public function confirm(Transaction $transaction)
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            abort(403);
        }

        if ($transaction->buyer_id !== $buyer->id) {
            abort(403);
        }

        if ($transaction->status !== Transaction::STATUS_PENDING) {
            return back()->with('error', 'Hanya transaksi pending yang dapat dikonfirmasi.');
        }

        $transaction->update([
            'status' => Transaction::STATUS_CONFIRMED,
            'confirmed_at' => now(),
            'responded_by' => $user->id,
        ]);

        // Log the confirmation
        AuditLogService::logConfirm($user, $transaction, "Buyer {$buyer->business_name} confirmed transaction #{$transaction->id}");

        return back()->with('success', 'Transaksi berhasil dikonfirmasi. Petani dapat memberikan review.');
    }

    /**
     * Reject a pending transaction.
     * MUST have a reason - per consultant recommendation.
     */
    public function reject(Request $request, Transaction $transaction)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if (!$buyer) {
            abort(403);
        }

        if ($transaction->buyer_id !== $buyer->id) {
            abort(403);
        }

        if ($transaction->status !== Transaction::STATUS_PENDING) {
            return back()->with('error', 'Hanya transaksi pending yang dapat ditolak.');
        }

        $transaction->update([
            'status' => Transaction::STATUS_REJECTED,
            'rejection_reason' => $request->reason,
            'responded_by' => $user->id,
        ]);

        // Log the rejection
        AuditLogService::logReject($user, $transaction, $request->reason);

        return back()->with('success', 'Transaksi ditolak dengan alasan: ' . $request->reason);
    }
}
