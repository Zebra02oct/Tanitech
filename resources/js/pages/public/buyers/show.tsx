import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Phone, Star, Check, Truck, Scale, Clock, MessageSquare, Package, Heart, AlertTriangle, Info } from 'lucide-react';
import SaleRequestModal from '@/components/sale-request-modal';

interface Grade {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    latest_price: {
        price: number;
        unit: string;
        confirmed_at: string;
        days_since_confirm: number | null;
        is_expired: boolean;
    } | null;
}

interface BuyerCommodity {
    commodity: {
        id: number;
        name: string;
        unit: string;
    };
    grades: Grade[];
}

interface Review {
    id: number;
    price_rating: number;
    weighing_rating: number;
    payment_rating: number;
    service_rating: number;
    overall_rating: number;
    comment: string | null;
    created_at: string;
    farmer: {
        user: {
            name: string;
        };
    };
}

interface Buyer {
    id: number;
    business_name: string;
    description: string | null;
    phone: string;
    village: string;
    district: string;
    regency: string;
    province: string;
    verification_status: string;
    verified_at: string | null;
    is_active: boolean;
    buyer_commodities: BuyerCommodity[];
    service: {
        pickup_available: boolean;
        weighing_available: boolean;
        payment_method: string | null;
        minimum_quantity: number | null;
        pickup_minimum_quantity: number | null;
        pickup_notes: string | null;
    } | null;
}

interface Role {
    name: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface PageProps {
    buyer: Buyer;
    avgRatings: {
        price_rating: number;
        weighing_rating: number;
        payment_rating: number;
        service_rating: number;
        overall_rating: number;
    } | null;
    verifiedTransactions: number;
    auth: {
        user: AuthUser | null;
    };
    isFavorite: boolean;
    recentReviews: Review[];
    [key: string]: unknown; // Index signature for Inertia PageProps constraint
}

export default function BuyerShow() {
    const { buyer, avgRatings, verifiedTransactions, auth, isFavorite, recentReviews } = usePage<PageProps>().props;
    const [showSaleRequest, setShowSaleRequest] = useState(false);

    const formatPrice = (price: number, unit: string) => {
        return `Rp ${price.toLocaleString('id-ID')}/${unit}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        const days = Math.floor(seconds / 86400);
        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Kemarin';
        if (days < 7) return `${days} hari lalu`;
        if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
        return formatDate(date);
    };

    const getWhatsAppUrl = () => {
        const phone = buyer.phone.replace(/[^0-9]/g, '');
        const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
        return `https://wa.me/${formattedPhone}`;
    };

    const isFarmer = auth.user?.roles?.some((r) => r.name === 'farmer') ?? false;

    const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
        const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${starSize} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const RatingBar = ({ label, value }: { label: string; value: number }) => (
        <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(value / 5) * 100}%` }}
                />
            </div>
            <span className="text-sm font-medium w-8">{value.toFixed(1)}</span>
        </div>
    );

    return (
        <>
            <Head title={`${buyer.business_name} - TANI TECH`} />

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
                                <Link href="/buyers" className="text-sm font-medium text-muted-foreground hover:text-tani-green">
                                    Kembali
                                </Link>
                                {auth.user ? (
                                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-tani-green">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/login" className="text-sm font-medium text-tani-green">
                                        Masuk
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Header */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold">{buyer.business_name}</h1>
                                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{[buyer.village, buyer.district, buyer.regency].filter(Boolean).join(', ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {buyer.verification_status === 'approved' && (
                                            <div className="group relative">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-tani-green/10 text-tani-green text-sm font-medium cursor-help">
                                                    <Check className="w-4 h-4" />
                                                    Terverifikasi
                                                    <Info className="w-3 h-3 opacity-60" />
                                                </span>
                                                {/* Tooltip */}
                                                <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-muted-foreground">
                                                    <p className="font-medium text-foreground mb-1">Apa arti terverifikasi?</p>
                                                    <p>Buyer terverifikasi berarti data dan identitas usahanya telah diperiksa oleh Admin. Status ini bukan jaminan bahwa seluruh transaksi akan selalu berjalan tanpa masalah.</p>
                                                </div>
                                            </div>
                                        )}
                                        {auth.user && isFarmer && (
                                            <form action={`/farmer/favorites/${buyer.id}`} method="post">
                                                <input type="hidden" name="_method" value={isFavorite ? 'DELETE' : 'POST'} />
                                                <button
                                                    type="submit"
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isFavorite
                                                            ? 'bg-red-100 text-red-500 hover:bg-red-200'
                                                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                                    }`}
                                                >
                                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {buyer.description && (
                                    <p className="text-muted-foreground mb-4">{buyer.description}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href={getWhatsAppUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Hubungi via WhatsApp
                                    </a>

                                    {auth.user && isFarmer && (
                                        <button
                                            onClick={() => setShowSaleRequest(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                                        >
                                            <Package className="w-4 h-4" />
                                            Ajukan Penjualan
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Commodities & Prices */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h2 className="text-lg font-semibold mb-4">Harga Komoditas</h2>
                                {buyer.buyer_commodities.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Belum ada komoditas yang terdaftar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {buyer.buyer_commodities.map((bc) => (
                                            <div key={bc.commodity.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                                                <h3 className="font-medium text-tani-green mb-2">{bc.commodity.name}</h3>
                                                <div className="space-y-2">
                                                    {bc.grades.filter(g => g.is_active !== false).map((grade) => {
                                                        const days = grade.latest_price?.days_since_confirm ?? 0;
                                                        const isExpired = grade.latest_price?.is_expired ?? false;
                                                        const isStale = days > 25 && days <= 30;

                                                        return (
                                                            <div
                                                                key={grade.id}
                                                                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                                                                    isExpired ? 'bg-red-50 border border-red-200' :
                                                                    isStale ? 'bg-yellow-50 border border-yellow-200' :
                                                                    'bg-muted/50'
                                                                }`}
                                                            >
                                                                <div>
                                                                    <span className="font-medium">{grade.name}</span>
                                                                    {grade.description && (
                                                                        <span className="text-sm text-muted-foreground ml-2">
                                                                            - {grade.description}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    {grade.latest_price ? (
                                                                        <>
                                                                            <div className={`font-bold ${isExpired ? 'text-red-600' : 'text-tani-green'}`}>
                                                                                {formatPrice(grade.latest_price.price, grade.latest_price.unit)}
                                                                            </div>
                                                                            {isExpired ? (
                                                                                <div className="text-xs text-red-600 flex items-center gap-1 justify-end">
                                                                                    <AlertTriangle className="w-3 h-3" />
                                                                                    Harga kedaluwarsa
                                                                                </div>
                                                                            ) : isStale ? (
                                                                                <div className="text-xs text-yellow-600 flex items-center gap-1 justify-end">
                                                                                    <Clock className="w-3 h-3" />
                                                                                    Perlu konfirmasi
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                                                                    <Clock className="w-3 h-3" />
                                                                                    {getTimeAgo(grade.latest_price.confirmed_at)}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-sm text-muted-foreground">Harga tidak tersedia</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Services */}
                            {buyer.service && (
                                <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <h2 className="text-lg font-semibold mb-4">Layanan</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className={`flex items-center gap-3 p-4 rounded-lg ${buyer.service.pickup_available ? 'bg-tani-green/10' : 'bg-muted'}`}>
                                            <Truck className={`w-6 h-6 ${buyer.service.pickup_available ? 'text-tani-green' : 'text-muted-foreground'}`} />
                                            <div>
                                                <div className={`font-medium ${buyer.service.pickup_available ? '' : 'text-muted-foreground'}`}>
                                                    Pickup Tersedia
                                                </div>
                                                {buyer.service.pickup_available && buyer.service.pickup_minimum_quantity && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Min: {buyer.service.pickup_minimum_quantity} kg
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-3 p-4 rounded-lg ${buyer.service.weighing_available ? 'bg-purple-50' : 'bg-muted'}`}>
                                            <Scale className={`w-6 h-6 ${buyer.service.weighing_available ? 'text-purple-600' : 'text-muted-foreground'}`} />
                                            <div>
                                                <div className={`font-medium ${buyer.service.weighing_available ? '' : 'text-muted-foreground'}`}>
                                                    Penimbangan Tersedia
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {buyer.service.payment_method && (
                                        <div className="mt-4 p-4 rounded-lg bg-muted">
                                            <div className="text-sm text-muted-foreground">Metode Pembayaran</div>
                                            <div className="font-medium">{buyer.service.payment_method}</div>
                                        </div>
                                    )}
                                    {buyer.service.minimum_quantity && (
                                        <div className="mt-4 p-4 rounded-lg bg-muted">
                                            <div className="text-sm text-muted-foreground">Minimum Pembelian</div>
                                            <div className="font-medium">{buyer.service.minimum_quantity} kg</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Section */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold">Ulasan ({recentReviews.length})</h2>
                                </div>

                                {avgRatings && (
                                    <div className="mb-6 p-4 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-yellow-500">{avgRatings.overall_rating.toFixed(1)}</div>
                                                <StarRating rating={avgRatings.overall_rating} />
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {verifiedTransactions} transaksi
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <RatingBar label="Harga" value={avgRatings.price_rating} />
                                                <RatingBar label="Penimbangan" value={avgRatings.weighing_rating} />
                                                <RatingBar label="Pembayaran" value={avgRatings.payment_rating} />
                                                <RatingBar label="Layanan" value={avgRatings.service_rating} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {recentReviews.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Belum ada ulasan.</p>
                                        <p className="text-sm">Jadilah yang pertama memberikan ulasan!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentReviews.map((review) => (
                                            <div key={review.id} className="p-4 rounded-lg border">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="font-medium">{review.farmer.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {getTimeAgo(review.created_at)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="font-medium">{review.overall_rating}</span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h3 className="font-semibold mb-4">Kontak</h3>
                                <div className="space-y-3">
                                    <a
                                        href={getWhatsAppUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-green-600 hover:text-green-700"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>{buyer.phone}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                <h3 className="font-semibold mb-4">Statistik</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Transaksi Terverifikasi</div>
                                        <div className="text-2xl font-bold">{verifiedTransactions}</div>
                                    </div>
                                    {avgRatings && (
                                        <div>
                                            <div className="text-sm text-muted-foreground">Rating Rata-rata</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold">{avgRatings.overall_rating.toFixed(1)}</span>
                                                <StarRating rating={avgRatings.overall_rating} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA Card */}
                            {auth.user && isFarmer && (
                                <div className="bg-tani-gradient rounded-xl p-6 text-white">
                                    <h3 className="font-semibold mb-2">Siap Menjual?</h3>
                                    <p className="text-sm text-white/80 mb-4">
                                        Ajukan penjualan atau hubungi langsung via WhatsApp.
                                    </p>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setShowSaleRequest(true)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-tani-green font-medium hover:bg-white/90 transition-colors"
                                        >
                                            <Package className="w-4 h-4" />
                                            Ajukan Penjualan
                                        </button>
                                        <a
                                            href={getWhatsAppUrl()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center px-4 py-2.5 rounded-lg border border-white text-white font-medium hover:bg-white/10 transition-colors"
                                        >
                                            Chat Sekarang
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!auth.user && (
                                <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <h3 className="font-semibold mb-2">Tertarik Bertransaksi?</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Daftar sebagai petani untuk mengajukan penjualan.
                                    </p>
                                    <Link
                                        href="/register?role=farmer"
                                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                                    >
                                        Daftar sebagai Petani
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sale Request Modal */}
            {auth.user && isFarmer && (
                <SaleRequestModal
                    buyer={buyer}
                    isOpen={showSaleRequest}
                    onClose={() => setShowSaleRequest(false)}
                />
            )}
        </>
    );
}
