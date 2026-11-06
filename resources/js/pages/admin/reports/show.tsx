import { Head, Link, usePage } from '@inertiajs/react';
import { Scale, AlertTriangle, CheckCircle, Clock, XCircle, Eye, ArrowLeft, User, Store, Receipt } from 'lucide-react';
import { useState } from 'react';

interface Report {
    id: number;
    type: string;
    type_label: string;
    status: string;
    status_label: string;
    description: string;
    admin_note: string | null;
    resolved_at: string | null;
    created_at: string;
    reporter: {
        id: number;
        user: {
            name: string;
            email: string;
        };
    };
    buyer: {
        id: number;
        user: {
            name: string;
            email: string;
        };
        business_name: string;
        phone: string;
    } | null;
    transaction: {
        id: number;
        quantity: number;
        transaction_date: string;
        status: string;
        farmer: {
            user: {
                name: string;
            };
        };
        commodity: {
            name: string;
        };
    } | null;
}

interface PageProps {
    report: Report;
}

export default function ReportShow() {
    const { report } = usePage<PageProps>().props;
    const [adminNote, setAdminNote] = useState(report.admin_note || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            pending: { bg: 'bg-yellow-100 text-yellow-800', text: 'Menunggu', icon: Clock },
            reviewing: { bg: 'bg-blue-100 text-blue-800', text: 'Sedang Ditinjau', icon: Eye },
            resolved: { bg: 'bg-green-100 text-green-800', text: 'Selesai', icon: CheckCircle },
            dismissed: { bg: 'bg-gray-100 text-gray-600', text: 'Ditolak', icon: XCircle },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg}`}>
                <Icon className="w-4 h-4" />
                {badge.text}
            </span>
        );
    };

    const getTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            false_information: 'bg-red-100 text-red-800',
            transaction_dispute: 'bg-orange-100 text-orange-800',
            price_issue: 'bg-purple-100 text-purple-800',
            fraud_suspected: 'bg-red-100 text-red-800',
            inappropriate_behavior: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-600',
        };
        return colors[type] || colors.other;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setIsSubmitting(true);
        // Form will be submitted via standard POST
    };

    return (
        <>
            <Head title={`Laporan #${report.id} - Admin TANI TECH`} />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link href="/admin/reports" className="text-sm text-muted-foreground hover:text-tani-green flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(report.type)}`}>
                                {report.type_label}
                            </span>
                            {getStatusBadge(report.status)}
                        </div>
                        <h1 className="text-2xl font-bold">Laporan #{report.id}</h1>
                        <p className="text-muted-foreground">Dilaporkan pada {formatDate(report.created_at)}</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Report Description */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h2 className="font-semibold mb-4">Deskripsi Laporan</h2>
                                <p className="text-foreground whitespace-pre-wrap">{report.description}</p>
                            </div>

                            {/* Reporter Info */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-muted-foreground" />
                                    Pelapor
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nama</span>
                                        <span className="font-medium">{report.reporter.user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Email</span>
                                        <span className="font-medium">{report.reporter.user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Buyer Info */}
                            {report.buyer && (
                                <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                                        <Store className="w-5 h-5 text-muted-foreground" />
                                        Buyer yang Dilaporkan
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Nama Bisnis</span>
                                            <span className="font-medium">{report.buyer.business_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Pemilik</span>
                                            <span className="font-medium">{report.buyer.user.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Telepon</span>
                                            <span className="font-medium">{report.buyer.phone}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={`/buyers/${report.buyer.id}`}
                                            target="_blank"
                                            className="text-sm text-tani-green hover:underline"
                                        >
                                            Lihat Profil Buyer →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Info */}
                            {report.transaction && (
                                <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                                        <Receipt className="w-5 h-5 text-muted-foreground" />
                                        Transaksi Terkait
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ID Transaksi</span>
                                            <span className="font-medium">#{report.transaction.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Komoditas</span>
                                            <span className="font-medium">{report.transaction.commodity.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Jumlah</span>
                                            <span className="font-medium">{report.transaction.quantity} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tanggal</span>
                                            <span className="font-medium">{formatDate(report.transaction.transaction_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={`font-medium ${
                                                report.transaction.status === 'confirmed' ? 'text-green-600' :
                                                report.transaction.status === 'rejected' ? 'text-red-600' :
                                                'text-yellow-600'
                                            }`}>
                                                {report.transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Actions */}
                        <div className="space-y-6">
                            {/* Status Update */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h2 className="font-semibold mb-4">Update Status</h2>
                                <form action={`/admin/reports/${report.id}`} method="post">
                                    <input type="hidden" name="_method" value="PUT" />
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Status Baru</label>
                                            <select name="status" className="w-full px-3 py-2 rounded-lg border bg-background">
                                                <option value="pending" selected={report.status === 'pending'}>
                                                    Menunggu
                                                </option>
                                                <option value="reviewing" selected={report.status === 'reviewing'}>
                                                    Sedang Ditinjau
                                                </option>
                                                <option value="resolved" selected={report.status === 'resolved'}>
                                                    Selesai
                                                </option>
                                                <option value="dismissed" selected={report.status === 'dismissed'}>
                                                    Ditolak
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Catatan Admin</label>
                                            <textarea
                                                name="admin_note"
                                                value={adminNote}
                                                onChange={(e) => setAdminNote(e.target.value)}
                                                placeholder="Tambahkan catatan tentang penanganan laporan ini..."
                                                className="w-full px-3 py-2 rounded-lg border bg-background resize-none"
                                                rows={4}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Quick Actions */}
                            {report.buyer && (
                                <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <h2 className="font-semibold mb-4">Aksi Cepat</h2>
                                    <div className="space-y-2">
                                        <Link
                                            href={`/admin/verifications?buyer=${report.buyer.id}`}
                                            className="block w-full px-4 py-2 text-center rounded-lg border hover:bg-muted transition-colors text-sm"
                                        >
                                            Lihat Verifikasi Buyer
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Yakin ingin menonaktifkan buyer ini?')) {
                                                    // TODO: Implement buyer suspension
                                                    alert('Fitur belum tersedia');
                                                }
                                            }}
                                            className="block w-full px-4 py-2 text-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm"
                                        >
                                            Nonaktifkan Buyer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
