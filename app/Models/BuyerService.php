<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuyerService extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_profile_id',
        'pickup_available',
        'weighing_available',
        'payment_method',
        'minimum_quantity',
        'pickup_minimum_quantity',
        'pickup_notes',
    ];

    protected $casts = [
        'pickup_available' => 'boolean',
        'weighing_available' => 'boolean',
        'minimum_quantity' => 'decimal:2',
        'pickup_minimum_quantity' => 'decimal:2',
    ];

    /**
     * Get the buyer profile that owns the service.
     */
    public function buyerProfile(): BelongsTo
    {
        return $this->belongsTo(BuyerProfile::class, 'buyer_profile_id');
    }

    /**
     * Get formatted minimum quantity.
     */
    public function getFormattedMinimumQuantityAttribute(): string
    {
        if (!$this->minimum_quantity) {
            return 'Tidak ada minimum';
        }

        return number_format($this->minimum_quantity, 0, ',', '.') . ' kg';
    }

    /**
     * Get formatted pickup minimum quantity.
     */
    public function getFormattedPickupMinimumQuantityAttribute(): string
    {
        if (!$this->pickup_minimum_quantity) {
            return 'Tidak ada minimum';
        }

        return number_format($this->pickup_minimum_quantity, 0, ',', '.') . ' kg';
    }
}
