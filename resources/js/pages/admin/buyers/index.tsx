import { Head, Link, usePage } from '@inertiajs/react';
import { Scale, Search, Filter, Shield, ShieldOff, AlertTriangle, CheckCircle, XCircle, Eye, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Buyer {
    id: number;
    business_name: string;
    phone: string;
    regency: string;
    verification_status: string;
    is_active: boolean;
    suspension_status: string;
    suspended_at: string | null;
    suspension_reason: string | null;
    verified_at: string | null;
    user: User;
    transactions_count: number;
    favorites_count: number;
}

interface Stats {
    total: number;
    active: number;
    suspended: number;
    pending_verification: number;
}

interface PageProps {
    buyers: {
        data: Buyer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    filters: {
        status?: string;
        verification_status?: string;
        search?: string;
    };
}

export default function AdminBuyersIndex() {
    const { buyers, stats, filters } = usePage<PageProps>().props;
    const [showSuspendModal, setShowSuspendModal] = useState<number | null>(null);
    const [suspendReason, setSuspendReason] = useState('');

    const getStatusBadge = (buyer: Buyer) => {
        if (buyer.suspension_status === 'suspended') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <ShieldOff className="w-3 h-3" />
                    Disuspenso
                </span>
            );
        }
        if (buyer.verification_status === 'pending') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3" />
                    Pending
                </span>
            );
        }
        if (buyer.verification_status === 'approved' && buyer.is_active) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <XCircle className="w-3 h-3" />
                Nonaktif
            </span>
        );
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Manajemen Buyer - Admin TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">Manajemen Buyer</h1>
                                    <p className="text-sm text-muted-foreground">Kelola dan suspenso buyer</p>
                                </div>
                            </div>
                            <Link
                                href="/admin/dashboard"
                                className="text-sm text-muted-foreground hover:text-tani-green"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-muted-foreground">Total Buyer</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                            <div className="text-sm text-muted-foreground">Aktif</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending_verification}</div>
                            <div className="text-sm text-muted-foreground">Pending</div>
                        </div>
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
                            <div className="text-sm text-muted-foreground">Disuspenso</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border p-4 mb-6 dark:bg-zinc-800">
                        <form action="/admin/buyers" method="get" className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari nama bisnis..."
                                    className="w-full px-4 py-2 rounded-lg border bg-background"
                                />
                            </div>
                            <select
                                name="status"
                                defaultValue={filters.status || ''}
                                className="px-4 py-2 rounded-lg border bg-background"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="suspended">Disuspenso</option>
                                <option value="pending">Pending Verifikasi</option>
                            </select>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Buyers Table */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Buyer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kontak</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaksi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bergabung</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {buyers.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada buyer yang ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        buyers.data.map((buyer) => (
                                            <tr key={buyer.id} className="hover:bg-muted/30">
                                                <td className="px-4 py-4">
                                                    <div className="font-medium">{buyer.business_name}</div>
                                                    <div className="text-sm text-muted-foreground">{buyer.user.name}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm">{buyer.phone}</div>
                                                    <div className="text-sm text-muted-foreground">{buyer.regency}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getStatusBadge(buyer)}
                                                    {buyer.suspension_reason && (
                                                        <div className="text-xs text-red-600 mt-1 max-w-[200px] truncate" title={buyer.suspension_reason}>
                                                            Alasan: {buyer.suspension_reason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm">{buyer.transactions_count} transaksi</div>
                                                    <div className="text-sm text-muted-foreground">{buyer.favorites_count} favorit</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-muted-foreground">
                                                    {formatDate(buyer.verified_at)}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/buyers/${buyer.id}`}
                                                            className="p-2 hover:bg-muted rounded-lg"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        {buyer.suspension_status !== 'suspended' ? (
                                                            <button
                                                                onClick={() => setShowSuspendModal(buyer.id)}
                                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                                                                title="Suspenso Buyer"
                                                            >
                                                                <ShieldOff className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <form action={`/admin/buyers/${buyer.id}/unsuspend`} method="post">
                                                                <input type="hidden" name="_token" />
                                                                <button
                                                                    type="submit"
                                                                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg"
                                                                    title="Aktifkan Kembali"
                                                                >
                                                                    <Shield className="w-4 h-4" />
                                                                </button>
                                                            </form>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {buyers.last_page > 1 && (
                            <div className="px-4 py-3 border-t flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {buyers.data.length} dari {buyers.total} buyer
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, buyers.last_page) }, (_, i) => {
                                        const page = buyers.current_page <= 3 ? i + 1 : buyers.current_page - 2 + i;
                                        if (page > buyers.last_page) return null;
                                        return (
                                            <Link
                                                key={page}
                                                href={`/admin/buyers?page=${page}`}
                                                className={`px-3 py-1 rounded-lg ${
                                                    page === buyers.current_page
                                                        ? 'bg-tani-green text-white'
                                                        : 'bg-muted hover:bg-muted/80'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Suspend Modal */}
            {showSuspendModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowSuspendModal(null)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-bold">Suspenso Buyer</h2>
                                <p className="text-sm text-muted-foreground">Berikan alasan untuk suspenso ini</p>
                            </div>
                            <form action={`/admin/buyers/${showSuspendModal}/suspend`} method="post" className="p-6 space-y-4">
                                <input type="hidden" name="_token" />
                                <div>
                                    <label className="block text-sm font-medium mb-2">Alasan Suspenso *</label>
                                    <select
                                        name="reason"
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                        required
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                    >
                                        <option value="">Pilih alasan...</option>
                                        <option value="Melanggar kebijakan">Melanggar kebijakan</option>
                                        <option value="Tidak aktif dalam waktu lama">Tidak aktif dalam waktu lama</option>
                                        <option value="Komplain dari petani">Komplain dari petani</option>
                                        <option value="Data tidak valid">Data tidak valid</option>
                                        <option value="Aktivitas mencurigakan">Aktivitas mencurigakan</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSuspendModal(null)}
                                        className="flex-1 px-4 py-2 rounded-lg border hover:bg-muted"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!suspendReason}
                                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Suspenso
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
