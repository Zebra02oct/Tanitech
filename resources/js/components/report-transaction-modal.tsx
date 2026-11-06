import { useState } from 'react';
import { X, Package, Calendar, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';

interface Commodity {
    id: number;
    name: string;
    unit: string;
}

interface Buyer {
    id: number;
    business_name: string;
}

interface ReportTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    commodities: Commodity[];
    recentBuyers?: Buyer[];
}

export default function ReportTransactionModal({
    isOpen,
    onClose,
    commodities,
    recentBuyers = [],
}: ReportTransactionModalProps) {
    const [buyerId, setBuyerId] = useState<string>('');
    const [commodityId, setCommodityId] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [transactionDate, setTransactionDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [notes, setNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!buyerId || !commodityId || !quantity) return;

        setIsSubmitting(true);
        setError(null);

        router.post(
            '/farmer/transactions',
            {
                buyer_id: buyerId,
                commodity_id: commodityId,
                quantity: quantity,
                transaction_date: transactionDate,
                notes: notes,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                    // Reset form
                    setBuyerId('');
                    setCommodityId('');
                    setQuantity('');
                    setTransactionDate(new Date().toISOString().split('T')[0]);
                    setNotes('');
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    const firstError = Object.values(errors)[0];
                    setError(typeof firstError === 'string' ? firstError : 'Terjadi kesalahan. Silakan coba lagi.');
                },
            }
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-lg font-bold">Laporkan Transaksi</h2>
                            <p className="text-sm text-muted-foreground">
                                Laporkan transaksi yang sudah Anda lakukan
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Buyer Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Pembeli *
                            </label>
                            {recentBuyers.length > 0 ? (
                                <select
                                    value={buyerId}
                                    onChange={(e) => setBuyerId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                    required
                                >
                                    <option value="">Pilih Pembeli</option>
                                    {recentBuyers.map((buyer) => (
                                        <option key={buyer.id} value={buyer.id}>
                                            {buyer.business_name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={buyerId}
                                    onChange={(e) => setBuyerId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                    placeholder="Nama pembeli"
                                    required
                                />
                            )}
                        </div>

                        {/* Commodity Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Komoditas *
                            </label>
                            <select
                                value={commodityId}
                                onChange={(e) => setCommodityId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                required
                            >
                                <option value="">Pilih Komoditas</option>
                                {commodities.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Jumlah *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background pr-12"
                                        placeholder="0"
                                        min="1"
                                        required
                                    />
                                    {commodities.find((c) => c.id.toString() === commodityId) && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                            {commodities.find((c) => c.id.toString() === commodityId)?.unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tanggal *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="date"
                                        value={transactionDate}
                                        onChange={(e) => setTransactionDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border bg-background resize-none"
                                rows={3}
                                placeholder="Tambahkan catatan tentang transaksi..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                <strong>Catatan:</strong> Transaksi akan menunggu konfirmasi dari pembeli sebelum dianggap terverifikasi.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={!buyerId || !commodityId || !quantity || isSubmitting}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="w-4 h-4 text-white" />
                                        Mengirim...
                                    </>
                                ) : (
                                    'Laporkan Transaksi'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
