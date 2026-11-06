<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\BuyerProfile;
use App\Models\Commodity;
use App\Models\SaleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleRequestController extends Controller
{
    /**
     * Store a new sale request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'buyer_id' => 'required|exists:buyer_profiles,id',
            'commodity_id' => 'required|exists:commodities,id',
            'estimated_quantity' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $farmer = $user->farmerProfile;

        if (!$farmer) {
            return back()->with('error', 'Silakan lengkapi profil Anda terlebih dahulu.');
        }

        $saleRequest = SaleRequest::create([
            'farmer_id' => $farmer->id,
            'buyer_id' => $request->buyer_id,
            'commodity_id' => $request->commodity_id,
            'estimated_quantity' => $request->estimated_quantity,
            'message' => $request->message,
            'status' => SaleRequest::STATUS_PENDING,
        ]);

        return redirect($saleRequest->whatsapp_url);
    }
}
