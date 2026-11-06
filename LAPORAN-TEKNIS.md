# Laporan Teknis Perkembangan Sistem

## TaniTech - Platform Pertanian Indonesia

**Tanggal:** 20 September 2026  
**Versi:** 1.0 Development  
**Status:** ⚠️ Dalam tinjauan konsultan IT

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Spesifikasi Teknis](#2-spesifikasi-teknis)
3. [Status Fitur (Revisi)](#3-status-fitur-revisi)
4. [Temuan Prioritas Tinggi](#4-temuan-prioritas-tinggi)
5. [Audit yang Diperlukan](#5-audit-yang-diperlukan)
6. [Rekomendasi Perbaikan](#6-rekomendasi-perbaikan)
7. [Prioritas Pengerjaan](#7-prioritas-pengerjaan)
8. [Environment Setup](#8-environment-setup)

---ya lqanjut

## 1. Ringkasan Proyek

TaniTech adalah platform digital berbasis web yang menghubungkan **petani** dengan **pembeli (buyer)** untuk transaksi komoditas pertanian. Sistem ini menyediakan fitur manajemen komoditas, penentuan harga, transaksi, dan verifikasi pengguna.

### Tujuan Sistem

- Mempermudah proses jual beli hasil pertanian
- Transparansi harga berdasarkan grade/kualitas
- Verifikasi buyer untuk kepercayaan farmer
- Sistem review dan rating untuk evaluasi

### Catatan Penting dari Konsultan

> _"TaniTech bukan marketplace konvensional. Sistem berfungsi sebagai platform untuk menemukan, membandingkan, dan menghubungkan petani dengan buyer. **Transaksi sebenarnya berlangsung secara offline**."_

---

## 2. Spesifikasi Teknis

### Teknologi Stack

| Komponen          | Teknologi          | Versi   |
| ----------------- | ------------------ | ------- |
| Backend Framework | Laravel            | 13.32.0 |
| PHP               | PHP                | 8.3.31  |
| Frontend          | React + Inertia.js | -       |
| Build Tool        | Vite               | 5.x     |
| Database          | MySQL              | -       |
| Session Driver    | Database           | -       |
| Authentication    | Laravel Fortify    | 1.37.2  |
| Role Management   | Spatie Permission  | Latest  |
| Routing           | Wayfinder          | 0.1.14  |

### Node.js Environment

| Package | Versi   |
| ------- | ------- |
| Node.js | 22.14.0 |
| npm     | 10.9.2  |

---

## 3. Status Fitur (Revisi)

Berdasarkan feedback konsultan IT, status fitur diubah menjadi lebih terukur:

### Status Definitions

| Status              | Makna                                  |
| ------------------- | -------------------------------------- |
| Planned             | Belum dikerjakan                       |
| In Development      | Sedang dikembangkan                    |
| Implemented         | Kode telah dibuat                      |
| Functionally Tested | Telah diuji melalui skenario           |
| Security Reviewed   | Otorisasi dan keamanan telah diperiksa |
| Ready for UAT       | Siap diuji oleh pengguna               |
| Completed           | Lulus pengujian dan disetujui          |

### 3.1 Authentication & Security

| Fitur                           | Status      | Catatan                  |
| ------------------------------- | ----------- | ------------------------ |
| Login dengan email/password     | Implemented | Perlu validasi otorisasi |
| Registrasi pengguna             | Implemented | Perlu validasi role      |
| Two-Factor Authentication (2FA) | Implemented | Perlu test lengkap       |
| Passkey Authentication          | Implemented | Perlu test autentikasi   |
| Email Verification              | Implemented | Perlu verifikasi flow    |
| Password Reset                  | Implemented | -                        |

### 3.2 Role Management

| Fitur             | Status      | Catatan                   |
| ----------------- | ----------- | ------------------------- |
| Farmer role       | Implemented | Perlu audit authorization |
| Buyer role        | Implemented | Perlu audit authorization |
| Admin role        | Implemented | Perlu verifikasi akses    |
| Spatie Permission | Implemented | Perlu cek tabel pivot     |

### 3.3 Farmer Features

| Fitur                      | Status      | Catatan                          |
| -------------------------- | ----------- | -------------------------------- |
| Dashboard dengan statistik | Implemented | Perlu validasi data              |
| Kelola buyer favorit       | Implemented | Perlu validasi unique            |
| Buat permintaan penjualan  | Implemented | **Perlu validasi alur lengkap**  |
| Lihat riwayat transaksi    | Implemented | Perlu validasi role              |
| Beri review untuk buyer    | Implemented | **Perlu validasi aturan bisnis** |

### 3.4 Buyer Features

| Fitur                        | Status      | Catatan                               |
| ---------------------------- | ----------- | ------------------------------------- |
| Dashboard dengan statistik   | Implemented | -                                     |
| Edit profil dengan layanan   | Implemented | -                                     |
| Kelola komoditas yang dijual | Implemented | -                                     |
| Atur grade per komoditas     | Implemented | -                                     |
| Atur harga per grade         | Implemented | **Perlu implementasi expiry 30 hari** |
| Kelola permintaan penjualan  | Implemented | -                                     |
| Konfirmasi/tolak transaksi   | Implemented | **Perlu validasi alasan penolakan**   |

### 3.5 Admin Features

| Fitur                 | Status      | Catatan            |
| --------------------- | ----------- | ------------------ |
| Dashboard admin       | Implemented | -                  |
| Verifikasi buyer baru | Implemented | -                  |
| Manajemen laporan     | Planned     | **P0 - Belum ada** |
| Suspend buyer         | Planned     | **P1 - Belum ada** |
| Moderasi review       | Planned     | **P1 - Belum ada** |
| Audit log             | Planned     | **P1 - Belum ada** |

### 3.6 Public Features

| Fitur                      | Status      | Catatan                         |
| -------------------------- | ----------- | ------------------------------- |
| Landing page               | Implemented | **Perlu revisi UX**             |
| Daftar buyer publik        | Implemented | **Perlu filter & sorting**      |
| Detail buyer dengan rating | Implemented | **Perlu tampilkan update date** |

---

## 4. Temuan Prioritas Tinggi

### 4.1 Feature Status Tanpa Bukti Pengujian

**Masalah:** Banyak fitur ditandai selesai tanpa test case, hasil pengujian, atau screenshot.

**Action Required:**

- Ubah status fitur sesuai matriks di atas
- Buat test case untuk setiap alur kritis
- Dokumentasikan hasil pengujian

### 4.2 Role & Authorization Perlu Diperiksa

**Risiko:** Pengguna dapat mengakses URL role lain secara langsung:

- `/admin/dashboard`
- `/buyer/prices`
- `/farmer/transactions`

**Yang Harus Diperiksa:**

- [ ] Tabel `roles` tersedia?
- [ ] Tabel `model_has_roles` tersedia?
- [ ] Middleware memeriksa role dari database?
- [ ] Setiap endpoint punya authorization check?

**Konfigurasi yang Direkomendasikan:**

```php
// routes/admin.php
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Admin routes
});

// routes/buyer.php
Route::middleware(['auth', 'role:buyer'])->group(function () {
    // Buyer routes
});

// routes/farmer.php
Route::middleware(['auth', 'role:farmer'])->group(function () {
    // Farmer routes
});
```

### 4.3 Konsep Sale Request vs Transaction Report

**Masalah:** Sistem harus membedakan dua konsep:

| Konsep                 | Definisi                        | Status              |
| ---------------------- | ------------------------------- | ------------------- |
| **Sale Request**       | Permintaan/niat petani menjual  | Perlu validasi alur |
| **Transaction Report** | Laporan transaksi offline nyata | Perlu validasi alur |

**Status Sale Request yang Direkomendasikan:**

- `PENDING` - Menunggu respons
- `ACCEPTED` - Buyer menerima
- `DECLINED` - Buyer menolak
- `CANCELLED` - Farmer membatalkan
- `COMPLETED` - Selesai

**Status Transaction Report yang Direkomendasikan:**

- `PENDING_CONFIRMATION` - Menunggu konfirmasi buyer
- `CONFIRMED` - Buyer mengkonfirmasi
- `REJECTED` - Buyer menolak (wajib dengan alasan)
- `WITHDRAWN` - Farmer menarik laporan
- `DISPUTED` - Dalam penyelesaian

### 4.4 Penolakan Transaksi Wajib Ada Alasan

**Rule:** Buyer tidak boleh menolak tanpa penjelasan.

**Alasan yang harus tersedia:**

1. Transaksi tidak pernah terjadi
2. Data transaksi tidak sesuai
3. Jumlah komoditas berbeda
4. Komoditas tidak diterima
5. Kesalahan pelaporan
6. Tidak mengenali laporan tersebut
7. Alasan lainnya (wajib isi catatan)

**Catatan:** Penolakan tidak boleh otomatis menurunkan rating buyer.

### 4.5 Sistem Harga Harus Ada Expiry

**Masalah:** Harga harus memiliki mekanisme kadaluarsa untuk menjaga akurasi informasi.

**Aturan yang Direkomendasikan:**

| Status     | Definisi                            |
| ---------- | ----------------------------------- |
| `ACTIVE`   | Harga dikonfirmasi ≤ 30 hari        |
| `STALE`    | Harga 25-30 hari belum dikonfirmasi |
| `EXPIRED`  | Harga > 30 hari tanpa konfirmasi    |
| `DISABLED` | Dinonaktifkan buyer atau admin      |

**UI yang Direkomendasikan:**

```
Rp12.000/kg
Dikonfirmasi 3 hari lalu ✅

---
atau

⚠️ Harga terakhir diperbarui 34 hari lalu
Harga perlu dikonfirmasi oleh buyer
```

### 4.6 Verifikasi ≠ Jaminan Kepercayaan

**Tampilan tooltip/info:**

> "Buyer terverifikasi berarti data dan identitas usahanya telah diperiksa oleh Admin. Status ini bukan jaminan bahwa seluruh transaksi akan selalu berjalan tanpa masalah."

### 4.7 Jangan Berikan Label "Buyer Terbaik"

**Dilarang:** Label seperti "Buyer terbaik", "Buyer nomor satu", "Buyer paling terpercaya"

**Ganti dengan:** Sorting yang dikendalikan pengguna

- Terdekat
- Harga tertinggi
- Rating tertinggi
- Harga terbaru diperbarui
- Menyediakan layanan pickup
- Buyer aktif

---

## 5. Audit yang Diperlukan

### 5.1 Audit Migration & Database

**Tabel yang perlu diverifikasi:**

| Tabel             | Primary Key | Foreign Key                    | Unique                  | Index | Soft Delete | Catatan                 |
| ----------------- | ----------- | ------------------------------ | ----------------------- | ----- | ----------- | ----------------------- |
| users             | id          | -                              | email                   | -     | -           | role?                   |
| roles             | id          | -                              | name                    | -     | -           | Cek ada?                |
| model_has_roles   | -           | user_id, role_id               | -                       | -     | -           | Cek ada?                |
| farmer_profiles   | id          | user_id                        | -                       | -     | -           | 1:1 dengan user?        |
| buyer_profiles    | id          | user_id                        | -                       | -     | -           | Status verifikasi?      |
| buyer_commodities | id          | buyer_profile_id, commodity_id | (buyer,commodity)       | -     | -           | Tidak boleh duplikat?   |
| grades            | id          | -                              | (buyer,commodity,grade) | -     | -           | Cek ada?                |
| prices            | id          | grade_id                       | -                       | -     | -           | perlu confirmed_at?     |
| sale_requests     | id          | farmer_id, buyer_id            | -                       | -     | -           | Status enum?            |
| transactions      | id          | -                              | -                       | -     | -           | Siapa yang terlibat?    |
| reviews           | id          | transaction_id                 | (transaction)           | -     | -           | 1 review per transaksi? |
| favorites         | id          | farmer_id, buyer_id            | (farmer,buyer)          | -     | -           | Tidak boleh duplikat?   |
| reports           | id          | -                              | -                       | -     | -           | Status penanganan?      |

### 5.2 Audit Authorization Checklist

- [ ] Farmer tidak bisa akses `/admin/*`
- [ ] Farmer tidak bisa ubah harga buyer
- [ ] Buyer tidak bisa ubah transaksi buyer lain
- [ ] Review hanya bisa dari farmer terkait
- [ ] Admin authorization di backend aktif

### 5.3 Audit Migration History

**Masalah yang ditemukan:** Tabel sessions tidak tercatat di migrations.

**Solusi yang diterapkan:** Insert manual ke tabel migrations.

**Perlu diverifikasi:**

- Apakah struktur tabel sesuai dengan migration?
- Apakah ada migration yang dilewati?
- Apakah migration dapat dijalankan ulang?

---

## 6. Rekomendasi Perbaikan

### 6.1 Business Rules yang Perlu Diimplementasi

#### Review Rules

- [ ] Review hanya setelah transaksi `CONFIRMED`
- [ ] Satu transaksi = satu review
- [ ] Reviewer harus farmer terkait
- [ ] Rating 1-5

#### Transaction Rules

- [ ] Farmer bisa tarik laporan saat `PENDING`
- [ ] Penolakan wajib dengan alasan
- [ ] Penolakan tidak kurangi rating otomatis
- [ ] Data ditolak tetap disimpan untuk audit

#### Price Rules

- [ ] Harga punya `confirmed_at`
- [ ] Buyer harus konfirmasi harga berkala
- [ ] Harga > 30 hari tanpa konfirmasi = `EXPIRED`
- [ ] Harga expired tidak tampil sebagai aktif

### 6.2 UI/UX Improvements

#### Buyer Card Structure

```
Nama Buyer
✓ Terverifikasi

Lokasi

Membeli:
Komoditas

Harga mulai:
Rp12.000/kg

Harga diperbarui:
3 hari lalu

★ 4,6 — 18 ulasan

[ Lihat Detail ]
```

#### Empty State Examples

| Kondisi             | Pesan                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Belum ada favorit   | "Anda belum menyimpan buyer favorit. Tambahkan buyer untuk memudahkan pemantauan harga dan akses cepat."           |
| Belum ada transaksi | "Belum ada transaksi yang tercatat. Setelah melakukan penjualan secara offline, Anda dapat melaporkannya di sini." |
| Harga expired       | "Harga komoditas ini belum dikonfirmasi oleh buyer dalam 30 hari terakhir."                                        |

### 6.3 Security Checklist

- [ ] Mass assignment protection ($fillable/$guarded)
- [ ] Field sensitif tidak bisa di-override user biasa
- [ ] Validasi input di backend
- [ ] Pembatasan akses data sensitif

---

## 7. Prioritas Pengerjaan

### Tahap 1 — Wajib Sebelum Uji Pengguna (P0) ✅ SELESAI

| No  | Task                                      | Status |
| --- | ----------------------------------------- | ------ |
| 1   | Audit authorization & security backend    | ✅     |
| 2   | Audit migration & database integrity      | ✅     |
| 3   | Validasi alur Sale Request                | ✅     |
| 4   | Validasi alur Transaction Report          | ✅     |
| 5   | Validasi konfirmasi & penolakan transaksi | ✅     |
| 6   | Implementasi price expiry 30 hari       | ✅     |
| 7   | Validasi aturan review                   | ✅     |
| 8   | Pengujian akses ilegal                   | ✅     |
| 9   | Pengujian responsive mobile              | ✅     |

### Tahap 2 — Wajib untuk MVP (P1) ⬜

| No  | Task                              | Status |
| --- | --------------------------------- | ------ |
| 1   | Admin moderasi laporan            | ⬜     |
| 2   | Admin suspend buyer               | ⬜     |
| 3   | Buyer pengingat pembaruan harga   | ⬜     |
| 4   | Empty state & error state         | ⬜     |
| 5   | In-app notification               | ⬜     |
| 6   | Audit log aktivitas               | ⬜     |
| 7   | Privacy Policy & Terms of Service | ⬜     |
| 8   | Perbaikan UX pencarian buyer      | ⬜     |
| 9   | Pengujian dengan data realistis   | ⬜     |

### Tahap 3 — Pengembangan Setelah MVP (P2)

| No  | Task                     | Status |
| --- | ------------------------ | ------ |
| 1   | Riwayat harga            | ⬜     |
| 2   | Dashboard analytics      | ⬜     |
| 3   | Export laporan PDF/Excel | ⬜     |
| 4   | Email notification       | ⬜     |
| 5   | API documentation        | ⬜     |
| 6   | Chat internal            | ⬜     |

---

## 8. Environment Setup

### Development Server Status

| Service         | URL                   | Status     |
| --------------- | --------------------- | ---------- |
| Vite Dev Server | http://localhost:5173 | ✅ Running |
| Laravel Backend | http://localhost:8000 | ✅ Running |
| Inertia SSR     | /\_\_inertia_ssr      | ✅ Active  |

### Database Configuration

- **Driver:** MySQL
- **Host:** 127.0.0.1
- **Port:** 3306
- **Database:** tanitech
- **Session Driver:** database

### Command Penting

```bash
# Development
npm run dev          # Start Vite + Laravel dev server
php artisan serve    # Start Laravel server only

# Database
php artisan migrate              # Run migrations
php artisan migrate:status      # Check migration status
php artisan migrate:fresh       # Fresh migrate (HATI-HATI: hapus semua data)

# Code Quality
php artisan test                 # Run tests
phpstan analyse                  # PHP static analysis
pint                             # Code formatting
```

---

## 9. Referensi Feedback Konsultan

Feedback lengkap dari konsultan IT tersedia dalam dokumen terpisah. Ringkasan key points:

1. **Konsep inti:** TaniTech adalah platform koneksi, bukan marketplace
2. **Transaksi offline:** Perlu mekanisme validasi yang tepat
3. **Keamanan:** Setiap endpoint harus punya authorization check
4. **Harga:** Harus ada expiry mechanism
5. **Review:** Hanya dari transaksi yang dikonfirmasi
6. **Admin:** Perlu fitur moderasi dan audit

---

## 10. Catatan Perubahan dari Laporan Sebelumnya

| Tanggal     | Perubahan                                            |
| ----------- | ---------------------------------------------------- |
| 20 Sep 2026 | Laporan awal dibuat                                  |
| 20 Sep 2026 | Revisi berdasarkan feedback konsultan IT             |
| 20 Sep 2026 | ✅ P0 #1 Audit Authorization selesai                 |
| 20 Sep 2026 | ✅ P0 #2 Audit Database Integrity selesai            |
| 20 Sep 2026 | ✅ P0 #3 Validasi Sale Request & Transaction selesai |

## 10.1 Improvement Log (20 Sep 2026)

### Security Fixes

- **BuyerProfile Mass Assignment**: Sensitive fields dipindahkan ke `$guarded`
- **Rejection Reason**: Wajib disimpan untuk audit trail
- **responded_by**: Kolom transaksi di-rename dari `confirmed_by` untuk clarity

### Database Changes

- Migration: `add_rejection_fields_to_transactions_table` - added `rejection_reason`, renamed `confirmed_by` → `responded_by`
- Migration: `add_decline_reason_to_sale_requests_table` - added `decline_reason`

### UI Improvements

- Buyer Sales page: Form penolakan transaksi dengan dropdown alasan wajib
- Buyer Sales page: Form penolakan sale request dengan dropdown alasan wajib
- Buyer Sales page: Tampilkan alasan penolakan di riwayat

### Audit Reports

- [AUDIT-AUTHORIZATION.md](AUDIT-AUTHORIZATION.md) - Detail audit keamanan
- [AUDIT-DATABASE.md](AUDIT-DATABASE.md) - Detail audit database

---

## 11. TODO List (Updated)

### P0 - Critical ✅ SELESAI

- [x] Audit authorization & keamanan backend
- [x] Audit migration & integritas database
- [x] Pengujian seluruh alur transaksi offline
- [x] Validasi expiry harga 30 hari
- [x] Validasi aturan review & rating
- [x] Pengujian mobile responsive
- [x] Perbaikan error handling & empty state

### P1 - Important

- [ ] Admin moderasi laporan
- [ ] In-app notification
- [ ] Audit log
- [ ] Pengingat pembaruan harga
- [ ] Privacy Policy & Terms of Service
- [ ] Pengujian dengan data realistis
- [ ] Feature test untuk alur bisnis utama

### P2 - Nice to Have

- [ ] Riwayat harga
- [ ] Dashboard analytics
- [ ] Export PDF/Excel
- [ ] Email notification
- [ ] API documentation
- [ ] Chat internal

---

_Laporan ini diperbarui berdasarkan feedback konsultan IT pada 20 September 2026_
