<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_commodity_id',
        'name',
        'description',
        'criteria',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Price expiration in days.
     */
    public const PRICE_EXPIRATION_DAYS = 30;

    /**
     * Get the buyer commodity that owns the grade.
     */
    public function buyerCommodity(): BelongsTo
    {
        return $this->belongsTo(BuyerCommodity::class, 'buyer_commodity_id');
    }

    /**
     * Get the latest price for this grade.
     */
    public function latestPrice(): HasOne
    {
        return $this->hasOne(Price::class, 'grade_id')->latestOfMany('confirmed_at');
    }

    /**
     * Get the current price if not expired.
     */
    public function getCurrentPriceAttribute()
    {
        $price = $this->latestPrice;

        if (!$price) {
            return null;
        }

        if ($price->confirmed_at->lt(now()->subDays(self::PRICE_EXPIRATION_DAYS))) {
            return null;
        }

        return $price;
    }

    /**
     * Check if price is expired.
     */
    public function isPriceExpired(): bool
    {
        $price = $this->latestPrice;

        if (!$price) {
            return true;
        }

        return $price->confirmed_at->lt(now()->subDays(self::PRICE_EXPIRATION_DAYS));
    }
}
