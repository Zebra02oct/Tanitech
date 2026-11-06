<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    /**
     * Display the verifications page.
     */
    public function index()
    {
        $pendingVerifications = BuyerProfile::with('user')
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'asc')
            ->paginate(10);

        $revisionVerifications = BuyerProfile::with('user')
            ->where('verification_status', 'revision')
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/verifications/index', [
            'pendingVerifications' => $pendingVerifications,
            'revisionVerifications' => $revisionVerifications,
        ]);
    }

    /**
     * Update verification status.
     */
    public function update(Request $request, BuyerProfile $buyer)
    {
        $request->validate([
            'status' => 'required|in:approved,revision,rejected',
            'admin_note' => 'nullable|string|max:1000',
        ]);

        $admin = auth()->user();
        $oldStatus = $buyer->verification_status;

        $updateData = [
            'verification_status' => $request->status,
        ];

        if ($request->status === 'approved') {
            $updateData['verified_at'] = now();
            $updateData['verified_by'] = auth()->id();
            $updateData['is_active'] = true;
        }

        if ($request->status === 'rejected') {
            $updateData['is_active'] = false;
        }

        $buyer->update($updateData);

        // Log the verification action
        $actionDescriptions = [
            'approved' => "Admin approved buyer verification for {$buyer->business_name}",
            'revision' => "Admin requested revision for {$buyer->business_name}",
            'rejected' => "Admin rejected buyer verification for {$buyer->business_name}",
        ];

        AuditLogService::logAction(
            $admin,
            $request->status,
            $buyer,
            $actionDescriptions[$request->status] ?? "Verification status changed to {$request->status}"
        );

        return back()->with('success', 'Status verifikasi berhasil diperbarui.');
    }
}
