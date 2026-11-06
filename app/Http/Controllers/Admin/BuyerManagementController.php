<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerManagementController extends Controller
{
    /**
     * Display list of all buyers with their status.
     */
    public function index(Request $request)
    {
        $query = BuyerProfile::with(['user', 'verifier'])
            ->withCount(['transactions', 'favorites']);

        // Filter by status
        if ($request->get('status') === 'suspended') {
            $query->where('suspension_status', 'suspended');
        } elseif ($request->get('status') === 'active') {
            $query->where('suspension_status', 'active');
            $query->where('is_active', true);
        } elseif ($request->get('status') === 'pending') {
            $query->where('verification_status', 'pending');
        }

        // Filter by verification status
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            $query->where('verification_status', $request->verification_status);
        }

        // Search by business name
        if ($request->has('search') && $request->search) {
            $query->where('business_name', 'like', '%' . $request->search . '%');
        }

        $buyers = $query->orderBy('created_at', 'desc')->paginate(15);

        // Stats
        $stats = [
            'total' => BuyerProfile::count(),
            'active' => BuyerProfile::where('suspension_status', 'active')->where('is_active', true)->count(),
            'suspended' => BuyerProfile::where('suspension_status', 'suspended')->count(),
            'pending_verification' => BuyerProfile::where('verification_status', 'pending')->count(),
        ];

        return Inertia::render('admin/buyers/index', [
            'buyers' => $buyers,
            'stats' => $stats,
            'filters' => $request->only(['status', 'verification_status', 'search']),
        ]);
    }

    /**
     * Display a specific buyer.
     */
    public function show(BuyerProfile $buyer)
    {
        $buyer->load([
            'user',
            'verifier',
            'suspender',
            'transactions' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(20);
            },
            'transactions.farmer.user',
            'transactions.commodity',
        ]);

        return Inertia::render('admin/buyers/show', [
            'buyer' => $buyer,
        ]);
    }

    /**
     * Suspend a buyer.
     */
    public function suspend(Request $request, BuyerProfile $buyer)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $admin = auth()->user();

        // Check if already suspended
        if ($buyer->suspension_status === 'suspended') {
            return back()->with('error', 'Buyer sudah dalam status suspenso.');
        }

        $buyer->update([
            'suspension_status' => 'suspended',
            'suspended_at' => now(),
            'suspended_by' => $admin->id,
            'suspension_reason' => $request->reason,
            'is_active' => false,
        ]);

        // Log the suspension
        AuditLogService::logSuspend($admin, $buyer, $request->reason);

        return back()->with('success', "Buyer {$buyer->business_name} berhasil suspenso.");
    }

    /**
     * Unsuspend (reactivate) a buyer.
     */
    public function unsuspend(BuyerProfile $buyer)
    {
        $admin = auth()->user();

        // Check if not suspended
        if ($buyer->suspension_status !== 'suspended') {
            return back()->with('error', 'Buyer tidak dalam status suspenso.');
        }

        $buyer->update([
            'suspension_status' => 'active',
            'suspended_at' => null,
            'suspended_by' => null,
            'suspension_reason' => null,
            'is_active' => true,
        ]);

        // Log the unsuspension
        AuditLogService::logAction(
            $admin,
            'unsuspended',
            $buyer,
            "Admin reactivated buyer {$buyer->business_name} from suspension"
        );

        return back()->with('success', "Buyer {$buyer->business_name} berhasil diaktifkan kembali.");
    }

    /**
     * Toggle buyer active status.
     */
    public function toggleActive(BuyerProfile $buyer)
    {
        $admin = auth()->user();
        $newStatus = !$buyer->is_active;

        // Don't allow activating suspended buyers
        if ($newStatus && $buyer->suspension_status === 'suspended') {
            return back()->with('error', 'Tidak dapat mengaktifkan buyer yang sedang suspenso. Harapcabatalkan suspenso terlebih dahulu.');
        }

        $buyer->update([
            'is_active' => $newStatus,
        ]);

        AuditLogService::logAction(
            $admin,
            $newStatus ? 'activated' : 'deactivated',
            $buyer,
            "Buyer {$buyer->business_name} has been " . ($newStatus ? 'activated' : 'deactivated')
        );

        return back()->with('success', "Buyer {$buyer->business_name} berhasil " . ($newStatus ? 'diaktifkan' : 'dinonaktifkan') . ".");
    }
}
