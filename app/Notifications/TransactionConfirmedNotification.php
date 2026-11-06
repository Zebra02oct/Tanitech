<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Transaction;

class TransactionConfirmedNotification extends Notification
{
    use Queueable;

    protected Transaction $transaction;

    /**
     * Create a new notification instance.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // For MVP: database only, email can be added later
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $farmerName = $this->transaction->farmer->user->name ?? 'Petani';
        $commodityName = $this->transaction->commodity->name ?? 'Komoditas';
        $quantity = $this->transaction->quantity;

        return (new MailMessage)
            ->subject('Transaksi Dikonfirmasi - TANI TECH')
            ->greeting("Halo {$notifiable->name},")
            ->line("Transaksi dengan {$farmerName} telah dikonfirmasi.")
            ->line("Komoditas: {$commodityName}")
            ->line("Jumlah: {$quantity} kg")
            ->action('Lihat Detail', url('/buyer/sales'))
            ->line('Terima kasih telah menggunakan TANI TECH!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        $farmerName = $this->transaction->farmer->user->name ?? 'petani';
        return [
            'type' => 'transaction_confirmed',
            'title' => 'Transaksi Dikonfirmasi',
            'message' => "Transaksi dengan {$farmerName} telah dikonfirmasi.",
            'transaction_id' => $this->transaction->id,
            'farmer_id' => $this->transaction->farmer_id,
            'buyer_id' => $this->transaction->buyer_id,
            'data' => [
                'commodity_name' => $this->transaction->commodity->name ?? null,
                'quantity' => $this->transaction->quantity,
                'confirmed_at' => $this->transaction->confirmed_at?->toIso8601String(),
            ],
        ];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
