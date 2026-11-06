import { Head, usePage, Link } from '@inertiajs/react';
import { Scale, Check, X, AlertCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface SaleRequest {
    id: number;
    status: string;
    estimated_quantity: number;
    message: string | null;
    decline_reason?: string | null;
    created_at: string;
    farmer: {
        user: {
            name: string;
        };
    };
    commodity: {
        name: string;
    };
}

interface Transaction {
    id: number;
    status: string;
    quantity: number;
    transaction_date: string;
    notes: string | null;
    rejection_reason?: string | null;
    created_at: string;
    farmer: {
        user: {
            name: string;
        };
    };
    commodity: {
        name: string;
    };
}

interface PageProps {
    saleRequests: {
        data: SaleRequest[];
    };
    pendingTransactions: Transaction[];
    [key: string]: unknown; // Index signature for Inertia PageProps constraint
}

export default function SalesIndex() {
    const { saleRequests, pendingTransactions } = usePage<PageProps>().props;
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [customRejectReason, setCustomRejectReason] = useState('');
    const [decliningId, setDecliningId] = useState<number | null>(null);
    const [declineReason, setDeclineReason] = useState('');
    const [customDeclineReason, setCustomDeclineReason] = useState('');

    // Get the final reason (handles "Lainnya" case)
    const getFinalRejectReason = () => {
        if (rejectReason === 'Lainnya') {
            return customRejectReason;
        }
        return rejectReason;
    };

    const getFinalDeclineReason = () => {
        if (declineReason === 'Lainnya') {
            return customDeclineReason;
        }
        return declineReason;
    };

    const canSubmitReject = () => {
        if (rejectReason === 'Lainnya') {
            return customRejectReason.trim().length > 0;
        }
        return rejectReason.length > 0;
    };

    const canSubmitDecline = () => {
        if (declineReason === 'Lainnya') {
            return customDeclineReason.trim().length > 0;
        }
        return declineReason.length > 0;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getSaleRequestStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100 text-yellow-800', text: 'Menunggu', label: 'Menunggu' },
            accepted: { bg: 'bg-green-100 text-green-800', text: 'Diterima', label: 'Diterima' },
            declined: { bg: 'bg-red-100 text-red-800', text: 'Ditolak', label: 'Ditolak' },
            completed: { bg: 'bg-blue-100 text-blue-800', text: 'Selesai', label: 'Selesai' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const getTransactionStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100 text-yellow-800', text: 'Menunggu Konfirmasi', label: 'Menunggu Konfirmasi' },
            confirmed: { bg: 'bg-green-100 text-green-800', text: 'Dikonfirmasi', label: 'Dikonfirmasi' },
            rejected: { bg: 'bg-red-100 text-red-800', text: 'Ditolak', label: 'Ditolak' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    return (
        <>
            <Head title="Penjualan - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link href="/buyer/dashboard" className="text-sm text-muted-foreground hover:text-tani-green">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Manajemen Penjualan</h1>
                        <p className="text-muted-foreground">Kelola permintaan penjualan dan konfirmasi transaksi</p>
                    </div>

                    {/* Pending Transactions to Confirm */}
                    {pendingTransactions.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                <h2 className="text-lg font-semibold">
                                    Transaksi Menunggu Konfirmasi ({pendingTransactions.length})
                                </h2>
                            </div>

                            <div className="bg-white rounded-xl border dark:bg-zinc-800 overflow-hidden mb-8">
                                <div className="divide-y">
                                    {pendingTransactions.map((tx) => (
                                        <div key={tx.id} className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{tx.farmer.user.name}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {tx.commodity.name} • {tx.quantity} kg
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Tanggal transaksi: {formatDate(tx.transaction_date)}
                                                    </p>
                                                    {tx.notes && (
                                                        <p className="text-sm text-muted-foreground mt-2 italic">
                                                            "{tx.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                                        Konfirmasi Diperlukan
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <form action={`/buyer/transactions/${tx.id}/confirm`} method="post" className="flex-1">
                                                    <input type="hidden" name="_method" value="PUT" />
                                                    <button
                                                        type="submit"
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Konfirmasi
                                                    </button>
                                                </form>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectingId(tx.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Tolak
                                                </button>
                                            </div>

                                            {/* Rejection Modal */}
                                            {rejectingId === tx.id && (
                                                <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
                                                    <label className="block text-sm font-medium text-red-800 mb-2">
                                                        Alasan Penolakan (Wajib):
                                                    </label>
                                                    <select
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        className="w-full px-3 py-2 border border-red-300 rounded-lg mb-3 focus:ring-red-500 focus:border-red-500"
                                                        required
                                                    >
                                                        <option value="">Pilih alasan...</option>
                                                        <option value="Transaksi tidak pernah terjadi">Transaksi tidak pernah terjadi</option>
                                                        <option value="Data transaksi tidak sesuai">Data transaksi tidak sesuai</option>
                                                        <option value="Jumlah komoditas berbeda">Jumlah komoditas berbeda</option>
                                                        <option value="Komoditas tidak diterima">Komoditas tidak diterima</option>
                                                        <option value="Kesalahan pelaporan">Kesalahan pelaporan</option>
                                                        <option value="Tidak mengenali laporan tersebut">Tidak mengenali laporan tersebut</option>
                                                        <option value="Lainnya">Lainnya</option>
                                                    </select>
                                                    {rejectReason === 'Lainnya' && (
                                                        <textarea
                                                            placeholder="Jelaskan alasan lainnya..."
                                                            value={customRejectReason}
                                                            onChange={(e) => setCustomRejectReason(e.target.value)}
                                                            className="w-full px-3 py-2 border border-red-300 rounded-lg mb-3 focus:ring-red-500 focus:border-red-500"
                                                            rows={2}
                                                        />
                                                    )}
                                                    <div className="flex gap-2">
                                                        <form action={`/buyer/transactions/${tx.id}/reject`} method="post" className="flex-1">
                                                            <input type="hidden" name="_method" value="PUT" />
                                                            <input type="hidden" name="reason" value={getFinalRejectReason()} />
                                                            <button
                                                                type="submit"
                                                                disabled={!canSubmitReject()}
                                                                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Kirim Penolakan
                                                            </button>
                                                        </form>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setRejectingId(null); setRejectReason(''); setCustomRejectReason(''); }}
                                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Sale Requests */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-6 border-b">
                                <h2 className="font-semibold">Permintaan Penjualan</h2>
                                <p className="text-sm text-muted-foreground">Permintaan dari petani</p>
                            </div>
                            <div className="divide-y max-h-[500px] overflow-y-auto">
                                {saleRequests.data.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        Tidak ada permintaan penjualan
                                    </div>
                                ) : (
                                    saleRequests.data.map((sale) => (
                                        <div key={sale.id} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-medium">{sale.farmer.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {sale.commodity.name} - {sale.estimated_quantity} kg
                                                    </div>
                                                    {sale.message && (
                                                        <div className="mt-2 p-2 rounded bg-muted text-sm">
                                                            <MessageSquare className="w-3 h-3 inline mr-1" />
                                                            "{sale.message}"
                                                        </div>
                                                    )}
                                                    {sale.decline_reason && (
                                                        <div className="mt-2 p-2 rounded bg-red-50 text-red-700 text-sm">
                                                            Alasan penolakan: {sale.decline_reason}
                                                        </div>
                                                    )}
                                                </div>
                                                {getSaleRequestStatusBadge(sale.status)}
                                            </div>
                                            {sale.status === 'pending' && (
                                                <div className="mt-3">
                                                    <div className="flex gap-2">
                                                        <form action={`/buyer/sales/${sale.id}`} method="post" className="flex-1">
                                                            <input type="hidden" name="_method" value="PUT" />
                                                            <input type="hidden" name="status" value="accepted" />
                                                            <button
                                                                type="submit"
                                                                className="w-full px-3 py-1.5 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                                                            >
                                                                Terima
                                                            </button>
                                                        </form>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDecliningId(sale.id)}
                                                            className="flex-1 px-3 py-1.5 rounded text-sm border border-red-200 text-red-600 hover:bg-red-50"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>

                                                    {/* Decline Form */}
                                                    {decliningId === sale.id && (
                                                        <div className="mt-3 p-3 border border-red-200 rounded-lg bg-red-50">
                                                            <label className="block text-sm font-medium text-red-800 mb-2">
                                                                Alasan Penolakan (Wajib):
                                                            </label>
                                                            <select
                                                                value={declineReason}
                                                                onChange={(e) => setDeclineReason(e.target.value)}
                                                                className="w-full px-3 py-2 border border-red-300 rounded-lg mb-3 focus:ring-red-500 focus:border-red-500"
                                                                required
                                                            >
                                                                <option value="">Pilih alasan...</option>
                                                                <option value="Tidak menerima jenis komoditas ini">Tidak menerima jenis komoditas ini</option>
                                                                <option value="Kuota sudah penuh">Kuota sudah penuh</option>
                                                                <option value="Kualitas tidak sesuai standar">Kualitas tidak sesuai standar</option>
                                                                <option value="Harga tidak sesuai">Harga tidak sesuai</option>
                                                                <option value="Lainnya">Lainnya</option>
                                                            </select>
                                                            {declineReason === 'Lainnya' && (
                                                                <textarea
                                                                    placeholder="Jelaskan alasan lainnya..."
                                                                    value={customDeclineReason}
                                                                    onChange={(e) => setCustomDeclineReason(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-red-300 rounded-lg mb-3 focus:ring-red-500 focus:border-red-500"
                                                                    rows={2}
                                                                />
                                                            )}
                                                            <div className="flex gap-2">
                                                                <form action={`/buyer/sales/${sale.id}`} method="post" className="flex-1">
                                                                    <input type="hidden" name="_method" value="PUT" />
                                                                    <input type="hidden" name="status" value="declined" />
                                                                    <input type="hidden" name="decline_reason" value={getFinalDeclineReason()} />
                                                                    <button
                                                                        type="submit"
                                                                        disabled={!canSubmitDecline()}
                                                                        className="w-full px-3 py-1.5 rounded text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                                    >
                                                                        Kirim Penolakan
                                                                    </button>
                                                                </form>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setDecliningId(null); setDeclineReason(''); setCustomDeclineReason(''); }}
                                                                    className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Confirmed Transactions */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-6 border-b">
                                <h2 className="font-semibold">Riwayat Transaksi</h2>
                                <p className="text-sm text-muted-foreground">Transaksi yang sudah dikonfirmasi</p>
                            </div>
                            <div className="divide-y max-h-[500px] overflow-y-auto">
                                {pendingTransactions.filter(t => t.status !== 'pending').length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">
                                        Belum ada transaksi yang dikonfirmasi
                                    </div>
                                ) : (
                                    pendingTransactions
                                        .filter(t => t.status !== 'pending')
                                        .map((tx) => (
                                            <div key={tx.id} className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="font-medium">{tx.farmer.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {tx.commodity.name} - {tx.quantity} kg
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {formatDate(tx.transaction_date)}
                                                        </div>
                                                        {tx.rejection_reason && (
                                                            <div className="mt-2 p-2 rounded bg-red-50 text-red-700 text-sm">
                                                                Alasan penolakan: {tx.rejection_reason}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {getTransactionStatusBadge(tx.status)}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
