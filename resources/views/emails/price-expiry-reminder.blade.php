<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pengingat Perbarui Harga</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #16a34a;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
        }
        .highlight {
            background-color: #fef3c7;
            border-left: 4px solid #eab308;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning {
            background-color: #fee2e2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .button {
            display: inline-block;
            background-color: #16a34a;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #15803d;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        .stat-box {
            text-align: center;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
            flex: 1;
            margin: 0 5px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #16a34a;
        }
        .stat-label {
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌱 TANI TECH</div>
            <p style="color: #6b7280; margin-top: 5px;">Connect. Compare. Trade.</p>
        </div>

        <h2 style="color: #1f2937;">Halo, {{ $buyerProfile->business_name }}!</h2>

        <p>Kami mengingatkan Anda untuk memperbarui harga komoditas Anda. Harga yang tidak diperbarui dalam waktu lama dapat mempengaruhi visibilitas profil Anda di platform.</p>

        <div class="stats">
            @if($staleCount > 0)
            <div class="stat-box">
                <div class="stat-number">{{ $staleCount }}</div>
                <div class="stat-label">Perlu Konfirmasi<br>(25-30 hari)</div>
            </div>
            @endif
            @if($expiredCount > 0)
            <div class="stat-box" style="background-color: #fef2f2;">
                <div class="stat-number" style="color: #dc2626;">{{ $expiredCount }}</div>
                <div class="stat-label">Kedaluwarsa<br>(>30 hari)</div>
            </div>
            @endif
        </div>

        @if($staleCount > 0)
        <div class="highlight">
            <strong>⚠️ Perhatian:</strong> Ada <strong>{{ $staleCount }}</strong> harga yang perlu dikonfirmasi dalam waktu 5 hari ke depan. Setelah 30 hari tanpa konfirmasi, harga akan ditandai sebagai kedaluwarsa.
        </div>
        @endif

        @if($expiredCount > 0)
        <div class="warning">
            <strong>🚨 Harga Kedaluwarsa:</strong> Ada <strong>{{ $expiredCount }}</strong> harga yang sudah kedaluwarsa. Harga ini tidak akan ditampilkan kepada petani sampai Anda memperbarui harganya.
        </div>
        @endif

        <p style="text-align: center;">
            <a href="{{ url('/buyer/prices') }}" class="button">Perbarui Harga Sekarang</a>
        </p>

        <p style="color: #6b7280; font-size: 14px;">
            Dengan memperbarui harga secara rutin, Anda membantu petani membuat keputusan yang lebih baik dan meningkatkan kepercayaan dalam bertransaksi.
        </p>

        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem TANI TECH.</p>
            <p>&copy; 2026 TANI TECH. Hak cipta dilindungi.</p>
            <p>
                <a href="{{ url('/privacy-policy') }}" style="color: #16a34a;">Kebijakan Privasi</a> |
                <a href="{{ url('/terms-of-service') }}" style="color: #16a34a;">Syarat & Ketentuan</a>
            </p>
        </div>
    </div>
</body>
</html>
