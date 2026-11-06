<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'buyer_id',
        'transaction_id',
        'type',
        'description',
        'status',
        'admin_note',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    /**
     * Type constants.
     */
    public const TYPE_FALSE_INFORMATION = 'false_information';
    public const TYPE_TRANSACTION_DISPUTE = 'transaction_dispute';
    public const TYPE_PRICE_ISSUE = 'price_issue';
    public const TYPE_FRAUD_SUSPECTED = 'fraud_suspected';
    public const TYPE_INAPPROPRIATE_BEHAVIOR = 'inappropriate_behavior';
    public const TYPE_OTHER = 'other';

    /**
     * Status constants.
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_REVIEWING = 'reviewing';
    public const STATUS_RESOLVED = 'resolved';
    public const STATUS_DISMISSED = 'dismissed';

    /**
     * Get the reporter.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get the buyer profile.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(BuyerProfile::class, 'buyer_id');
    }

    /**
     * Get the transaction.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            self::TYPE_FALSE_INFORMATION => 'Informasi Salah',
            self::TYPE_TRANSACTION_DISPUTE => 'Perselisihan Transaksi',
            self::TYPE_PRICE_ISSUE => 'Masalah Harga',
            self::TYPE_FRAUD_SUSPECTED => 'Dugaan Penipuan',
            self::TYPE_INAPPROPRIATE_BEHAVIOR => 'Perilaku Tidak Pantas',
            self::TYPE_OTHER => 'Lainnya',
            default => $this->type,
        };
    }

    /**
     * Get status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Menunggu',
            self::STATUS_REVIEWING => 'Sedang Ditinjau',
            self::STATUS_RESOLVED => 'Selesai',
            self::STATUS_DISMISSED => 'Ditolak',
            default => $this->status,
        };
    }
}
