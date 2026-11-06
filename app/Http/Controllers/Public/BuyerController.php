<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\Commodity;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerController extends Controller
{
    /**
     * Display a listing of buyers.
     */
    public function index(Request $request)
    {
        $query = BuyerProfile::with([
            'service',
            'buyerCommodities.commodity',
            'buyerCommodities.grades.latestPrice',
        ])
        ->where('is_active', true);

        // Filter by verified_only
        if ($request->get('verified_only') === '1') {
            $query->where('verification_status', 'approved');
        }

        // Filter by commodity
        if ($request->has('commodity')) {
            $query->whereHas('buyerCommodities', function ($q) use ($request) {
                $q->where('commodity_id', $request->commodity)
                    ->where('is_active', true);
            });
        }

        // Filter by location
        if ($request->has('regency')) {
            $query->where('regency', $request->regency);
        }

        if ($request->has('district')) {
            $query->where('district', $request->district);
        }

        // Sorting options
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');

        switch ($sortBy) {
            case 'rating':
                // Sort by average rating (requires subquery)
                $query->withAvg([
                    'transactions' => function ($q) {
                        $q->where('status', 'confirmed');
                    }
                ], 'overall_rating');
                $query->orderBy('transactions_avg_overall_rating', 'desc');
                break;
            case 'price_low':
            case 'price_high':
                // Sort by price will be handled after collection due to nested relations
                $query->orderBy('created_at', 'desc');
                break;
            case 'pickup':
                $query->whereHas('service', function ($q) {
                    $q->where('pickup_available', true);
                })->orderBy('created_at', 'desc');
                break;
            case 'verified':
                $query->orderByRaw("FIELD(verification_status, 'approved', 'pending', 'revision', 'rejected')");
                break;
            case 'recent':
                // Sort by most recently updated prices
                $query->withMax('buyerCommodities.grades.prices', 'updated_at');
                $query->orderBy('buyer_commodities_grades_prices_max_updated_at', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortDir);
                break;
        }

        $buyers = $query->paginate(12);

        $commodities = Commodity::active()->orderBy('name')->get();

        return Inertia::render('public/buyers/index', [
            'buyers' => $buyers,
            'commodities' => $commodities,
            'filters' => $request->only(['commodity', 'regency', 'district', 'sort', 'direction', 'verified_only']),
        ]);
    }

    /**
     * Display a specific buyer.
     */
    public function show(BuyerProfile $buyer)
    {
        $buyer->load([
            'service',
            'buyerCommodities.commodity',
            'buyerCommodities.grades.latestPrice',
            'transactions.review.farmer.user',
        ]);

        // Transform buyer data with price expiry info
        $buyerData = [
            'id' => $buyer->id,
            'business_name' => $buyer->business_name,
            'description' => $buyer->description,
            'phone' => $buyer->phone,
            'village' => $buyer->village,
            'district' => $buyer->district,
            'regency' => $buyer->regency,
            'province' => $buyer->province,
            'verification_status' => $buyer->verification_status,
            'verified_at' => $buyer->verified_at?->toIso8601String(),
            'is_active' => $buyer->is_active,
            'buyer_commodities' => $buyer->buyerCommodities->map(function ($bc) {
                return [
                    'commodity' => [
                        'id' => $bc->commodity->id,
                        'name' => $bc->commodity->name,
                        'unit' => $bc->commodity->unit,
                    ],
                    'grades' => $bc->grades->map(function ($grade) {
                        $price = $grade->latestPrice;
                        return [
                            'id' => $grade->id,
                            'name' => $grade->name,
                            'description' => $grade->description,
                            'is_active' => $grade->is_active,
                            'latest_price' => $price ? [
                                'price' => (float) $price->price,
                                'unit' => $price->unit,
                                'confirmed_at' => $price->confirmed_at->toIso8601String(),
                                'days_since_confirm' => now()->diffInDays($price->confirmed_at),
                                'is_expired' => $price->isExpired(),
                            ] : null,
                        ];
                    }),
                ];
            }),
            'service' => $buyer->service ? [
                'pickup_available' => $buyer->service->pickup_available,
                'weighing_available' => $buyer->service->weighing_available,
                'payment_method' => $buyer->service->payment_method,
                'minimum_quantity' => $buyer->service->minimum_quantity,
                'pickup_minimum_quantity' => $buyer->service->pickup_minimum_quantity,
                'pickup_notes' => $buyer->service->pickup_notes,
            ] : null,
        ];

        // Calculate average ratings
        $reviews = $buyer->transactions()
            ->where('status', 'confirmed')
            ->with('review')
            ->get()
            ->pluck('review')
            ->filter();

        $avgRatings = $reviews->isNotEmpty() ? [
            'price_rating' => round($reviews->avg('price_rating'), 1),
            'weighing_rating' => round($reviews->avg('weighing_rating'), 1),
            'payment_rating' => round($reviews->avg('payment_rating'), 1),
            'service_rating' => round($reviews->avg('service_rating'), 1),
            'overall_rating' => round($reviews->avg('overall_rating'), 1),
        ] : null;

        $verifiedTransactions = $buyer->transactions()
            ->where('status', 'confirmed')
            ->count();

        // Get recent reviews
        $recentReviews = $buyer->transactions()
            ->where('status', 'confirmed')
            ->with(['review', 'farmer.user'])
            ->get()
            ->pluck('review')
            ->filter()
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'price_rating' => $review->price_rating,
                    'weighing_rating' => $review->weighing_rating,
                    'payment_rating' => $review->payment_rating,
                    'service_rating' => $review->service_rating,
                    'overall_rating' => $review->overall_rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->toIso8601String(),
                    'farmer' => [
                        'user' => [
                            'name' => $review->transaction->farmer->user->name,
                        ],
                    ],
                ];
            });

        // Check if buyer is favorited by current user
        $isFavorite = false;
        if (auth()->check()) {
            $user = auth()->user();
            if ($user->farmerProfile) {
                $isFavorite = Favorite::where('farmer_id', $user->farmerProfile->id)
                    ->where('buyer_id', $buyer->id)
                    ->exists();
            }
        }

        return Inertia::render('public/buyers/show', [
            'buyer' => $buyerData,
            'avgRatings' => $avgRatings,
            'verifiedTransactions' => $verifiedTransactions,
            'isFavorite' => $isFavorite,
            'recentReviews' => $recentReviews,
        ]);
    }
}
