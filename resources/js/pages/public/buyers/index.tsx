import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Check, ArrowRight, SlidersHorizontal, Star } from 'lucide-react';

// Type definitions
interface Commodity {
    id: number;
    name: string;
    slug: string;
}

interface Grade {
    id: number;
    name: string;
    latest_price: {
        price: number;
        unit: string;
        confirmed_at: string;
    } | null;
}

interface BuyerCommodity {
    commodity: Commodity;
    grades: Grade[];
}

interface Service {
    pickup_available: boolean;
    weighing_available: boolean;
}

interface Buyer {
    id: number;
    business_name: string;
    phone: string;
    village: string;
    district: string;
    regency: string;
    province: string;
    verification_status: string;
    is_active: boolean;
    buyer_commodities: BuyerCommodity[];
    service: Service | null;
    average_rating?: number;
    total_reviews?: number;
}

interface Filters {
    commodity?: string;
    regency?: string;
    district?: string;
    sort?: string;
    direction?: string;
    verified_only?: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface PageProps {
    buyers: {
        data: Buyer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    commodities: Commodity[];
    filters: Filters;
    auth: {
        user: AuthUser | null;
    };
    [key: string]: unknown; // Index signature for Inertia PageProps constraint
}

// Sorting options based on LAPORAN-TEKNIS.md Section 4.7
const SORT_OPTIONS = [
    { value: 'created_at', label: 'Terbaru' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'price_low', label: 'Harga Terendah' },
    { value: 'price_high', label: 'Harga Tertinggi' },
    { value: 'pickup', label: 'Layanan Pickup' },
    { value: 'recent', label: 'Harga Terbaru Diperbarui' },
    { value: 'verified', label: 'Terverifikasi' },
];

export default function BuyersIndex() {
    const { buyers, commodities, filters, auth } = usePage<PageProps>().props;
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const formatPrice = (price: number, unit: string) => {
        return `Rp ${price.toLocaleString('id-ID')}/${unit}`;
    };

    const getLowestPrice = (buyer: Buyer): { price: number; unit: string } | null => {
        let lowest: { price: number; unit: string } | null = null;
        buyer.buyer_commodities.forEach((bc) => {
            bc.grades.forEach((grade) => {
                if (grade.latest_price && (!lowest || grade.latest_price.price < lowest.price)) {
                    lowest = grade.latest_price;
                }
            });
        });
        return lowest;
    };

    return (
        <>
            <Head title="Cari Pembeli - TANI TECH" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-zinc-900/80">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L12 22M12 2C9 5 7 9 7 12M12 2C15 5 17 9 17 12" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <nav className="flex items-center gap-4">
                                <Link href="/buyers" className="text-sm font-medium text-tani-green">
                                    Cari Pembeli
                                </Link>
                                {auth.user ? (
                                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-tani-green">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-tani-green">
                                            Masuk
                                        </Link>
                                        <Link href="/register" className="inline-flex items-center justify-center rounded-lg bg-tani-green px-4 py-2 text-sm font-medium text-white hover:bg-tani-green/90">
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Search & Filter Bar */}
                <div className="bg-white border-b dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-6">
                        {/* Main Search Row */}
                        <form action="/buyers" method="get" className="flex flex-col lg:flex-row gap-4 mb-4">
                            <select
                                name="commodity"
                                defaultValue={filters.commodity || ''}
                                className="flex-1 lg:flex-none lg:w-48 px-4 py-2.5 rounded-lg border bg-background text-sm"
                            >
                                <option value="">Semua Komoditas</option>
                                {commodities.map((c) => (
                                    <option key={c.id} value={c.slug}>{c.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="regency"
                                placeholder="Kabupaten/Kota..."
                                defaultValue={filters.regency || ''}
                                className="flex-1 lg:flex-none lg:w-64 px-4 py-2.5 rounded-lg border bg-background text-sm"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors text-sm"
                            >
                                Cari
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="px-4 py-2.5 rounded-lg border bg-background hover:bg-muted transition-colors text-sm flex items-center gap-2"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter
                            </button>
                        </form>

                        {/* Advanced Filters Row */}
                        {showAdvancedFilters && (
                            <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-muted/50 rounded-lg mt-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Urutkan:</label>
                                    <select
                                        name="sort"
                                        defaultValue={filters.sort || 'created_at'}
                                        className="px-3 py-2 rounded-lg border bg-background text-sm"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="verified_only"
                                        value="1"
                                        defaultChecked={filters.verified_only === '1'}
                                        className="w-4 h-4 rounded border-gray-300 text-tani-green focus:ring-tani-green"
                                    />
                                    <span className="text-sm">Hanya terverifikasi</span>
                                </label>

                                {(filters.sort || filters.verified_only === '1') && (
                                    <Link
                                        href="/buyers"
                                        className="text-sm text-tani-green hover:underline ml-auto"
                                    >
                                        Reset filter
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Active Filters Display */}
                        {(filters.sort || filters.commodity || filters.regency || filters.verified_only) && (
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {filters.sort && (
                                    <span className="px-2 py-1 bg-tani-green/10 text-tani-green text-xs rounded-full flex items-center gap-1">
                                        Urutan: {SORT_OPTIONS.find(o => o.value === filters.sort)?.label || filters.sort}
                                    </span>
                                )}
                                {filters.commodity && (
                                    <span className="px-2 py-1 bg-tani-green/10 text-tani-green text-xs rounded-full">
                                        {commodities.find(c => c.slug === filters.commodity)?.name || filters.commodity}
                                    </span>
                                )}
                                {filters.regency && (
                                    <span className="px-2 py-1 bg-tani-green/10 text-tani-green text-xs rounded-full">
                                        {filters.regency}
                                    </span>
                                )}
                                {filters.verified_only === '1' && (
                                    <span className="px-2 py-1 bg-tani-green/10 text-tani-green text-xs rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Terverifikasi
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">
                            {buyers.total} Pembeli Ditemukan
                        </h1>
                    </div>

                    {buyers.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">Belum ada pembeli yang sesuai dengan kriteria Anda.</p>
                            <Link href="/buyers" className="text-tani-green font-medium hover:underline">
                                Lihat semua pembeli
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {buyers.data.map((buyer) => {
                                const lowestPrice = getLowestPrice(buyer);
                                return (
                                    <Link
                                        key={buyer.id}
                                        href={`/buyers/${buyer.id}`}
                                        className="group block bg-white rounded-xl border hover:shadow-lg hover:border-tani-green/50 transition-all dark:bg-zinc-800"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg group-hover:text-tani-green transition-colors">
                                                        {buyer.business_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{buyer.regency || buyer.district || buyer.village}</span>
                                                    </div>
                                                </div>
                                                {buyer.verification_status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tani-green/10 text-tani-green text-xs font-medium">
                                                        <Check className="w-3 h-3" />
                                                        Terverifikasi
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="text-sm text-muted-foreground">
                                                    {buyer.buyer_commodities.map((bc) => bc.commodity.name).join(', ')}
                                                </div>
                                                {lowestPrice && (
                                                    <div className="text-tani-green font-bold">
                                                        {formatPrice(lowestPrice.price, lowestPrice.unit)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    {buyer.service?.pickup_available && (
                                                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Pickup</span>
                                                    )}
                                                    {buyer.service?.weighing_available && (
                                                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">Timbang</span>
                                                    )}
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-tani-green group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {buyers.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: buyers.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/buyers?page=${page}`}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        page === buyers.current_page
                                            ? 'bg-tani-green text-white'
                                            : 'bg-white border hover:border-tani-green'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
