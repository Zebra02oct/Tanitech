<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of reports.
     */
    public function index(Request $request)
    {
        $query = Report::with(['reporter.user', 'buyer.user', 'transaction']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Sort by created_at desc (newest first)
        $reports = $query->orderBy('created_at', 'desc')->paginate(15);

        // Stats
        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', Report::STATUS_PENDING)->count(),
            'reviewing' => Report::where('status', Report::STATUS_REVIEWING)->count(),
            'resolved' => Report::where('status', Report::STATUS_RESOLVED)->count(),
            'dismissed' => Report::where('status', Report::STATUS_DISMISSED)->count(),
        ];

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Display a specific report.
     */
    public function show(Report $report)
    {
        $report->load(['reporter.user', 'buyer.user', 'transaction']);

        return Inertia::render('admin/reports/show', [
            'report' => $report,
        ]);
    }

    /**
     * Update report status.
     */
    public function update(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewing,resolved,dismissed',
            'admin_note' => 'nullable|string|max:1000',
        ]);

        $updateData = [
            'status' => $request->status,
        ];

        if ($request->filled('admin_note')) {
            $updateData['admin_note'] = $request->admin_note;
        }

        if ($request->status === Report::STATUS_RESOLVED || $request->status === Report::STATUS_DISMISSED) {
            $updateData['resolved_at'] = now();
        }

        $report->update($updateData);

        return redirect()->back()->with('success', 'Status laporan berhasil diperbarui.');
    }
}
