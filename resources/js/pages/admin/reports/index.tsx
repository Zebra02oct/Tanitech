import { Head, Link, usePage } from '@inertiajs/react';
import { Scale, AlertTriangle, CheckCircle, Clock, XCircle, Eye, Filter } from 'lucide-react';

interface Report {
    id: number;
    type: string;
    type_label: string;
    status: string;
    status_label: string;
    description: string;
    admin_note: string | null;
    created_at: string;
    reporter: {
        user: {
            name: string;
        };
    };
    buyer: {
        id: number;
        user: {
            name: string;
        };
        business_name: string;
    } | null;
    transaction: {
        id: number;
    } | null;
}

interface PageProps {
    reports: {
        data: Report[];
        links: any;
    };
    stats: {
        total: number;
        pending: number;
        reviewing: number;
        resolved: number;
        dismissed: number;
    };
    filters: {
        status?: string;
        type?: string;
    };
}

export default function ReportsIndex() {
    const { reports, stats, filters } = usePage<PageProps>().props;

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
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg}`}>
                <Icon className="w-3 h-3" />
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
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statCards = [
        { label: 'Total', value: stats.total, icon: AlertTriangle, color: 'text-gray-600' },
        { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
        { label: 'Ditinjau', value: stats.reviewing, icon: Eye, color: 'text-blue-600' },
        { label: 'Selesai', value: stats.resolved, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Ditolak', value: stats.dismissed, icon: XCircle, color: 'text-gray-500' },
    ];

    return (
        <>
            <Head title="Laporan - Admin TANI TECH" />

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
                                <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-tani-green">
                                    Dashboard
                                </Link>
                                <Link href="/admin/verifications" className="text-sm text-muted-foreground hover:text-tani-green">
                                    Verifikasi
                                </Link>
                                <Link href="/admin/reports" className="text-sm font-medium text-tani-green">
                                    Laporan
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Manajemen Laporan</h1>
                        <p className="text-muted-foreground">Tinjau dan kelola laporan dari petani</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {statCards.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="bg-white rounded-xl border p-4 dark:bg-zinc-800">
                                    <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{stat.label}</span>
                                    </div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border p-4 mb-6 dark:bg-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Filter:</span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/admin/reports"
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                        !filters.status || filters.status === 'all'
                                            ? 'bg-tani-green text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    Semua
                                </Link>
                                <Link
                                    href="/admin/reports?status=pending"
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                        filters.status === 'pending'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    Menunggu ({stats.pending})
                                </Link>
                                <Link
                                    href="/admin/reports?status=reviewing"
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                        filters.status === 'reviewing'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    Ditinjau ({stats.reviewing})
                                </Link>
                                <Link
                                    href="/admin/reports?status=resolved"
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                        filters.status === 'resolved'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    Selesai
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800 overflow-hidden">
                        {reports.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Belum Ada Laporan</h3>
                                <p className="text-muted-foreground">
                                    Belum ada laporan dari petani saat ini.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {reports.data.map((report) => (
                                    <div key={report.id} className="p-6 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(report.type)}`}>
                                                        {report.type_label}
                                                    </span>
                                                    {getStatusBadge(report.status)}
                                                </div>
                                                <p className="text-sm text-foreground mb-3 line-clamp-2">
                                                    {report.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Dilaporkan oleh: {report.reporter.user.name}</span>
                                                    {report.buyer && (
                                                        <span>Buyer: {report.buyer.business_name}</span>
                                                    )}
                                                    <span>{formatDate(report.created_at)}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/reports/${report.id}`}
                                                className="ml-4 px-4 py-2 rounded-lg bg-tani-green text-white text-sm font-medium hover:bg-tani-green/90 transition-colors"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {reports.links && reports.data.length > 0 && (
                            <div className="p-4 border-t dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Menampilkan {reports.data.length} dari {reports.total || reports.data.length} laporan
                                    </span>
                                    <div className="flex gap-2">
                                        {reports.links.prev && (
                                            <Link
                                                href={reports.links.prev}
                                                className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted"
                                            >
                                                ←
                                            </Link>
                                        )}
                                        {reports.links.next && (
                                            <Link
                                                href={reports.links.next}
                                                className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted"
                                            >
                                                →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
