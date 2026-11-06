<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    /**
     * Indicates if the model should be timestamped.
     * We only use created_at, not updated_at.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'description',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Action constants
     */
    public const ACTION_CREATE = 'created';
    public const ACTION_UPDATE = 'updated';
    public const ACTION_DELETE = 'deleted';
    public const ACTION_LOGIN = 'login';
    public const ACTION_LOGOUT = 'logout';
    public const ACTION_VIEW = 'viewed';
    public const ACTION_VERIFY = 'verified';
    public const ACTION_SUSPEND = 'suspended';
    public const ACTION_REJECT = 'rejected';
    public const ACTION_CONFIRM = 'confirmed';

    /**
     * Get the user that owns the audit log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related model (polymorphic).
     */
    public function subject(): BelongsTo
    {
        return $this->morphTo(__FUNCTION__, 'model_type', 'model_id');
    }

    /**
     * Log a create action.
     */
    public static function logCreate(User $user, Model $model, array $values = []): self
    {
        return static::createLog($user, self::ACTION_CREATE, $model, [], $values);
    }

    /**
     * Log an update action.
     */
    public static function logUpdate(User $user, Model $model, array $oldValues, array $newValues): self
    {
        return static::createLog($user, self::ACTION_UPDATE, $model, $oldValues, $newValues);
    }

    /**
     * Log a delete action.
     */
    public static function logDelete(User $user, Model $model, array $values = []): self
    {
        return static::createLog($user, self::ACTION_DELETE, $model, $values, []);
    }

    /**
     * Log a custom action.
     */
    public static function logAction(User $user, string $action, ?Model $model = null, ?string $description = null): self
    {
        return static::createLog($user, $action, $model, [], [], $description);
    }

    /**
     * Create an audit log entry.
     */
    protected static function createLog(
        User $user,
        string $action,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = [],
        ?string $description = null
    ): self {
        return static::create([
            'user_id' => $user->id,
            'action' => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->getKey(),
            'old_values' => !empty($oldValues) ? $oldValues : null,
            'new_values' => !empty($newValues) ? $newValues : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'description' => $description,
            'created_at' => now(),
        ]);
    }
}
