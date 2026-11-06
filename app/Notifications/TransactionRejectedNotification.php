<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Transaction;

class TransactionRejectedNotification extends Notification
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
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $farmerName = $this->transaction->farmer->user->name ?? 'Petani';
        $commodityName = $this->transaction->commodity->name ?? 'Komoditas';
        $reason = $this->transaction->rejection_reason ?? 'Tidak ada alasan';

        return (new MailMessage)
            ->subject('Transaksi Ditolak - TANI TECH')
            ->greeting("Halo {$notifiable->name},")
            ->line("Transaksi dengan {$farmerName} telah ditolak.")
            ->line("Komoditas: {$commodityName}")
            ->line("Jumlah: {$this->transaction->quantity} kg")
            ->line("Alasan: {$reason}")
            ->action('Lihat Detail', url('/farmer/transactions'))
            ->line('Terima kasih telah menggunakan TANI TECH!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'transaction_rejected',
            'title' => 'Transaksi Ditolak',
            'message' => "Transaksi ditolak. Alasan: {$this->transaction->rejection_reason}",
            'transaction_id' => $this->transaction->id,
            'farmer_id' => $this->transaction->farmer_id,
            'buyer_id' => $this->transaction->buyer_id,
            'data' => [
                'commodity_name' => $this->transaction->commodity->name ?? null,
                'quantity' => $this->transaction->quantity,
                'rejection_reason' => $this->transaction->rejection_reason,
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
