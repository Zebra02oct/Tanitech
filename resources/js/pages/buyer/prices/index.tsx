import { Head, usePage, Link } from '@inertiajs/react';
import { Scale, Save, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PriceData {
    price: number;
    unit: string;
    confirmed_at: string;
    is_expired: boolean;
    days_since_confirm: number;
}

interface Grade {
    id: number;
    name: string;
    latest_price: PriceData | null;
}

interface BuyerCommodity {
    id: number;
    commodity: {
        name: string;
    };
    grades: Grade[];
}

interface PageProps {
    commodities: BuyerCommodity[];
}

export default function PricesIndex() {
    const { commodities } = usePage<PageProps>().props;

    const getPriceStatus = (days: number) => {
        if (days > 30) return { status: 'expired', label: 'Kedaluwarsa', icon: AlertTriangle, color: 'text-red-600 bg-red-50' };
        if (days > 25) return { status: 'stale', label: 'Perlu konfirmasi', icon: Clock, color: 'text-yellow-600 bg-yellow-50' };
        return { status: 'active', label: 'Aktif', icon: CheckCircle, color: 'text-green-600 bg-green-50' };
    };

    const formatDaysSince = (days: number) => {
        if (days === 0) return 'Hari ini';
        if (days === 1) return '1 hari lalu';
        return `${days} hari lalu`;
    };

    return (
        <>
            <Head title="Update Harga - TANI TECH" />

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
                            <Link href="/buyer/dashboard" className="text-sm text-muted-foreground">
                                Kembali
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Update Harga</h1>
                        <p className="text-muted-foreground">Perbarui harga komoditas Anda</p>
                    </div>

                    {/* Info Banner */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> Harga yang tidak dikonfirmasi lebih dari 30 hari akan ditandai sebagai kedaluwarsa dan tidak akan ditampilkan kepada petani sebagai harga aktif.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {commodities.map((bc) => (
                            <div key={bc.id} className="bg-white rounded-xl border dark:bg-zinc-800">
                                <div className="p-6 border-b">
                                    <h2 className="font-semibold text-lg">{bc.commodity.name}</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {bc.grades.map((grade) => {
                                            const days = grade.latest_price?.days_since_confirm || 0;
                                            const priceStatus = getPriceStatus(days);
                                            const StatusIcon = priceStatus.icon;

                                            return (
                                                <form
                                                    key={grade.id}
                                                    action={`/buyer/prices/${grade.id}`}
                                                    method="post"
                                                    className={`p-4 rounded-lg border ${
                                                        priceStatus.status === 'expired' ? 'border-red-300 bg-red-50/30' :
                                                        priceStatus.status === 'stale' ? 'border-yellow-300 bg-yellow-50/30' :
                                                        'border-gray-200'
                                                    }`}
                                                >
                                                    <input type="hidden" name="_method" value="PUT" />
                                                    <div className="mb-3">
                                                        <span className="font-medium">{grade.name}</span>
                                                        {grade.latest_price && (
                                                            <>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Terakhir: Rp {grade.latest_price.price.toLocaleString('id-ID')}/{grade.latest_price.unit}
                                                                </div>
                                                                <div className={`mt-1 flex items-center gap-1 text-xs ${priceStatus.color}`}>
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    <span>{formatDaysSince(days)}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            defaultValue={grade.latest_price?.price || ''}
                                                            placeholder="Harga baru"
                                                            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
                                                            min="0"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 rounded-lg bg-tani-green text-white text-sm font-medium hover:bg-tani-green/90"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {priceStatus.status !== 'active' && (
                                                        <div className="mt-2 text-xs text-yellow-700 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {priceStatus.status === 'expired'
                                                                ? 'Harga kedaluwarsa - perlu diperbarui'
                                                                : 'Harga perlu dikonfirmasi'
                                                            }
                                                        </div>
                                                    )}
                                                </form>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {commodities.length === 0 && (
                            <div className="bg-white rounded-xl border p-12 text-center dark:bg-zinc-800">
                                <p className="text-muted-foreground mb-4">
                                    Belum ada komoditas aktif. Tambahkan komoditas terlebih dahulu.
                                </p>
                                <Link
                                    href="/buyer/commodities"
                                    className="text-tani-green font-medium hover:underline"
                                >
                                    Tambah Komoditas
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
