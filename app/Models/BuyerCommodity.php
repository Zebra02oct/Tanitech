<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BuyerCommodity extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_profile_id',
        'commodity_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the buyer profile that owns the commodity.
     */
    public function buyerProfile(): BelongsTo
    {
        return $this->belongsTo(BuyerProfile::class, 'buyer_profile_id');
    }

    /**
     * Get the commodity.
     */
    public function commodity(): BelongsTo
    {
        return $this->belongsTo(Commodity::class);
    }

    /**
     * Get the grades for this buyer commodity.
     */
    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'buyer_commodity_id');
    }

    /**
     * Get active grades with prices.
     */
    public function getActiveGradesWithPrices()
    {
        return $this->grades()
            ->with('latestPrice')
            ->where('is_active', true)
            ->get();
    }

    /**
     * Check if has active price (not expired in 30 days).
     */
    public function hasActivePrice(): bool
    {
        return $this->grades()
            ->where('is_active', true)
            ->whereHas('latestPrice', function ($query) {
                $query->where('confirmed_at', '>=', now()->subDays(30));
            })
            ->exists();
    }
}
