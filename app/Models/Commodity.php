<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Commodity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($commodity) {
            if (empty($commodity->slug)) {
                $commodity->slug = Str::slug($commodity->name);
            }
        });
    }

    /**
     * Get the buyer commodities for this commodity.
     */
    public function buyerCommodities(): HasMany
    {
        return $this->hasMany(BuyerCommodity::class);
    }

    /**
     * Scope a query to only include active commodities.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get active commodities with buyer count.
     */
    public static function getActiveWithBuyerCount()
    {
        return static::active()
            ->withCount('buyerCommodities')
            ->orderBy('name')
            ->get();
    }
}
