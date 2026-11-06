<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FarmerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'village',
        'district',
        'regency',
        'province',
        'address',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the user that owns the farmer profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sale requests for this farmer.
     */
    public function saleRequests(): HasMany
    {
        return $this->hasMany(SaleRequest::class, 'farmer_id');
    }

    /**
     * Get the transactions for this farmer.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'farmer_id');
    }

    /**
     * Get the favorites for this farmer.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'farmer_id');
    }

    /**
     * Get full address string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->village,
            $this->district,
            $this->regency,
            $this->province,
        ]);

        return implode(', ', $parts);
    }
}
