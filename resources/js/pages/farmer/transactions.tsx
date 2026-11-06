import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Leaf, Plus, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import ReportTransactionModal from '@/components/report-transaction-modal';

interface Commodity {
    id: number;
    name: string;
    unit: string;
}

interface Buyer {
    id: number;
    business_name: string;
}

interface Review {
    id: number;
    overall_rating: number;
    comment: string | null;
}

interface Transaction {
    id: number;
    status: string;
    quantity: number;
    transaction_date: string;
    created_at: string;
    notes: string | null;
    buyer: Buyer;
    commodity: Commodity;
    review?: Review;
}

interface PageProps {
    transactions: {
        data: Transaction[];
    };
    commodities: Commodity[];
    recentBuyers: Buyer[];
}

export default function Transactions() {
    const { transactions, commodities, recentBuyers } = usePage<PageProps>().props;
    const [showReportModal, setShowReportModal] = useState(false);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string; icon: any }> = {
            pending: { bg: 'bg-yellow-100 text-yellow-800', text: 'Menunggu', icon: Clock },
            confirmed: { bg: 'bg-green-100 text-green-800', text: 'Dikonfirmasi', icon: CheckCircle },
            rejected: { bg: 'bg-red-100 text-red-800', text: 'Ditolak', icon: XCircle },
            withdrawn: { bg: 'bg-gray-100 text-gray-600', text: 'Dibatalkan', icon: AlertCircle },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.bg}`}>
                <Icon className="w-3.5 h-3.5" />
                {badge.label}
            </span>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Transaksi - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link href="/farmer/dashboard" className="text-sm text-muted-foreground hover:text-tani-green">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Transaksi Saya</h1>
                            <p className="text-muted-foreground">Riwayat transaksi Anda dengan pembeli</p>
                        </div>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Laporkan Transaksi
                        </button>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold">{transactions.data.length}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-yellow-600">
                                {transactions.data.filter(t => t.status === 'pending').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Menunggu</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-green-600">
                                {transactions.data.filter(t => t.status === 'confirmed').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Dikonfirmasi</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-red-600">
                                {transactions.data.filter(t => t.status === 'rejected').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Ditolak</div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800 overflow-hidden">
                        {transactions.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                    <Leaf className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground mb-4">Belum ada transaksi.</p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Setelah menjual komoditas, laporkan transaksi Anda di sini.
                                </p>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Laporkan Transaksi Pertama
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {transactions.data.map((transaction) => (
                                    <div key={transaction.id} className="p-6 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{transaction.buyer.business_name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {transaction.commodity.name} • {transaction.quantity} {transaction.commodity.unit}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Tanggal: {formatDate(transaction.transaction_date)}
                                                </p>
                                                {transaction.notes && (
                                                    <p className="text-sm text-muted-foreground mt-2 italic">
                                                        "{transaction.notes}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {getStatusBadge(transaction.status)}
                                                {transaction.status === 'pending' && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Menunggu konfirmasi pembeli
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Review Section */}
                                        {transaction.status === 'confirmed' && transaction.review && (
                                            <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium text-green-800">Rating Anda:</span>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-lg ${
                                                                    i < transaction.review!.overall_rating
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {transaction.review.comment && (
                                                    <p className="text-sm text-green-700">
                                                        "{transaction.review.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {transaction.status === 'confirmed' && !transaction.review && (
                                            <div className="mt-4">
                                                <Link
                                                    href={`/farmer/reviews/${transaction.id}/create`}
                                                    className="text-sm text-tani-green font-medium hover:underline"
                                                >
                                                    Beri rating & review →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Transaction Modal */}
            <ReportTransactionModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                commodities={commodities}
                recentBuyers={recentBuyers}
            />
        </>
    );
}
