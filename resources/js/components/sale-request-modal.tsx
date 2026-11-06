import { useState } from 'react';
import { X, MessageSquare, ArrowRight } from 'lucide-react';
import { router } from '@inertiajs/react';

interface GradeData {
    id: number;
    name: string;
}

interface CommodityData {
    id: number;
    name: string;
    unit: string;
}

interface BuyerCommodityData {
    commodity: CommodityData;
    grades: GradeData[];
}

interface BuyerData {
    id: number;
    business_name: string;
    phone: string;
    buyer_commodities: BuyerCommodityData[];
}

interface SaleRequestModalProps {
    buyer: BuyerData;
    isOpen: boolean;
    onClose: () => void;
}

export default function SaleRequestModal({ buyer, isOpen, onClose }: SaleRequestModalProps) {
    const [selectedCommodityId, setSelectedCommodityId] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const selectedBuyerCommodity = buyer.buyer_commodities.find(
        (bc) => bc.commodity.id.toString() === selectedCommodityId
    );

    const getWhatsAppUrl = () => {
        const commodity = selectedBuyerCommodity?.commodity.name || 'komoditas';
        const qty = quantity ? parseFloat(quantity).toLocaleString('id-ID') : '[jumlah]';
        const unit = selectedBuyerCommodity?.commodity.unit || 'kg';

        const phone = buyer.phone.replace(/[^0-9]/g, '');
        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

        let waMessage = `Halo, saya petani.\n\n`;
        waMessage += `Saya tertarik menjual:\n`;
        waMessage += `- Komoditas: ${commodity}\n`;
        waMessage += `- Jumlah: ${qty} ${unit}\n`;
        if (message) {
            waMessage += `- Catatan: ${message}\n`;
        }
        waMessage += `\nApakah Bapak/Ibu masih menerima?`;

        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waMessage)}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCommodityId || !quantity) return;

        setIsSubmitting(true);

        router.post(
            '/sale-request',
            {
                buyer_id: buyer.id,
                commodity_id: selectedCommodityId,
                estimated_quantity: quantity,
                message: message,
            },
            {
                onSuccess: () => {
                    // Open WhatsApp after successful submission
                    window.open(getWhatsAppUrl(), '_blank');
                    setIsSubmitting(false);
                    onClose();
                    // Reset form
                    setSelectedCommodityId('');
                    setQuantity('');
                    setMessage('');
                },
                onError: () => {
                    setIsSubmitting(false);
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
                            <h2 className="text-lg font-bold">Ajukan Penjualan</h2>
                            <p className="text-sm text-muted-foreground">
                                Kepada: {buyer.business_name}
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
                        {/* Commodity Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Komoditas *
                            </label>
                            <select
                                value={selectedCommodityId}
                                onChange={(e) => setSelectedCommodityId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                required
                            >
                                <option value="">Pilih Komoditas</option>
                                {buyer.buyer_commodities.map((bc) => (
                                    <option
                                        key={bc.commodity.id}
                                        value={bc.commodity.id}
                                    >
                                        {bc.commodity.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Perkiraan Jumlah *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background pr-16"
                                    placeholder="0"
                                    min="1"
                                    required
                                />
                                {selectedBuyerCommodity && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        {selectedBuyerCommodity.commodity.unit}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Pesan (Opsional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border bg-background resize-none"
                                rows={3}
                                placeholder="Tambahkan catatan untuk pembeli..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className="p-4 rounded-lg bg-tani-green/5 border border-tani-green/20">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-tani-green/10 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-4 h-4 text-tani-green" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-tani-green mb-1">Catatan</p>
                                    <p className="text-muted-foreground">
                                        Setelah提交, Anda akan diarahkan ke WhatsApp untuk berkomunikasi langsung dengan pembeli.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedCommodityId || !quantity || isSubmitting}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    'Mengirim...'
                                ) : (
                                    <>
                                        Hubungi via WhatsApp
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
