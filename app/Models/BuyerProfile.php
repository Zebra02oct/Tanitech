<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BuyerProfile extends Model
{
    use HasFactory;

    // User-editable fields only - sensitive fields removed for security
    protected $fillable = [
        'user_id',
        'business_name',
        'description',
        'phone',
        'village',
        'district',
        'regency',
        'province',
        'address',
        'latitude',
        'longitude',
        'google_place_id',
    ];

    // Sensitive fields that should NEVER be mass-assigned by regular users
    protected $guarded = [
        'verification_status',
        'verified_at',
        'verified_by',
        'is_active',
        'inactive_reason',
        'suspended_at',
        'suspended_by',
        'suspension_reason',
        'suspension_status',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'verified_at' => 'datetime',
        'is_active' => 'boolean',
        'suspended_at' => 'datetime',
    ];

    /**
     * Verification status constants.
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_REVISION = 'revision';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /**
     * Suspension status constants.
     */
    public const SUSPENSION_ACTIVE = 'active';
    public const SUSPENSION_SUSPENDED = 'suspended';
    public const SUSPENSION_PENDING_REVIEW = 'pending_review';

    /**
     * Get the user that owns the buyer profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin that verified this buyer.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the admin that suspended this buyer.
     */
    public function suspender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'suspended_by');
    }

    /**
     * Get the commodities for this buyer.
     */
    public function buyerCommodities(): HasMany
    {
        return $this->hasMany(BuyerCommodity::class, 'buyer_profile_id');
    }

    /**
     * Get the services for this buyer.
     */
    public function service(): HasOne
    {
        return $this->hasOne(BuyerService::class, 'buyer_profile_id');
    }

    /**
     * Get the sale requests for this buyer.
     */
    public function saleRequests(): HasMany
    {
        return $this->hasMany(SaleRequest::class, 'buyer_id');
    }

    /**
     * Get the transactions for this buyer.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    /**
     * Get the favorites for this buyer.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'buyer_id');
    }

    /**
     * Check if buyer is verified.
     */
    public function isVerified(): bool
    {
        return $this->verification_status === self::STATUS_APPROVED;
    }

    /**
     * Check if buyer is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Check if buyer is suspended.
     */
    public function isSuspended(): bool
    {
        return $this->suspension_status === self::SUSPENSION_SUSPENDED;
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
