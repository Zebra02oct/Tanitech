<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles;

    /**
     * Role constants.
     */
    public const ROLE_ADMIN = 'admin';
    public const ROLE_FARMER = 'farmer';
    public const ROLE_BUYER = 'buyer';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the farmer profile.
     */
    public function farmerProfile(): HasOne
    {
        return $this->hasOne(FarmerProfile::class);
    }

    /**
     * Get the buyer profile.
     */
    public function buyerProfile(): HasOne
    {
        return $this->hasOne(BuyerProfile::class);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Check if user is farmer.
     */
    public function isFarmer(): bool
    {
        return $this->hasRole(self::ROLE_FARMER);
    }

    /**
     * Check if user is buyer.
     */
    public function isBuyer(): bool
    {
        return $this->hasRole(self::ROLE_BUYER);
    }

    /**
     * Check if user has completed profile.
     */
    public function hasCompletedProfile(): bool
    {
        if ($this->isFarmer()) {
            return $this->farmerProfile !== null;
        }

        if ($this->isBuyer()) {
            return $this->buyerProfile !== null;
        }

        return true;
    }

    /**
     * Get user's display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name;
    }
}
