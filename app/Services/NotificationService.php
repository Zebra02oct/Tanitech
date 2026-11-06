<?php

namespace App\Services;

use App\Models\User;
use App\Models\Transaction;
use App\Models\SaleRequest;
use App\Notifications\TransactionConfirmedNotification;
use App\Notifications\TransactionRejectedNotification;
use App\Notifications\SaleRequestAcceptedNotification;
use App\Notifications\SaleRequestDeclinedNotification;

class NotificationService
{
    /**
     * Send transaction confirmed notification to farmer.
     */
    public function notifyTransactionConfirmed(Transaction $transaction): void
    {
        $farmer = $transaction->farmer;
        if ($farmer && $farmer->user) {
            $farmer->user->notify(new TransactionConfirmedNotification($transaction));
        }
    }

    /**
     * Send transaction rejected notification to farmer.
     */
    public function notifyTransactionRejected(Transaction $transaction): void
    {
        $farmer = $transaction->farmer;
        if ($farmer && $farmer->user) {
            $farmer->user->notify(new TransactionRejectedNotification($transaction));
        }
    }

    /**
     * Send sale request accepted notification to farmer.
     */
    public function notifySaleRequestAccepted(SaleRequest $saleRequest): void
    {
        $farmer = $saleRequest->farmer;
        if ($farmer && $farmer->user) {
            $farmer->user->notify(new SaleRequestAcceptedNotification($saleRequest));
        }
    }

    /**
     * Send sale request declined notification to farmer.
     */
    public function notifySaleRequestDeclined(SaleRequest $saleRequest): void
    {
        $farmer = $saleRequest->farmer;
        if ($farmer && $farmer->user) {
            $farmer->user->notify(new SaleRequestDeclinedNotification($saleRequest));
        }
    }

    /**
     * Send custom notification to a user.
     */
    public function sendToUser(User $user, string $title, string $message, array $data = []): void
    {
        $user->notify(new CustomNotification($title, $message, $data));
    }

    /**
     * Send notification to multiple users.
     */
    public function sendToUsers(array $users, string $title, string $message, array $data = []): void
    {
        foreach ($users as $user) {
            $this->sendToUser($user, $title, $message, $data);
        }
    }
}
