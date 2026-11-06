<?php

namespace App\Console\Commands;

use App\Models\Price;
use App\Models\Grade;
use App\Models\BuyerProfile;
use App\Models\User;
use App\Mail\PriceExpiryReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckPriceExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'prices:check-expiry
                            {--dry-run : Show what would be notified without sending}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expiring prices and notify buyers';

    /**
     * Warning threshold in days (when to start warning)
     */
    protected const WARNING_DAYS = 25;

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');

        $this->info('Checking price expiry...');

        // Get all active prices that are expiring or expired
        $expiringPrices = Price::whereNotNull('confirmed_at')
            ->get()
            ->filter(function ($price) {
                $daysSinceConfirm = now()->diffInDays($price->confirmed_at);
                return $daysSinceConfirm >= self::WARNING_DAYS;
            });

        if ($expiringPrices->isEmpty()) {
            $this->info('No expiring prices found.');
            return Command::SUCCESS;
        }

        // Group by buyer
        $groupedByBuyer = $expiringPrices->map(function ($price) {
            return $price->grade->buyerCommodity->buyerProfile;
        })->filter()->unique('id');

        $this->info("Found {$expiringPrices->count()} prices expiring soon from {$groupedByBuyer->count()} buyers.");

        $sentCount = 0;
        $failedCount = 0;

        foreach ($groupedByBuyer as $buyerProfile) {
            $user = $buyerProfile->user;

            if (!$user || !$user->email) {
                continue;
            }

            // Get expiring prices for this buyer
            $buyerExpiringPrices = $expiringPrices->filter(function ($price) use ($buyerProfile) {
                return $price->grade->buyerCommodity->buyer_profile_id === $buyerProfile->id;
            });

            $staleCount = $buyerExpiringPrices->filter(function ($price) {
                $daysSinceConfirm = now()->diffInDays($price->confirmed_at);
                return $daysSinceConfirm >= 25 && $daysSinceConfirm <= 30;
            })->count();

            $expiredCount = $buyerExpiringPrices->filter(function ($price) {
                $daysSinceConfirm = now()->diffInDays($price->confirmed_at);
                return $daysSinceConfirm > 30;
            })->count();

            if ($isDryRun) {
                $this->line("  [DRY-RUN] Would notify: {$user->email}");
                $this->line("    - Stale prices (need confirmation): {$staleCount}");
                $this->line("    - Expired prices (>30 days): {$expiredCount}");
                $sentCount++;
            } else {
                try {
                    // Send email notification
                    Mail::to($user->email)->send(new PriceExpiryReminder($buyerProfile, $staleCount, $expiredCount));

                    $this->info("Notified: {$user->email}");
                    $this->line("  - Stale prices (need confirmation): {$staleCount}");
                    $this->line("  - Expired prices (>30 days): {$expiredCount}");

                    Log::info("Price expiry notification sent", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'stale_count' => $staleCount,
                        'expired_count' => $expiredCount,
                    ]);

                    $sentCount++;
                } catch (\Exception $e) {
                    $this->error("Failed to notify: {$user->email}");
                    $this->error("  Error: " . $e->getMessage());

                    Log::error("Price expiry notification failed", [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'error' => $e->getMessage(),
                    ]);

                    $failedCount++;
                }
            }
        }

        $this->info("Price expiry check completed. Sent: {$sentCount}, Failed: {$failedCount}");

        return $failedCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
