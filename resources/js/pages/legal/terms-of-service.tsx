import { Head, Link } from '@inertiajs/react';
import { Scale } from 'lucide-react';

export default function TermsOfService() {
    return (
        <>
            <Head title="Syarat dan Ketentuan - TANI TECH" />

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
                    <h1 className="text-3xl font-bold mb-2">Syarat dan Ketentuan</h1>
                    <p className="text-muted-foreground mb-8">Terakhir diperbarui: 20 September 2026</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Pendahuluan</h2>
                            <p className="text-muted-foreground mb-4">
                                Selamat datang di TANI TECH. Dengan mengakses atau menggunakan platform TANI TECH,
                                Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini.
                                Jika Anda tidak setuju dengan syarat ini, silakan jangan gunakan platform kami.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Definisi</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li><strong>"Platform"</strong> berarti situs web dan aplikasi TANI TECH</li>
                                <li><strong>"Pengguna"</strong> berarti siapa pun yang menggunakan Platform</li>
                                <li><strong>"Petani"</strong> berarti pengguna yang menjual hasil pertanian</li>
                                <li><strong>"Pembeli"</strong> berarti pengguna yang membeli hasil pertanian</li>
                                <li><strong>"Transaksi"</strong> berarti penjualan aktual antara Petani dan Pembeli</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. Sifat Platform</h2>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH adalah <strong>platform koneksi</strong>, bukan marketplace.
                                Kami menyediakan layanan untuk menghubungkan Petani dengan Pembeli.
                                <strong>Transaksi aktual terjadi secara offline</strong> antara Petani dan Pembeli.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH tidak bertanggung jawab atas:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Kualitas produk yang dijual</li>
                                <li>Penyerahan pembayaran antara pihak</li>
                                <li>Perselisihan yang timbul dari transaksi offline</li>
                                <li>Kerugian akibat informasi harga yang sudah expired</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Akun Pengguna</h2>
                            <h3 className="text-lg font-medium mb-2">4.1 Pendaftaran</h3>
                            <p className="text-muted-foreground mb-4">
                                Untuk menggunakan Platform, Anda harus:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Berusia minimal 18 tahun</li>
                                <li>Menyediakan informasi yang akurat dan lengkap</li>
                                <li>Menjaga keamanan akun Anda</li>
                                <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
                            </ul>

                            <h3 className="text-lg font-medium mb-2">4.2 Verifikasi Pembeli</h3>
                            <p className="text-muted-foreground mb-4">
                                Pembeli dapat diverifikasi oleh admin kami. Status "terverifikasi" berarti
                                data telah diperiksa oleh admin, <strong>bukan jaminan</strong> bahwa transaksi
                                akan selalu berjalan lancar.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. Harga dan Informasi</h2>
                            <h3 className="text-lg font-medium mb-2">5.1 Akurasi Harga</h3>
                            <p className="text-muted-foreground mb-4">
                                Pembeli bertanggung jawab untuk memastikan harga yang ditampilkan akurat dan
                                terkini. Harga yang tidak dikonfirmasi dalam 30 hari akan ditandai sebagai
                                "kedaluwarsa".
                            </p>

                            <h3 className="text-lg font-medium mb-2">5.2 Transparansi</h3>
                            <p className="text-muted-foreground mb-4">
                                Semua informasi yang ditampilkan, termasuk harga, lokasi, dan layanan,
                                harus akurat. Informasi yang menyesatkan dapat mengakibatkan penangguhan akun.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Transaksi</h2>
                            <h3 className="text-lg font-medium mb-2">6.1 Proses Transaksi</h3>
                            <p className="text-muted-foreground mb-4">
                                Transaksi dilakukan secara offline antara Petani dan Pembeli.
                                TANI TECH tidak memproses pembayaran atau mengatur pengiriman.
                            </p>

                            <h3 className="text-lg font-medium mb-2">6.2 Pelaporan Transaksi</h3>
                            <p className="text-muted-foreground mb-4">
                                Petani dapat melaporkan transaksi yang telah dilakukan.
                                Pembeli dapat menerima atau menolak laporan dengan alasan.
                            </p>

                            <h3 className="text-lg font-medium mb-2">6.3 Review</h3>
                            <p className="text-muted-foreground mb-4">
                                Review hanya dapat diberikan untuk transaksi yang telah dikonfirmasi.
                                Review harus didasarkan pada pengalaman nyata.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7. Larangan</h2>
                            <p className="text-muted-foreground mb-4">
                                Pengguna dilarang:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Menyediakan informasi palsu atau menyesatkan</li>
                                <li>Menggunakan platform untuk penipuan</li>
                                <li>Melanggar hak kekayaan intelektual pihak lain</li>
                                <li>Mengirim spam atau konten ilegal</li>
                                <li>Mengakses akun orang lain tanpa izin</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Penangguhan dan Penghentian</h2>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH berhak menangguhkan atau menghentikan akun yang:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Melanggar Syarat dan Ketentuan</li>
                                <li>Melakukan aktivitas ilegal</li>
                                <li>Memberikan informasi palsu</li>
                                <li>Dilaporkan berulang kali oleh pengguna lain</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Batasan Tanggung Jawab</h2>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH tidak bertanggung jawab atas:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Transaksi yang terjadi di luar platform</li>
                                <li>Kerugian akibat informasi yang outdated</li>
                                <li>Tindakan pengguna lain di platform</li>
                                <li>Gangguan teknis di luar kendali kami</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">10. Perubahan Layanan</h2>
                            <p className="text-muted-foreground mb-4">
                                TANI TECH berhak mengubah atau menghentikan layanan kapan saja.
                                Kami akan menginformasikan perubahan signifikan sebelumnya.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">11. Hukum yang Berlaku</h2>
                            <p className="text-muted-foreground mb-4">
                                Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia.
                                Setiap perselisihan akan diselesaikan melalui pengadilan yang berwenang.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">12. Hubungi Kami</h2>
                            <p className="text-muted-foreground mb-4">
                                Untuk pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
                            </p>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="font-medium">TANI TECH</p>
                                <p className="text-muted-foreground">Email: legal@tanitech.id</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
