<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'price_rating',
        'weighing_rating',
        'payment_rating',
        'service_rating',
        'overall_rating',
        'comment',
    ];

    protected $casts = [
        'price_rating' => 'integer',
        'weighing_rating' => 'integer',
        'payment_rating' => 'integer',
        'service_rating' => 'integer',
        'overall_rating' => 'integer',
    ];

    /**
     * Rating constraints.
     */
    public const MIN_RATING = 1;
    public const MAX_RATING = 5;

    /**
     * Get the transaction.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the farmer who gave the review.
     */
    public function farmer()
    {
        return $this->hasOneThrough(
            FarmerProfile::class,
            Transaction::class,
            'id',
            'id',
            'transaction_id',
            'farmer_id'
        );
    }

    /**
     * Get average rating.
     */
    public function getAverageRatingAttribute(): float
    {
        return round(
            ($this->price_rating +
            $this->weighing_rating +
            $this->payment_rating +
            $this->service_rating) / 4,
            1
        );
    }
}
