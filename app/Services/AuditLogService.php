<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class AuditLogService
{
    /**
     * Log a create action.
     */
    public static function logCreate(User $user, Model $model, ?string $description = null): void
    {
        self::log(AuditLog::ACTION_CREATE, $user, $model, [], $model->toArray(), $description);
    }

    /**
     * Log an update action with changed values only.
     */
    public static function logUpdate(User $user, Model $model, array $oldValues, ?string $description = null): void
    {
        // Get only changed values
        $newValues = [];
        foreach ($model->getAttributes() as $key => $value) {
            if (array_key_exists($key, $oldValues) && $oldValues[$key] !== $value) {
                $newValues[$key] = $value;
            }
        }

        self::log(AuditLog::ACTION_UPDATE, $user, $model, $oldValues, $newValues, $description);
    }

    /**
     * Log a delete action.
     */
    public static function logDelete(User $user, Model $model, ?string $description = null): void
    {
        self::log(AuditLog::ACTION_DELETE, $user, $model, $model->toArray(), [], $description);
    }

    /**
     * Log a verification action.
     */
    public static function logVerify(User $admin, Model $model, ?string $description = null): void
    {
        self::log(AuditLog::ACTION_VERIFY, $admin, $model, [], ['verified_at' => now()], $description);
    }

    /**
     * Log a suspension action.
     */
    public static function logSuspend(User $admin, Model $model, ?string $reason = null): void
    {
        self::log(AuditLog::ACTION_SUSPEND, $admin, $model, [], ['suspended_at' => now(), 'reason' => $reason]);
    }

    /**
     * Log a confirmation action (transaction confirmed).
     */
    public static function logConfirm(User $user, Model $model, ?string $description = null): void
    {
        self::log(AuditLog::ACTION_CONFIRM, $user, $model, [], ['confirmed_at' => now()], $description);
    }

    /**
     * Log a rejection action (transaction rejected).
     */
    public static function logReject(User $user, Model $model, string $reason): void
    {
        self::log(AuditLog::ACTION_REJECT, $user, $model, [], ['rejected_at' => now(), 'reason' => $reason]);
    }

    /**
     * Log a custom action.
     */
    public static function logAction(User $user, string $action, ?Model $model = null, ?string $description = null): void
    {
        self::log($action, $user, $model, [], [], $description);
    }

    /**
     * Create the audit log entry.
     */
    protected static function log(
        string $action,
        User $user,
        ?Model $model,
        array $oldValues,
        array $newValues,
        ?string $description = null
    ): void {
        try {
            AuditLog::create([
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
        } catch (\Exception $e) {
            // Don't let audit logging break the application
            Log::error('Failed to create audit log: ' . $e->getMessage(), [
                'action' => $action,
                'user_id' => $user->id,
                'model' => $model ? get_class($model) : null,
            ]);
        }
    }
}
