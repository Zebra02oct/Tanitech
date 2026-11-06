import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf, MapPin, Trash2, ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';

interface Buyer {
    id: number;
    business_name: string;
    phone: string;
    village: string;
    district: string;
    regency: string;
}

interface Favorite {
    id: number;
    created_at: string;
    buyer: Buyer;
}

interface PageProps {
    favorites: {
        data: Favorite[];
    };
    [key: string]: unknown;
}

export default function Favorites() {
    const { favorites } = usePage<PageProps>().props;
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (buyerId: number) => {
        if (deletingId !== null) return;
        setDeletingId(buyerId);

        router.delete(`/farmer/favorites/${buyerId}`, {
            onFinish: () => {
                setDeletingId(null);
            },
        });
    };

    return (
        <>
            <Head title="Favorit - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link href="/farmer/dashboard" className="text-sm text-muted-foreground">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Favorit Saya</h1>
                        <p className="text-muted-foreground">Pembeli yang Anda simpan untuk kemudahan pemantauan</p>
                    </div>

                    {favorites.data.length === 0 ? (
                        <div className="bg-white rounded-xl border p-12 text-center dark:bg-zinc-800">
                            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                <Heart className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Belum Ada Favorit</h3>
                            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                Anda belum menyimpan pembeli favorit. Tambahkan pembeli untuk memudahkan pemantauan harga dan akses cepat.
                            </p>
                            <Link href="/buyers" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors">
                                <Heart className="w-4 h-4" />
                                Cari & Tambahkan Favorit
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.data.map((favorite) => (
                                <div key={favorite.id} className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold">{favorite.buyer.business_name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{[favorite.buyer.village, favorite.buyer.district, favorite.buyer.regency].filter(Boolean).join(', ')}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(favorite.buyer.id)}
                                            disabled={deletingId === favorite.buyer.id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === favorite.buyer.id ? (
                                                <Spinner className="w-4 h-4" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <Link
                                        href={`/buyers/${favorite.buyer.id}`}
                                        className="inline-flex items-center gap-2 text-tani-green font-medium hover:underline"
                                    >
                                        Lihat Detail
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
