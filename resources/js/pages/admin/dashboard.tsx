import { Head, usePage, Link } from '@inertiajs/react';
import {
    Users,
    CheckCircle,
    Clock,
    AlertTriangle,
    Package,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    BarChart3,
    DollarSign,
    Leaf,
    Activity,
    Settings,
    UserPlus,
    FileText,
    Shield,
    ChevronRight
} from 'lucide-react';

interface Transaction {
    id: number;
    status: string;
    quantity: number;
    total_price: number;
    created_at: string;
    farmer: {
        user: {
            name: string;
        };
    };
    buyer: {
        business_name: string;
    };
    commodity: {
        name: string;
    };
}

interface BuyerProfile {
    id: number;
    business_name: string;
    verification_status: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface Stats {
    total_users: number;
    total_farmers: number;
    total_buyers: number;
    verified_buyers: number;
    pending_verifications: number;
    total_transactions: number;
    confirmed_transactions: number;
    pending_reports: number;
    total_commodities: number;
    user_growth?: number;
    transaction_growth?: number;
}

interface ActivityItem {
    id: number;
    type: 'user_registered' | 'transaction_confirmed' | 'verification' | 'report_submitted';
    message: string;
    time: string;
    created_at: string;
}

interface PageProps {
    stats: Stats;
    recentTransactions: Transaction[];
    pendingVerifications: BuyerProfile[];
    topCommodities?: { name: string; count: number }[];
    userGrowthData?: number[];
    transactionVolumeData?: number[];
    recentActivities?: ActivityItem[];
}

// Simple SVG Line Chart Component
function SimpleLineChart({ data, color = '#22c55e', height = 120, labels = [] }: {
    data: number[];
    color?: string;
    height?: number;
    labels?: string[];
}) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
                Tidak ada data
            </div>
        );
    }

    const width = 100;
    const padding = { top: 10, right: 10, bottom: 20, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
        const y = padding.top + chartHeight - ((value - min) / range) * chartHeight;
        return `${x},${y}`;
    });

    const pathD = points.length > 1 ? `M ${points.join(' L ')}` : `M ${points[0]} L ${points[0]}`;
    const areaD = `${pathD} L ${padding.left + chartWidth},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#gradient-${color.replace('#', '')})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point, index) => {
                const [x, y] = point.split(',').map(Number);
                return (
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="2"
                        fill={color}
                        className="opacity-80"
                    />
                );
            })}
        </svg>
    );
}

// Simple SVG Bar Chart Component
function SimpleBarChart({ data, color = '#22c55e', maxBars = 6 }: {
    data: { name: string; count: number }[];
    color?: string;
    maxBars?: number;
}) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
                Tidak ada data
            </div>
        );
    }

    const displayData = data.slice(0, maxBars);
    const max = Math.max(...displayData.map(d => d.count), 1);

    return (
        <div className="flex items-end gap-3 h-[120px]">
            {displayData.map((item, index) => {
                const height = (item.count / max) * 100;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                            className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                            style={{
                                height: `${height}%`,
                                backgroundColor: index === 0 ? color : `${color}99`
                            }}
                        />
                        <span className="text-xs text-muted-foreground truncate w-full text-center">
                            {item.name.length > 6 ? item.name.substring(0, 6) + '..' : item.name}
                        </span>
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
    trend,
    trendValue,
    colorClass
}: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    trendValue?: string;
    colorClass: string;
}) {
    return (
        <div className="bg-white rounded-xl border p-5 dark:bg-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && trendValue && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                        trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend === 'up' ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {trendValue}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{title}</div>
                {subtitle && (
                    <div className="text-xs text-muted-foreground/70 mt-1">{subtitle}</div>
                )}
            </div>
        </div>
    );
}

// Quick Action Card Component
function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
    colorClass
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    colorClass: string;
}) {
    return (
        <Link
            href={href}
            className="group bg-white rounded-xl border p-4 dark:bg-zinc-800 hover:shadow-md hover:border-tani-green/30 transition-all"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="font-medium text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-tani-green transition-colors" />
            </div>
        </Link>
    );
}

// Activity Timeline Item
function ActivityItem({ type, message, time }: {
    type: string;
    message: string;
    time: string;
}) {
    const getIcon = () => {
        switch (type) {
            case 'user_registered':
                return <UserPlus className="w-4 h-4 text-blue-600" />;
            case 'transaction_confirmed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'verification':
                return <Shield className="w-4 h-4 text-purple-600" />;
            case 'report_submitted':
                return <FileText className="w-4 h-4 text-orange-600" />;
            default:
                return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'user_registered':
                return 'bg-blue-100';
            case 'transaction_confirmed':
                return 'bg-green-100';
            case 'verification':
                return 'bg-purple-100';
            case 'report_submitted':
                return 'bg-orange-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="flex items-start gap-3 py-3">
            <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">{message}</p>
        </div>
    );
}

export default function AdminDashboard() {
    const {
        stats,
        recentTransactions,
        pendingVerifications,
        topCommodities = [],
        userGrowthData = [],
        transactionVolumeData = [],
        recentActivities = []
    } = usePage<PageProps>().props;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Format relative time
    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return formatDate(dateStr);
    };

    return (
        <>
            <Head title="Admin Dashboard - TANI TECH" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L12 22M12 2C9 5 7 9 7 12M12 2C15 5 17 9 17 12" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                                    <span className="ml-2 px-2 py-1 bg-tani-green/10 text-tani-green text-xs font-medium rounded">
                                        Admin
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-sm text-muted-foreground hover:text-tani-green transition-colors"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
                        <p className="text-muted-foreground mt-1">Selamat datang di panel administrasi TANI TECH</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Total Pengguna"
                            value={stats.total_users}
                            subtitle={`${stats.total_farmers || 0} petani, ${stats.total_buyers || 0} pembeli`}
                            icon={Users}
                            trend="up"
                            trendValue="+12%"
                            colorClass="bg-blue-100 text-blue-600"
                        />
                        <StatCard
                            title="Transaksi"
                            value={stats.total_transactions}
                            subtitle={`${stats.confirmed_transactions || 0} berhasil`}
                            icon={Package}
                            trend="up"
                            trendValue="+8%"
                            colorClass="bg-purple-100 text-purple-600"
                        />
                        <StatCard
                            title="Terverifikasi"
                            value={stats.verified_buyers}
                            subtitle={`${stats.pending_verifications || 0} menunggu`}
                            icon={CheckCircle}
                            colorClass="bg-green-100 text-green-600"
                        />
                        <StatCard
                            title="Menunggu"
                            value={stats.pending_verifications}
                            subtitle="Verifikasi baru"
                            icon={Clock}
                            trend={stats.pending_verifications > 0 ? 'down' : undefined}
                            trendValue={stats.pending_verifications > 0 ? 'Perlu review' : 'Semua clear'}
                            colorClass="bg-yellow-100 text-yellow-600"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <QuickActionCard
                                title="Verifikasi Pembeli"
                                description={`${stats.pending_verifications} menunggu`}
                                icon={Shield}
                                href="/admin/verifications"
                                colorClass="bg-yellow-100 text-yellow-600"
                            />
                            <QuickActionCard
                                title="Kelola Pengguna"
                                description="Lihat semua pengguna"
                                icon={Users}
                                href="/admin/users"
                                colorClass="bg-blue-100 text-blue-600"
                            />
                            <QuickActionCard
                                title="Laporan Transaksi"
                                description="Lihat laporan lengkap"
                                icon={FileText}
                                href="/admin/reports"
                                colorClass="bg-green-100 text-green-600"
                            />
                            <QuickActionCard
                                title="Pengaturan"
                                description="Konfigurasi sistem"
                                icon={Settings}
                                href="/admin/settings"
                                colorClass="bg-gray-100 text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {/* User Growth Chart */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-5 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-tani-green" />
                                        Pertumbuhan Pengguna
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">6 bulan terakhir</p>
                                </div>
                                {stats.user_growth !== undefined && (
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        +{stats.user_growth}%
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                {userGrowthData.length > 0 ? (
                                    <SimpleLineChart
                                        data={userGrowthData}
                                        color="#22c55e"
                                        height={140}
                                    />
                                ) : (
                                    <EmptyState message="Data pertumbuhan tidak tersedia" />
                                )}
                            </div>
                        </div>

                        {/* Transaction Volume Chart */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-5 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-tani-green" />
                                        Volume Transaksi
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">6 bulan terakhir</p>
                                </div>
                                {stats.transaction_growth !== undefined && (
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        +{stats.transaction_growth}%
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                {transactionVolumeData.length > 0 ? (
                                    <SimpleLineChart
                                        data={transactionVolumeData}
                                        color="#8b5cf6"
                                        height={140}
                                    />
                                ) : (
                                    <EmptyState message="Data transaksi tidak tersedia" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Commodities */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800 mb-8">
                        <div className="p-5 border-b flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-tani-green" />
                                    Komoditas Terpopuler
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">Berdasarkan jumlah transaksi</p>
                            </div>
                            <Link href="/admin/commodities" className="text-sm text-tani-green font-medium flex items-center gap-1 hover:gap-2 transition-all">
                                Lihat semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-5">
                            {topCommodities.length > 0 ? (
                                <SimpleBarChart
                                    data={topCommodities}
                                    color="#22c55e"
                                    maxBars={6}
                                />
                            ) : (
                                <EmptyState message="Belum ada data komoditas" />
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Pending Verifications */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-5 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-tani-green" />
                                        Verifikasi Pembeli
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {pendingVerifications.length > 0
                                            ? `${pendingVerifications.length} menunggu review`
                                            : 'Semua terverifikasi'}
                                    </p>
                                </div>
                                <Link href="/admin/verifications" className="text-sm text-tani-green font-medium flex items-center gap-1 hover:gap-2 transition-all">
                                    Lihat semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="divide-y max-h-[320px] overflow-y-auto">
                                {pendingVerifications.length === 0 ? (
                                    <div className="p-6">
                                        <EmptyState message="Tidak ada yang menunggu verifikasi" />
                                    </div>
                                ) : (
                                    pendingVerifications.map((buyer) => (
                                        <div key={buyer.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-yellow-700">
                                                        {buyer.business_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{buyer.business_name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {buyer.user.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/verifications/${buyer.id}`}
                                                className="px-4 py-2 rounded-lg bg-tani-green text-white text-sm font-medium hover:bg-tani-green/90 transition-colors"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-5 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-tani-green" />
                                        Transaksi Terbaru
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {recentTransactions.length > 0
                                            ? `${recentTransactions.length} transaksi terbaru`
                                            : 'Belum ada transaksi'}
                                    </p>
                                </div>
                                <Link href="/admin/transactions" className="text-sm text-tani-green font-medium flex items-center gap-1 hover:gap-2 transition-all">
                                    Lihat semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="divide-y max-h-[320px] overflow-y-auto">
                                {recentTransactions.length === 0 ? (
                                    <div className="p-6">
                                        <EmptyState message="Belum ada transaksi" />
                                    </div>
                                ) : (
                                    recentTransactions.map((tx) => (
                                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div>
                                                <div className="font-medium">{tx.buyer.business_name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {tx.farmer.user.name} - {tx.commodity.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground/70 mt-1">
                                                    {formatDate(tx.created_at)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    tx.status === 'reported' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {tx.status === 'confirmed' ? 'Berhasil' :
                                                     tx.status === 'pending' ? 'Menunggu' :
                                                     tx.status === 'reported' ? 'Dilaporkan' : tx.status}
                                                </span>
                                                {tx.total_price && (
                                                    <div className="text-sm font-medium text-tani-green mt-1">
                                                        {formatCurrency(tx.total_price)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    {recentActivities.length > 0 && (
                        <div className="mt-8 bg-white rounded-xl border dark:bg-zinc-800">
                            <div className="p-5 border-b">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-tani-green" />
                                    Aktivitas Terbaru
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">Aktivitas sistem dan pengguna</p>
                            </div>
                            <div className="p-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {recentActivities.slice(0, 6).map((activity) => (
                                        <ActivityItem
                                            key={activity.id}
                                            type={activity.type}
                                            message={activity.message}
                                            time={formatRelativeTime(activity.created_at)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        <p>TANI TECH Admin Panel - © 2024</p>
                    </div>
                </div>
            </div>
        </>
    );
}
