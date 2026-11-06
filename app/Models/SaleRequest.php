<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'buyer_id',
        'commodity_id',
        'estimated_quantity',
        'message',
        'status',
        'decline_reason',
    ];

    protected $casts = [
        'estimated_quantity' => 'decimal:2',
    ];

    /**
     * Status constants.
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    /**
     * Get the farmer profile.
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(FarmerProfile::class, 'farmer_id');
    }

    /**
     * Get the buyer profile.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(BuyerProfile::class, 'buyer_id');
    }

    /**
     * Get the commodity.
     */
    public function commodity(): BelongsTo
    {
        return $this->belongsTo(Commodity::class);
    }

    /**
     * Check if pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Generate WhatsApp message URL.
     */
    public function getWhatsAppUrlAttribute(): string
    {
        $phone = preg_replace('/[^0-9]/', '', $this->buyer->phone);
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        $commodity = $this->commodity->name ?? 'komoditas';
        $quantity = number_format($this->estimated_quantity, 0, ',', '.');
        $unit = $this->commodity->unit ?? 'kg';
        $farmerName = $this->farmer->user->name ?? 'kami';

        $message = "Halo, saya petani {$farmerName}.\n\n";
        $message .= "Saya ingin menjual:\n";
        $message .= "- Komoditas: {$commodity}\n";
        $message .= "- Perkiraan jumlah: {$quantity} {$unit}\n";
        if ($this->message) {
            $message .= "- Pesan: {$this->message}\n";
        }
        $message .= "\nApakah Bapak/Ibu masih menerima?";

        return "https://wa.me/{$phone}?text=" . urlencode($message);
    }
}
