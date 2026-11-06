import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Leaf, Star, Send, ArrowLeft } from 'lucide-react';

interface Transaction {
    id: number;
    quantity: number;
    transaction_date: string;
    buyer: {
        id: number;
        business_name: string;
    };
    commodity: {
        id: number;
        name: string;
        unit: string;
    };
}

interface PageProps {
    transaction: Transaction;
}

export default function CreateReview() {
    const { transaction } = usePage<PageProps>().props;

    const [ratings, setRatings] = useState({
        price_rating: 0,
        weighing_rating: 0,
        payment_rating: 0,
        service_rating: 0,
        overall_rating: 0,
    });
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ratingCategories = [
        { key: 'price_rating', label: 'Harga', description: 'Apakah harga yang ditawarkan sudah sesuai?' },
        { key: 'weighing_rating', label: 'Penimbangan', description: 'Apakah proses penimbangan公正 dan akurat?' },
        { key: 'payment_rating', label: 'Pembayaran', description: 'Apakah pembayaran dilakukan dengan baik?' },
        { key: 'service_rating', label: 'Layanan', description: 'Bagaimana pelayanan keseluruhan?' },
    ];

    const overallCategories = [
        { key: 'overall_rating', label: 'Rating Keseluruhan', description: 'Rating keseluruhan pengalaman transaksi Anda' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all ratings are filled
        const allRatings = [...ratingCategories, ...overallCategories];
        const missingRatings = allRatings.filter(r => ratings[r.key as keyof typeof ratings] === 0);
        if (missingRatings.length > 0) {
            alert('Mohon berikan rating untuk semua kategori.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/farmer/reviews/${transaction.id}`,
            {
                price_rating: ratings.price_rating,
                weighing_rating: ratings.weighing_rating,
                payment_rating: ratings.payment_rating,
                service_rating: ratings.service_rating,
                overall_rating: ratings.overall_rating,
                comment: comment,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const StarRating = ({
        value,
        onChange,
        categoryKey,
    }: {
        value: number;
        onChange: (val: number) => void;
        categoryKey: string;
    }) => {
        const displayRating = hoveredRating === categoryKey ? hoveredRating : value;

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoveredRating(categoryKey)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 transition-colors ${
                                star <= displayRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Beri Review - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/farmer/transactions" className="flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                <span>Kembali</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-tani-green/10 flex items-center justify-center">
                                <Star className="w-6 h-6 text-tani-green" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Beri Review</h1>
                                <p className="text-muted-foreground">Bagikan pengalaman transaksi Anda</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="bg-white rounded-xl border p-6 mb-6 dark:bg-zinc-800">
                        <h3 className="font-semibold mb-3">Detail Transaksi</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Pembeli</span>
                                <p className="font-medium">{transaction.buyer.business_name}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Komoditas</span>
                                <p className="font-medium">{transaction.commodity.name}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Jumlah</span>
                                <p className="font-medium">{transaction.quantity} {transaction.commodity.unit}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Tanggal</span>
                                <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Ratings */}
                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h3 className="font-semibold mb-4">Rating Kategori</h3>
                            <div className="space-y-6">
                                {ratingCategories.map((category) => (
                                    <div key={category.key} className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">{category.label}</p>
                                            <p className="text-sm text-muted-foreground">{category.description}</p>
                                        </div>
                                        <StarRating
                                            value={ratings[category.key as keyof typeof ratings]}
                                            onChange={(val) => setRatings({ ...ratings, [category.key]: val })}
                                            categoryKey={category.key}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall Rating */}
                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h3 className="font-semibold mb-4">Rating Keseluruhan</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{overallCategories[0].label}</p>
                                    <p className="text-sm text-muted-foreground">{overallCategories[0].description}</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-tani-green">
                                        {ratings.overall_rating > 0 ? ratings.overall_rating.toFixed(1) : '-'}
                                    </div>
                                    <StarRating
                                        value={ratings.overall_rating}
                                        onChange={(val) => setRatings({ ...ratings, overall_rating: val })}
                                        categoryKey="overall_rating"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="bg-white rounded-xl border p-6 dark:bg-zinc-800">
                            <h3 className="font-semibold mb-4">Komentar (Opsional)</h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border bg-background resize-none"
                                rows={4}
                                placeholder="Ceritakan pengalaman Anda bertransaksi dengan pembeli ini..."
                                maxLength={1000}
                            />
                            <p className="text-sm text-muted-foreground mt-2 text-right">
                                {comment.length}/1000 karakter
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || Object.values(ratings).some(r => r === 0)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                'Mengirim...'
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Kirim Review
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
