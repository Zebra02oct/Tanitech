import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf, Package, Clock, CheckCircle, Heart, Star, TrendingUp, Users } from 'lucide-react';

interface Transaction {
    id: number;
    status: string;
    quantity: number;
    created_at: string;
    buyer: {
        id: number;
        business_name: string;
    };
    commodity: {
        name: string;
        unit: string;
    };
    review?: {
        overall_rating: number;
    };
}

interface Stats {
    total_transactions: number;
    confirmed_transactions: number;
    pending_transactions: number;
    favorite_count: number;
    avg_rating: number | null;
}

interface PageProps {
    stats: Stats;
    recentTransactions: Transaction[];
    monthlyStats: { month: string; count: number }[];
    topBuyers: { name: string; count: number }[];
    auth: {
        user: {
            name: string;
        };
    };
}

// Simple Bar Chart Component
function SimpleBarChart({ data, color = '#22c55e' }: { data: { month: string; count: number }[]; color?: string }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                Tidak ada data
            </div>
        );
    }

    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="flex items-end gap-2 h-32">
            {data.map((item, index) => {
                const height = (item.count / max) * 100;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                            className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                            style={{
                                height: `${height}%`,
                                backgroundColor: index === data.length - 1 ? color : `${color}80`,
                                minHeight: item.count > 0 ? '8px' : '2px'
                            }}
                        />
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                    </div>
                );
            })}
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass
}: {
    title: string;
    value: number | string | null;
    subtitle?: string;
    icon: any;
    colorClass: string;
}) {
    return (
        <div className="bg-white rounded-xl border p-5 dark:bg-zinc-800 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{value ?? '-'}</div>
            <div className="text-sm text-muted-foreground mt-1">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground/70 mt-1">{subtitle}</div>}
        </div>
    );
}

export default function FarmerDashboard() {
    const { stats, recentTransactions, monthlyStats, topBuyers, auth } = usePage<PageProps>().props;

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Berhasil' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
            withdrawn: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Dibatalkan' },
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
            <Head title="Dashboard Petani - TANI TECH" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    Halo, {auth.user.name}
                                </span>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-muted-foreground hover:text-red-500"
                                >
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Dashboard Petani</h1>
                        <p className="text-muted-foreground">Selamat datang di TANI TECH</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Total Transaksi"
                            value={stats.total_transactions}
                            icon={Package}
                            colorClass="bg-blue-100 text-blue-600"
                        />
                        <StatCard
                            title="Transaksi Berhasil"
                            value={stats.confirmed_transactions}
                            subtitle={`${Math.round((stats.confirmed_transactions / (stats.total_transactions || 1)) * 100)}% dari total`}
                            icon={CheckCircle}
                            colorClass="bg-green-100 text-green-600"
                        />
                        <StatCard
                            title="Menunggu Konfirmasi"
                            value={stats.pending_transactions}
                            icon={Clock}
                            colorClass="bg-yellow-100 text-yellow-600"
                        />
                        <StatCard
                            title="Rating Rata-rata"
                            value={stats.avg_rating}
                            subtitle={stats.avg_rating ? 'Dari transaksi berhasil' : 'Belum ada rating'}
                            icon={Star}
                            colorClass="bg-yellow-100 text-yellow-600"
                        />
                    </div>

                    {/* Charts & Quick Actions */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        {/* Monthly Transactions Chart */}
                        <div className="lg:col-span-2 bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold">Statistik Transaksi (6 Bulan Terakhir)</h3>
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <SimpleBarChart data={monthlyStats} color="#16a34a" />
                        </div>

                        {/* Top Buyers */}
                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold">Top Pembeli</h3>
                                <Users className="w-5 h-5 text-muted-foreground" />
                            </div>
                            {topBuyers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Belum ada data
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topBuyers.map((buyer, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-tani-green/10 flex items-center justify-center text-tani-green font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium truncate max-w-[120px]">{buyer.name}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{buyer.count}x</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="font-semibold">Transaksi Terbaru</h2>
                            <Link href="/farmer/transactions" className="text-sm text-tani-green font-medium hover:underline">
                                Lihat semua
                            </Link>
                        </div>
                        <div className="divide-y">
                            {recentTransactions.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    Belum ada transaksi. Laporkan transaksi Anda setelah menjual komoditas.
                                </div>
                            ) : (
                                recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="p-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{transaction.buyer.business_name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {transaction.commodity.name} - {transaction.quantity} {transaction.commodity.unit}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(transaction.status)}
                                            {transaction.review && (
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-4 h-4 fill-yellow-400" />
                                                    <span className="text-sm">{transaction.review.overall_rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-8">
                        <Link
                            href="/buyers"
                            className="bg-tani-gradient text-white rounded-xl p-6 flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">Cari Pembeli</h3>
                                <p className="text-sm text-white/80">Temukan pembeli untuk komoditas Anda</p>
                            </div>
                            <Package className="w-8 h-8" />
                        </Link>
                        <Link
                            href="/farmer/favorites"
                            className="bg-white rounded-xl border p-6 flex items-center justify-between hover:border-tani-green transition-colors dark:bg-zinc-800"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">Favorit Saya</h3>
                                <p className="text-sm text-muted-foreground">
                                    {stats.favorite_count} pembeli tersimpan
                                </p>
                            </div>
                            <Heart className="w-8 h-8 text-muted-foreground" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
