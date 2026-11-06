<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Price extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id',
        'price',
        'unit',
        'confirmed_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'confirmed_at' => 'datetime',
    ];

    /**
     * Price expiration in days.
     */
    public const EXPIRATION_DAYS = 30;

    /**
     * Get the grade that owns the price.
     */
    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    /**
     * Check if price is expired.
     */
    public function isExpired(): bool
    {
        return $this->confirmed_at->lt(now()->subDays(self::EXPIRATION_DAYS));
    }

    /**
     * Get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.') . '/' . $this->unit;
    }

    /**
     * Get time since last confirmation.
     */
    public function getTimeSinceConfirmationAttribute(): string
    {
        return $this->confirmed_at->diffForHumans();
    }
}
