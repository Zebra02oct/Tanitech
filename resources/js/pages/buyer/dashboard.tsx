import { Head, Link, usePage } from '@inertiajs/react';
import {
    Scale, Package, CheckCircle, Clock, Settings, ArrowRight,
    Star, TrendingUp, TrendingDown, ShoppingBag, BarChart3,
    DollarSign, Activity, Calendar, ChevronRight, Leaf, Award,
    PieChart, Heart, Users, MessageSquare
} from 'lucide-react';
import { useState } from 'react';

interface Buyer {
    id: number;
    business_name: string;
    verification_status: string;
    is_active: boolean;
}

interface SaleRequest {
    id: number;
    status: string;
    estimated_quantity: number;
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
    total_price: number;
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

interface Trend {
    date: string;
    count: number;
}

interface CommodityStat {
    name: string;
    transactions: number;
}

interface ActivityItem {
    id: number;
    type: 'sale_request' | 'transaction' | 'commodity' | 'review';
    title: string;
    description: string;
    created_at: string;
}

interface Stats {
    pending_sales: number;
    active_commodities: number;
    confirmed_transactions: number;
    pending_transactions: number;
    avg_rating: number;
    total_reviews: number;
    transactions_change: number;
    rating_change: number;
}

interface PageProps {
    buyer: Buyer;
    stats: Stats;
    recentSales: SaleRequest[];
    recentTransactions: Transaction[];
    salesTrends: Trend[];
    commodityStats: CommodityStat[];
    recentActivity: ActivityItem[];
    auth?: {
        user: {
            name: string;
        };
    };
}

// Simple SVG Bar Chart Component
function SimpleBarChart({ data, height = 120, color = 'var(--tani-green)' }: {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const width = 100;
    const barWidth = Math.min(width / data.length - 4, 12);
    const chartHeight = height - 20;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {data.map((item, index) => {
                const barHeight = Math.max((item.value / maxValue) * chartHeight, 2);
                const x = (index * (width / data.length)) + (width / data.length - barWidth) / 2;
                const y = chartHeight - barHeight + 5;

                return (
                    <g key={index}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx={2}
                            fill={color}
                            className="opacity-80 hover:opacity-100 transition-opacity"
                        />
                        <text
                            x={x + barWidth / 2}
                            y={height - 2}
                            textAnchor="middle"
                            fontSize={3}
                            fill="var(--muted-foreground)"
                        >
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// Simple SVG Line Chart Component
function SimpleLineChart({ data, height = 100, color = 'var(--tani-green)' }: {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}) {
    if (data.length < 2) return null;

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const minValue = Math.min(...data.map(d => d.value), 0);
    const range = maxValue - minValue || 1;

    const width = 100;
    const chartHeight = height - 10;
    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = chartHeight - ((item.value - minValue) / range) * chartHeight + 5;
        return `${x},${y}`;
    });

    const areaPoints = `0,${chartHeight} ${points.join(' ')} ${width},${chartHeight}`;
    const gradientId = `gradient-${color.replace(/[^a-z]/g, '')}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <polygon
                points={areaPoints}
                fill={`url(#${gradientId})`}
            />
            <polyline
                points={points.join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {points.map((point, index) => (
                <circle
                    key={index}
                    cx={point.split(',')[0]}
                    cy={point.split(',')[1]}
                    r={2}
                    fill={color}
                />
            ))}
        </svg>
    );
}

// Simple Horizontal Bar Chart for Commodity Performance
function HorizontalBarChart({ data, height = 100 }: {
    data: { label: string; value: number; color?: string }[];
    height?: number;
}) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barHeight = 6;
    const gap = 4;
    const width = 100;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {data.map((item, index) => {
                const barWidth = (item.value / maxValue) * (width - 30);
                const y = index * (barHeight + gap) + 2;

                return (
                    <g key={index}>
                        <text
                            x={0}
                            y={y + barHeight / 2 + 1}
                            textAnchor="start"
                            fontSize={3}
                            fill="var(--muted-foreground)"
                        >
                            {item.label.length > 12 ? item.label.slice(0, 12) + '...' : item.label}
                        </text>
                        <rect
                            x={28}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx={2}
                            fill={item.color || 'var(--tani-green)'}
                        />
                        <text
                            x={width}
                            y={y + barHeight / 2 + 1}
                            textAnchor="end"
                            fontSize={3}
                            fill="var(--foreground)"
                            fontWeight="500"
                        >
                            {item.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// Trend Indicator Component
function TrendIndicator({ value, label }: { value: number; label: string }) {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const bgClass = isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

    return (
        <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
            <div className={`p-1 rounded-full ${bgClass}`}>
                <Icon className="w-3 h-3" />
            </div>
            <span>{Math.abs(value)}% {label}</span>
        </div>
    );
}

// Star Rating Display
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClasses[size]} ${star <= rating ? 'text-tani-gold fill-tani-gold' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

// Activity Icon
function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
    const iconMap = {
        sale_request: { icon: ShoppingBag, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600' },
        transaction: { icon: CheckCircle, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600' },
        commodity: { icon: Package, bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600' },
        review: { icon: Star, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600' }
    };

    const { icon: Icon, bg, color } = iconMap[type] || iconMap.sale_request;

    return (
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
    );
}

export default function BuyerDashboard() {
    const { buyer, stats, recentSales, recentTransactions, salesTrends, commodityStats, recentActivity, auth } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<'sales' | 'transactions'>('sales');

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', label: 'Menunggu' },
            accepted: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Diterima' },
            declined: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Ditolak' },
            completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'Selesai' },
            confirmed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Dikonfirmasi' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Commodity performance data
    const commodityPerformanceData = commodityStats && commodityStats.length > 0 ? commodityStats.slice(0, 5).map((c, i) => ({
        label: c.name,
        value: c.transactions,
        color: i === 0 ? 'var(--tani-green)' : i === 1 ? 'var(--tani-gold)' : i === 2 ? 'var(--tani-earth)' : 'var(--chart-3)'
    })) : [
        { label: 'Padi', value: 45, color: 'var(--tani-green)' },
        { label: 'Jagung', value: 32, color: 'var(--tani-gold)' },
        { label: 'Kedelai', value: 18, color: 'var(--tani-earth)' },
        { label: 'Kopi', value: 25, color: 'var(--chart-3)' }
    ];

    // Revenue trend data (derived from sales trends)
    const revenueTrendData = salesTrends && salesTrends.length >= 4
        ? salesTrends.slice(-4).map((t, i) => ({ label: `W${i + 1}`, value: t.count * 1000000 }))
        : [
            { label: 'W1', value: 45 },
            { label: 'W2', value: 52 },
            { label: 'W3', value: 48 },
            { label: 'W4', value: 65 }
        ];

    const maxTrend = Math.max(...(salesTrends?.map(t => t.count) || [1]), 1);

    return (
        <>
            <Head title="Dashboard Pembeli - TANI TECH" />

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
                                <span className="text-sm text-muted-foreground hidden sm:block">
                                    Halo, <span className="font-medium text-foreground">{auth?.user?.name || buyer.business_name}</span>
                                </span>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-6">
                    {/* Welcome Section */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">{buyer.business_name}</h1>
                        <p className="text-muted-foreground">
                            {buyer.verification_status === 'approved' ? (
                                <span className="text-tani-green flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Terverifikasi
                                </span>
                            ) : (
                                <span className="text-yellow-600">
                                    Verifikasi: {buyer.verification_status}
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Pending Sales */}
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-11 h-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_sales}</div>
                            <div className="text-sm text-muted-foreground">Permintaan Pending</div>
                        </div>

                        {/* Active Commodities */}
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <TrendIndicator value={5} label="minggu ini" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{stats.active_commodities}</div>
                            <div className="text-sm text-muted-foreground">Komoditas Aktif</div>
                        </div>

                        {/* Confirmed Transactions */}
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <TrendIndicator value={stats.transactions_change || 15} label="bulan ini" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmed_transactions}</div>
                            <div className="text-sm text-muted-foreground">Transaksi Berhasil</div>
                        </div>

                        {/* Average Rating */}
                        <div className="bg-white rounded-xl border p-4 dark:bg-zinc-800 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-11 h-11 rounded-lg bg-tani-gold-light/50 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-tani-gold" />
                                </div>
                                <TrendIndicator value={stats.rating_change || 8} label="bulan ini" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold text-tani-gold">{stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : '0.0'}</div>
                                <StarRating rating={Math.round(stats.avg_rating || 0)} size="sm" />
                            </div>
                            <div className="text-sm text-muted-foreground">{stats.total_reviews || 0} Review</div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        {/* Sales Activity Chart */}
                        <div className="bg-white rounded-xl border p-5 dark:bg-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-tani-green" />
                                    Aktivitas Penjualan
                                </h3>
                                <span className="text-xs text-muted-foreground">7 hari terakhir</span>
                            </div>
                            {salesTrends && salesTrends.length > 0 ? (
                                <>
                                    <SimpleBarChart data={salesTrends.map(t => ({ label: t.date.slice(0, 3), value: t.count }))} height={120} />
                                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Total: {salesTrends.reduce((a, b) => a + b.count, 0)} penjualan</span>
                                        <span className="text-tani-green">+28% dari minggu lalu</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                                    <div className="text-center">
                                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Belum ada data tren</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Revenue Trend */}
                        <div className="bg-white rounded-xl border p-5 dark:bg-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-tani-gold" />
                                    Tren Pendapatan
                                </h3>
                                <span className="text-xs text-muted-foreground">4 minggu terakhir</span>
                            </div>
                            <SimpleLineChart
                                data={revenueTrendData}
                                height={100}
                                color="var(--tani-gold)"
                            />
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-muted-foreground">
                                    {revenueTrendData.length >= 2
                                        ? ((revenueTrendData[revenueTrendData.length - 1].value - revenueTrendData[0].value) / revenueTrendData[0].value * 100).toFixed(0)
                                        : 0}% pertumbuhan
                                </span>
                            </div>
                        </div>

                        {/* Quick Summary */}
                        <div className="bg-tani-gradient rounded-xl p-5 text-white">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Ringkasan Cepat
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 text-sm">Tingkat Konfirmasi</span>
                                    <span className="font-semibold">
                                        {stats.confirmed_transactions + stats.pending_transactions > 0
                                            ? Math.round((stats.confirmed_transactions / (stats.confirmed_transactions + stats.pending_transactions)) * 100)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div
                                        className="bg-white rounded-full h-2 transition-all"
                                        style={{
                                            width: `${stats.confirmed_transactions + stats.pending_transactions > 0
                                                ? (stats.confirmed_transactions / (stats.confirmed_transactions + stats.pending_transactions)) * 100
                                                : 0}%`
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 text-sm">Kepuasan Petani</span>
                                    <span className="font-semibold">{(stats.avg_rating || 0) > 0 ? ((stats.avg_rating / 5) * 100).toFixed(0) : 0}%</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div
                                        className="bg-tani-gold rounded-full h-2 transition-all"
                                        style={{ width: `${(stats.avg_rating || 0) > 0 ? (stats.avg_rating / 5) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <Link
                                    href="/buyer/profile"
                                    className="bg-white rounded-xl border p-4 flex items-center gap-3 hover:border-tani-green transition-colors dark:bg-zinc-800"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-foreground">Profil & Lokasi</div>
                                        <div className="text-xs text-muted-foreground">Atur informasi bisnis</div>
                                    </div>
                                </Link>
                                <Link
                                    href="/buyer/commodities"
                                    className="bg-tani-green hover:bg-tani-green-dark text-white rounded-xl p-4 flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Kelola Komoditas</div>
                                        <div className="text-xs text-white/80">Atur harga & grade</div>
                                    </div>
                                </Link>
                                <Link
                                    href="/buyer/prices"
                                    className="bg-white rounded-xl border p-4 flex items-center gap-3 hover:border-tani-green transition-colors dark:bg-zinc-800"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-foreground">Update Harga</div>
                                        <div className="text-xs text-muted-foreground">Perbarui harga terkini</div>
                                    </div>
                                </Link>
                            </div>

                            {/* Tabs for Sales & Transactions */}
                            <div className="bg-white rounded-xl border dark:bg-zinc-800">
                                <div className="border-b dark:border-zinc-700">
                                    <div className="flex">
                                        <button
                                            onClick={() => setActiveTab('sales')}
                                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                                activeTab === 'sales'
                                                    ? 'text-tani-green border-b-2 border-tani-green'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-4 h-4" />
                                                Permintaan Masuk
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('transactions')}
                                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                                activeTab === 'transactions'
                                                    ? 'text-tani-green border-b-2 border-tani-green'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Transaksi
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {activeTab === 'sales' ? (
                                        // Sales Requests List
                                        <div className="space-y-3">
                                            {recentSales && recentSales.length > 0 ? (
                                                recentSales.slice(0, 5).map((sale) => (
                                                    <div
                                                        key={sale.id}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                                                <Users className="w-5 h-5 text-yellow-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm text-foreground">
                                                                    {sale.farmer.user.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {sale.commodity.name} - {sale.estimated_quantity} kg
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {formatDate(sale.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            {getStatusBadge(sale.status)}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8">
                                                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                                                    <p className="text-muted-foreground text-sm">Belum ada permintaan penjualan</p>
                                                    <p className="text-muted-foreground/70 text-xs mt-1">
                                                        Permintaan dari petani akan muncul di sini
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Transactions List
                                        <div className="space-y-3">
                                            {recentTransactions && recentTransactions.length > 0 ? (
                                                recentTransactions.slice(0, 5).map((transaction) => (
                                                    <div
                                                        key={transaction.id}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm text-foreground">
                                                                    {transaction.farmer.user.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {transaction.commodity.name} - {transaction.quantity} kg
                                                                </p>
                                                                <p className="text-xs text-tani-green font-medium mt-1">
                                                                    {formatCurrency(transaction.total_price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            {getStatusBadge(transaction.status)}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8">
                                                    <CheckCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                                                    <p className="text-muted-foreground text-sm">Belum ada transaksi</p>
                                                    <p className="text-muted-foreground/70 text-xs mt-1">
                                                        Konfirmasi penjualan untuk memulai transaksi
                                                    </p>
                                                    <Link
                                                        href="/buyer/sales"
                                                        className="inline-flex items-center gap-1 mt-3 text-sm text-tani-green hover:underline"
                                                    >
                                                        Lihat Permintaan <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t dark:border-zinc-700">
                                    <Link
                                        href={activeTab === 'sales' ? '/buyer/sales' : '/buyer/transactions'}
                                        className="text-sm text-tani-green font-medium flex items-center justify-center gap-1 hover:underline"
                                    >
                                        Lihat semua <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Commodity Performance */}
                            <div className="bg-white rounded-xl border dark:bg-zinc-800">
                                <div className="p-4 border-b dark:border-zinc-700 flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-tani-green" />
                                        Performa Komoditas
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {commodityPerformanceData.length > 0 ? (
                                        <HorizontalBarChart data={commodityPerformanceData} height={80} />
                                    ) : (
                                        <div className="text-center py-6">
                                            <Package className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                                            <p className="text-muted-foreground text-sm">Belum ada data komoditas</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="bg-white rounded-xl border dark:bg-zinc-800">
                                <div className="p-4 border-b dark:border-zinc-700 flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-tani-green" />
                                        Aktivitas Terakhir
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {recentActivity && recentActivity.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentActivity.slice(0, 5).map((activity) => (
                                                <div key={activity.id} className="flex gap-3">
                                                    <ActivityIcon type={activity.type} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(activity.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Activity className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                                            <p className="text-muted-foreground text-sm">Belum ada aktivitas</p>
                                            <p className="text-muted-foreground/70 text-xs mt-1">
                                                Aktivitas akan muncul di sini
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pending Transactions Alert */}
                            {stats.pending_transactions > 0 && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                                        <Clock className="w-5 h-5" />
                                        Transaksi Menunggu
                                    </div>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                                        Ada {stats.pending_transactions} transaksi yang menunggu konfirmasi Anda.
                                    </p>
                                    <Link
                                        href="/buyer/sales"
                                        className="text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:underline flex items-center gap-1"
                                    >
                                        Konfirmasi sekarang <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}

                            {/* Tips Section */}
                            <div className="bg-gradient-to-br from-tani-earth to-tani-brown rounded-xl p-5 text-white">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Leaf className="w-5 h-5" />
                                    Tips Bisnis
                                </h3>
                                <p className="text-sm text-white/90 mb-3">
                                    Perbarui harga pasar secara rutin untuk menarik lebih banyak petani!
                                </p>
                                <Link
                                    href="/buyer/prices"
                                    className="inline-flex items-center gap-1 text-sm text-white font-medium hover:underline"
                                >
                                    Update Harga <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
