<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\BuyerCommodity;
use App\Models\BuyerProfile;
use App\Models\Commodity;
use App\Models\Grade;
use App\Models\Price;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommodityController extends Controller
{
    /**
     * Display the commodities management page.
     */
    public function index()
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        $buyerCommodities = BuyerCommodity::where('buyer_profile_id', $buyer->id)
            ->with(['commodity', 'grades.latestPrice'])
            ->get();

        $availableCommodities = Commodity::active()
            ->whereNotIn('id', $buyerCommodities->pluck('commodity_id'))
            ->get();

        return Inertia::render('buyer/commodities/index', [
            'buyerCommodities' => $buyerCommodities,
            'availableCommodities' => $availableCommodities,
        ]);
    }

    /**
     * Add a new commodity with grades.
     */
    public function store(Request $request)
    {
        $request->validate([
            'commodity_id' => 'required|exists:commodities,id',
            'grades' => 'required|array|min:1',
            'grades.*.name' => 'required|string|max:100',
            'grades.*.price' => 'required|numeric|min:0',
            'grades.*.description' => 'nullable|string',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        // Check if already exists
        $exists = BuyerCommodity::where('buyer_profile_id', $buyer->id)
            ->where('commodity_id', $request->commodity_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Komoditas ini sudah ada.');
        }

        // Create buyer commodity
        $buyerCommodity = BuyerCommodity::create([
            'buyer_profile_id' => $buyer->id,
            'commodity_id' => $request->commodity_id,
            'is_active' => true,
        ]);

        // Get commodity unit
        $commodity = Commodity::find($request->commodity_id);

        // Create grades with initial prices
        foreach ($request->grades as $gradeData) {
            $grade = Grade::create([
                'buyer_commodity_id' => $buyerCommodity->id,
                'name' => $gradeData['name'],
                'description' => $gradeData['description'] ?? null,
                'is_active' => true,
            ]);

            // Create initial price
            Price::create([
                'grade_id' => $grade->id,
                'price' => $gradeData['price'],
                'unit' => $commodity->unit,
                'confirmed_at' => now(),
            ]);
        }

        return back()->with('success', 'Komoditas berhasil ditambahkan.');
    }

    /**
     * Add a new grade to existing commodity.
     */
    public function addGrade(Request $request, BuyerCommodity $commodity)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($commodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        $grade = Grade::create([
            'buyer_commodity_id' => $commodity->id,
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => true,
        ]);

        Price::create([
            'grade_id' => $grade->id,
            'price' => $request->price,
            'unit' => $commodity->commodity->unit,
            'confirmed_at' => now(),
        ]);

        return back()->with('success', 'Grade berhasil ditambahkan.');
    }

    /**
     * Update a grade.
     */
    public function updateGrade(Request $request, Grade $grade)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($grade->buyerCommodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        $grade->update([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Grade berhasil diperbarui.');
    }

    /**
     * Delete a grade.
     */
    public function deleteGrade(Grade $grade)
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($grade->buyerCommodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        $grade->delete();

        return back()->with('success', 'Grade berhasil dihapus.');
    }

    /**
     * Update a commodity.
     */
    public function update(Request $request, BuyerCommodity $commodity)
    {
        $request->validate([
            'is_active' => 'boolean',
        ]);

        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($commodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        $commodity->update([
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Komoditas berhasil diperbarui.');
    }

    /**
     * Remove a commodity.
     */
    public function destroy(BuyerCommodity $commodity)
    {
        $user = auth()->user();
        $buyer = $user->buyerProfile;

        if ($commodity->buyer_profile_id !== $buyer->id) {
            abort(403);
        }

        $commodity->delete();

        return back()->with('success', 'Komoditas berhasil dihapus.');
    }
}
