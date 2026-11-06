import { Head, Link } from '@inertiajs/react';
import { Scale } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Kebijakan Privasi - TANI TECH" />

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
                            <Link href="/" className="text-sm text-muted-foreground hover:text-tani-green">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
                    <p className="text-muted-foreground mb-8">Terakhir diperbarui: 20 September 2026</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Pendahuluan</h2>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH ("kami", " kita", atau "TANI TECH") berkomitmen untuk melindungi privasi Anda.
                                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan,
                                dan mengelola informasi Anda saat Anda menggunakan platform kami.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Informasi yang Kami Kumpulkan</h2>
                            <h3 className="text-lg font-medium mb-2">2.1 Informasi Pribadi</h3>
                            <p className="text-muted-foreground mb-4">
                                Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Nama dan alamat email saat mendaftar</li>
                                <li>Informasi profil bisnis (untuk pembeli)</li>
                                <li>Nomor telepon untuk komunikasi</li>
                                <li>Lokasi dan alamat untuk pengiriman</li>
                                <li>Informasi transaksi dan ulasan</li>
                            </ul>

                            <h3 className="text-lg font-medium mb-2">2.2 Informasi Penggunaan</h3>
                            <p className="text-muted-foreground mb-4">
                                Kami secara otomatis mengumpulkan informasi tentang cara Anda menggunakan platform,
                                termasuk halaman yang dikunjungi, waktu akses, dan preferensi Anda.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. Penggunaan Informasi</h2>
                            <p className="text-muted-foreground mb-4">
                                Kami menggunakan informasi yang dikumpulkan untuk:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Menyediakan dan meningkatkan layanan platform</li>
                                <li>Mempermudah koneksi antara petani dan pembeli</li>
                                <li>Mengirim notifikasi tentang transaksi dan aktivitas</li>
                                <li>Mencegah penipuan dan penyalahgunaan</li>
                                <li>Mematuhi kewajiban hukum</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Berbagi Informasi</h2>
                            <p className="text-muted-foreground mb-4">
                                Kami tidak menjual informasi pribadi Anda. Kami hanya berbagi informasi dalam kasus:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Dengan persetujuan Anda</li>
                                <li>Untuk memenuhi layanan yang Anda minta</li>
                                <li>Untuk mematuhi hukum atau proses hukum</li>
                                <li>Untuk melindungi hak dan keselamatan kami</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. Keamanan Data</h2>
                            <p className="text-muted-foreground mb-4">
                                Kami menggunakan langkah keamanan yang sesuai untuk melindungi informasi Anda
                                dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.
                                Namun, tidak ada metode transmisi internet yang 100% aman.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Hak Anda</h2>
                            <p className="text-muted-foreground mb-4">
                                Anda memiliki hak untuk:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Mengakses informasi pribadi Anda</li>
                                <li>Memperbaiki informasi yang tidak akurat</li>
                                <li>Menghapus informasi Anda (dengan batas tertentu)</li>
                                <li>Menolak pemrosesan dalam kasus tertentu</li>
                                <li>Mengakses data dalam format yang dapat dibaca</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7.Cookie</h2>
                            <p className="text-muted-foreground mb-4">
                                Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman
                                pengguna, menganalisis penggunaan platform, dan menampilkan konten yang relevan.
                                Anda dapat mengatur preferensi cookie melalui browser Anda.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Perubahan Kebijakan</h2>
                            <p className="text-muted-foreground mb-4">
                                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
                                Perubahan akan diinformasikan melalui platform atau email.
                                Penggunaan berkelanjutan Anda terhadap platform berarti Anda menyetujui kebijakan yang diperbarui.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Hubungi Kami</h2>
                            <p className="text-muted-foreground mb-4">
                                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                                silakan hubungi kami di:
                            </p>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="font-medium">TANI TECH</p>
                                <p className="text-muted-foreground">Email: privacy@tanitech.id</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
