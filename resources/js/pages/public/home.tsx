import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf, MapPin, Scale, Star, ArrowRight, Phone, CheckCircle, MessageSquare, Shield, Users, Quote } from 'lucide-react';

interface Commodity {
    id: number;
    name: string;
    slug: string;
    description: string;
    unit: string;
    buyer_commodities_count: number;
}

interface Stats {
    commodities: number;
    buyers: number;
}

interface PageProps {
    featuredCommodities: Commodity[];
    stats: Stats;
    auth: {
        user: any;
    };
}

export default function Home() {
    const { featuredCommodities, stats, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="TANI TECH - Connect. Compare. Trade." />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-zinc-900/80">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green dark:text-tani-green">
                                    TANI TECH
                                </span>
                            </div>
                            <nav className="hidden md:flex items-center gap-6">
                                <Link
                                    href="/buyers"
                                    className="text-sm font-medium text-muted-foreground hover:text-tani-green transition-colors"
                                >
                                    Cari Pembeli
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center justify-center rounded-lg bg-tani-green px-4 py-2 text-sm font-medium text-white hover:bg-tani-green/90 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href="/login"
                                            className="text-sm font-medium text-muted-foreground hover:text-tani-green transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="inline-flex items-center justify-center rounded-lg bg-tani-green px-4 py-2 text-sm font-medium text-white hover:bg-tani-green/90 transition-colors"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-tani-green/5 via-transparent to-tani-gold/5" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tani-green/10 text-tani-green text-sm font-medium mb-6">
                                <MapPin className="w-4 h-4" />
                                Platform Informasi Pertanian Indonesia
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                                <span className="text-tani-green">Connect.</span>{' '}
                                <span className="text-tani-earth">Compare.</span>{' '}
                                <span className="text-tani-gold">Trade.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                TANI TECH membantu petani menemukan dan membandingkan pembeli
                                komoditas pertanian dengan informasi harga, lokasi, dan reputasi
                                yang transparan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/buyers"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-tani-green px-8 py-3 text-base font-medium text-white hover:bg-tani-green/90 transition-colors"
                                >
                                    Cari Pembeli
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-tani-green text-tani-green px-8 py-3 text-base font-medium hover:bg-tani-green/10 transition-colors"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-tani-green mb-2">
                                    {stats.buyers}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Pembeli Terdaftar
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-tani-earth mb-2">
                                    {stats.commodities}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Jenis Komoditas
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-tani-gold mb-2">
                                    4
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Komoditas Utama
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-tani-green mb-2">
                                    100%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Gratis & Transparan
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Mengapa TANI TECH?
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Kami membantu mempersingkat rantai informasi antara petani
                                dan pembeli.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-tani-green/10 flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-tani-green" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Temukan Pembeli Terdekat
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Cari pembeli berdasarkan lokasi Anda. ketahui jarak dan
                                    temukan yang paling dekat dengan mudah.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-tani-earth/10 flex items-center justify-center mb-4">
                                    <Scale className="w-6 h-6 text-tani-earth" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Bandingkan Harga
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Lihat dan bandingkan harga dari berbagai pembeli.
                                    Pilih yang terbaik untuk Anda.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-tani-gold/10 flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-tani-gold" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Reputasi Terverifikasi
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Lihat rating dan review dari petani lain yang sudah
                                    bertransaksi. Pilihan lebih bijak.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Cara Kerja TANI TECH
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Platform kami menghubungkan petani dengan pembeli secara transparan dan efisien.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-tani-green" />
                                </div>
                                <div className="text-2xl font-bold text-tani-green mb-2">1</div>
                                <h3 className="font-semibold mb-2">Daftar & Lengkapi Profil</h3>
                                <p className="text-sm text-muted-foreground">Buat akun dan tentukan apakah Anda petani atau pembeli.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-tani-green" />
                                </div>
                                <div className="text-2xl font-bold text-tani-green mb-2">2</div>
                                <h3 className="font-semibold mb-2">Cari & Bandingkan</h3>
                                <p className="text-sm text-muted-foreground">Temukan pembeli berdasarkan lokasi, harga, dan rating.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-tani-green" />
                                </div>
                                <div className="text-2xl font-bold text-tani-green mb-2">3</div>
                                <h3 className="font-semibold mb-2">Hubungi via WhatsApp</h3>
                                <p className="text-sm text-muted-foreground">Komunikasikan detail transaksi langsung dengan pembeli.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-tani-gold/10 flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-tani-gold" />
                                </div>
                                <div className="text-2xl font-bold text-tani-gold mb-2">4</div>
                                <h3 className="font-semibold mb-2">Lapor & Review</h3>
                                <p className="text-sm text-muted-foreground">Laporkan transaksi dan berikan review untuk transparansi.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Apa Kata Mereka
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                               听听 dari petani dan pembeli yang sudah menggunakan TANI TECH.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="p-6 rounded-xl border bg-card">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 italic">
                                    "TANI TECH sangat membantu saya menemukan pembeli yang dekat dengan sawah saya. Harga yang transparan membuat saya bisa memilih yang terbaik."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-tani-green/10 flex items-center justify-center">
                                        <Leaf className="w-5 h-5 text-tani-green" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Budi Santoso</div>
                                        <div className="text-xs text-muted-foreground">Petani Padi, Jawa Barat</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl border bg-card">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 italic">
                                    "Sebagai pembeli, saya bisa membandingkan harga dari berbagai petani. Sistem review juga membantu saya menemukan petani terpercaya."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-tani-gold/10 flex items-center justify-center">
                                        <Scale className="w-5 h-5 text-tani-gold" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Siti Rahayu</div>
                                        <div className="text-xs text-muted-foreground">Pengelola Pasar, Semarang</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl border bg-card">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 italic">
                                    "Fitur favorites sangat membantu saya memantau buyer favorit. Harga yang expired juga ditandai dengan jelas, jadi informasi selalu akurat."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-tani-earth/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-tani-earth" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Ahmad Hidayat</div>
                                        <div className="text-xs text-muted-foreground">Petani Cabai, Lombok</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Commodities Section */}
                <section className="py-20 bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Komoditas yang Kami Dukung
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Saat ini kami fokus pada komoditas pertanian utama
                                yang banyak diperdagangkan.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {featuredCommodities.map((commodity) => (
                                <Link
                                    key={commodity.id}
                                    href={`/buyers?commodity=${commodity.slug}`}
                                    className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:border-tani-green/50 transition-all"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-tani-green/10 flex items-center justify-center mb-4 group-hover:bg-tani-green group-hover:text-white transition-colors">
                                        <Leaf className="w-7 h-7 text-tani-green group-hover:text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-tani-green transition-colors">
                                        {commodity.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {commodity.description}
                                    </p>
                                    <div className="mt-4 text-sm text-tani-green font-medium">
                                        {commodity.buyer_commodities_count} pembeli tersedia
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                href="/buyers"
                                className="inline-flex items-center gap-2 text-tani-green font-medium hover:underline"
                            >
                                Lihat semua pembeli
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-tani-gradient text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Siap Memulai?
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto mb-8">
                            Bergabunglah dengan TANI TECH dan temukan pembeli terbaik
                            untuk hasil panen Anda.
                        </p>
                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register?role=farmer"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-tani-green px-8 py-3 text-base font-medium hover:bg-white/90 transition-colors"
                                >
                                    <Leaf className="w-4 h-4" />
                                    Daftar sebagai Petani
                                </Link>
                                <Link
                                    href="/register?role=buyer"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white text-white px-8 py-3 text-base font-medium hover:bg-white/10 transition-colors"
                                >
                                    <Scale className="w-4 h-4" />
                                    Daftar sebagai Pembeli
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 border-t bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                        <Leaf className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Platform pertanian Indonesia yang menghubungkan petani dengan pembeli secara transparan.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Connect. Compare. Trade.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-semibold mb-4">Tautan Cepat</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="/buyers" className="hover:text-tani-green transition-colors">Cari Pembeli</Link></li>
                                    <li><Link href="/register?role=farmer" className="hover:text-tani-green transition-colors">Daftar sebagai Petani</Link></li>
                                    <li><Link href="/register?role=buyer" className="hover:text-tani-green transition-colors">Daftar sebagai Pembeli</Link></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="/privacy-policy" className="hover:text-tani-green transition-colors">Kebijakan Privasi</Link></li>
                                    <li><Link href="/terms-of-service" className="hover:text-tani-green transition-colors">Syarat & Ketentuan</Link></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+62 812 3456 7890</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Scale className="w-4 h-4" />
                                    <span>info@tanitech.id</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                            <p>&copy; 2026 TANI TECH. Hak cipta dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
