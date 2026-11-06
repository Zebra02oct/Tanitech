import { Head, usePage, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Scale, Save } from 'lucide-react';

interface Buyer {
    id: number;
    business_name: string;
    description: string | null;
    phone: string;
    village: string;
    district: string;
    regency: string;
    province: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    service: {
        pickup_available: boolean;
        weighing_available: boolean;
        payment_method: string | null;
        minimum_quantity: number | null;
        pickup_minimum_quantity: number | null;
        pickup_notes: string | null;
    } | null;
}

interface PageProps {
    buyer: Buyer;
}

export default function BuyerProfileEdit() {
    const { buyer } = usePage<PageProps>().props;

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        business_name: buyer.business_name || '',
        description: buyer.description || '',
        phone: buyer.phone || '',
        village: buyer.village || '',
        district: buyer.district || '',
        regency: buyer.regency || '',
        province: buyer.province || '',
        address: buyer.address || '',
        pickup_available: buyer.service?.pickup_available || false,
        weighing_available: buyer.service?.weighing_available || false,
        payment_method: buyer.service?.payment_method || '',
        minimum_quantity: buyer.service?.minimum_quantity || '',
        pickup_minimum_quantity: buyer.service?.pickup_minimum_quantity || '',
        pickup_notes: buyer.service?.pickup_notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/buyer/profile');
    };

    return (
        <>
            <Head title="Profil - TANI TECH" />

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

                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Profil Bisnis</h1>
                        <p className="text-muted-foreground">Kelola informasi bisnis Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h2 className="font-semibold mb-4">Informasi Bisnis</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Bisnis *</label>
                                    <input
                                        type="text"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nomor WhatsApp *</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                        placeholder="08xxxxxxxxxx"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h2 className="font-semibold mb-4">Lokasi</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Provinsi</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kabupaten/Kota</label>
                                    <input
                                        type="text"
                                        value={data.regency}
                                        onChange={(e) => setData('regency', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kecamatan</label>
                                    <input
                                        type="text"
                                        value={data.district}
                                        onChange={(e) => setData('district', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Desa/Kelurahan</label>
                                    <input
                                        type="text"
                                        value={data.village}
                                        onChange={(e) => setData('village', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h2 className="font-semibold mb-4">Layanan</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="pickup_available"
                                        checked={data.pickup_available}
                                        onChange={(e) => setData('pickup_available', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="pickup_available" className="text-sm font-medium">
                                        Menyediakan layanan penjemputan (Pickup)
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="weighing_available"
                                        checked={data.weighing_available}
                                        onChange={(e) => setData('weighing_available', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="weighing_available" className="text-sm font-medium">
                                        Menyediakan layanan penimbangan
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border bg-background"
                                    >
                                        <option value="">Pilih metode</option>
                                        <option value="cash">Tunai</option>
                                        <option value="transfer">Transfer Bank</option>
                                        <option value="cod">COD (Bayar di Tempat)</option>
                                    </select>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Minimum Pembelian (kg)</label>
                                        <input
                                            type="number"
                                            value={data.minimum_quantity}
                                            onChange={(e) => setData('minimum_quantity', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border bg-background"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Minimum Pickup (kg)</label>
                                        <input
                                            type="number"
                                            value={data.pickup_minimum_quantity}
                                            onChange={(e) => setData('pickup_minimum_quantity', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border bg-background"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                            {recentlySuccessful && (
                                <span className="text-sm text-tani-green">Tersimpan!</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
