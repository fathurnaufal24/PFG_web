# 01 · Arsitektur & Setup

[← Kembali ke README](../../README.md)

## Teknologi

| Bagian | Teknologi | Versi (dari `composer.json` / `package.json`) |
|--------|-----------|------------------------------------------------|
| Bahasa backend | PHP | ^8.2 |
| Framework backend | Laravel | ^13.0 |
| Penghubung | Inertia.js (`inertiajs/inertia-laravel`, `@inertiajs/react`) | ^2.0 |
| Nama route di JS | Ziggy (`tightenco/ziggy`) – fungsi `route('nama.route')` di React | ^2.6 |
| Frontend | React + React DOM | ^18.2 |
| Bahasa frontend | TypeScript | ^5.0 |
| Styling | Tailwind CSS + `@tailwindcss/forms` | ^3.2 |
| Ikon | `lucide-react`, `react-icons` | – |
| Komponen UI | `@headlessui/react` (dipakai di Modal/Dropdown bawaan Breeze) | ^2.0 |
| Build | Vite + `laravel-vite-plugin` + `@vitejs/plugin-react` | ^6 |
| Testing | Pest + `pest-plugin-laravel` | ^4.1 |
| Debug | `fruitcake/laravel-debugbar` (toolbar debug saat development) | ^4.4 |
| Lain-lain | Laravel Sanctum (terpasang, belum dipakai), Pail (log realtime), Pint (formatter PHP) | – |

## Cara Kerja Singkat (Laravel + Inertia + React)

Project ini **tidak** memakai REST API terpisah. Alurnya:

```
Browser ──request──▶ routes/web.php ──▶ Controller (PHP)
                                          │
                                          │ Inertia::render('NamaHalaman', [props])
                                          ▼
                     resources/views/app.blade.php  (satu-satunya file Blade)
                                          │
                                          ▼
                     resources/js/app.tsx  ──▶ resources/js/Pages/NamaHalaman.tsx
                                               (menerima props sebagai parameter komponen)
```

- Controller memanggil `Inertia::render('ClassManagement/Index', [...])`. String `'ClassManagement/Index'` = file `resources/js/Pages/ClassManagement/Index.tsx`.
- Array kedua menjadi **props** komponen React.
- Saat user klik tombol/submit form, React memanggil `router.post(...)`, `router.put(...)`, `router.delete(...)` (dari `@inertiajs/react`). Controller lalu biasanya `redirect()` balik dengan pesan `->with('success', '...')`, dan Inertia memuat ulang props tanpa reload halaman penuh.
- Beberapa endpoint mengembalikan JSON biasa (contoh: `/notifications/unread-count`, `/classmanagement/{id}/schedule`).

## Struktur Folder

```
PFG_web/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Logika tiap fitur (lihat 04-controller-backend.md)
│   │   │   └── Auth/             # Login, register, reset password (bawaan Breeze, sebagian diubah)
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php   # Data global ke semua halaman
│   │   └── Requests/             # Aturan validasi (LoginRequest, ProfileUpdateRequest)
│   ├── Models/                   # Model Eloquent (lihat 02-database-dan-model.md)
│   ├── Policies/
│   │   └── CoursePolicy.php.backup  # File cadangan, tidak aktif
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   ├── app.php                   # Registrasi route, middleware, trusted host/proxy
│   └── providers.php
├── config/                       # Konfigurasi Laravel (sebagian besar bawaan)
├── database/
│   ├── migrations/               # Struktur tabel
│   ├── seeders/                  # Data dummy
│   └── factories/                # Pembuat data palsu untuk test
├── public/
│   ├── images/                   # Logo & gambar statis
│   └── build/                    # Hasil `npm run build` (di-ignore git)
├── resources/
│   ├── css/app.css               # Import Tailwind + gaya dasar tema (body, input)
│   ├── js/
│   │   ├── app.tsx               # Titik awal React/Inertia
│   │   ├── bootstrap.ts          # Setup axios
│   │   ├── Components/           # Komponen UI kecil
│   │   ├── Layouts/              # Kerangka halaman
│   │   ├── Pages/                # Halaman (1 file = 1 halaman)
│   │   └── types/                # Tipe TypeScript
│   └── views/app.blade.php       # HTML dasar tempat React dipasang
├── routes/
│   ├── web.php                   # Route utama aplikasi
│   ├── auth.php                  # Route login/register/password
│   └── console.php               # Perintah artisan `inspire` (bawaan)
├── tests/                        # Test Pest
├── catatan.txt                   # Catatan pribadi (belum di-commit): "display chart: apexcharts.com"
└── docs/                         # Dokumentasi
    ├── guidebook/                # Panduan pemakaian untuk pengguna
    ├── teknis/                   # Dokumentasi teknis (folder ini)
    └── CHANGELOG.md              # Log perubahan
```

## Menjalankan Project

### Pertama kali

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
```

### Setiap kali development

```bash
composer run dev
```

Perintah ini (didefinisikan di `composer.json` → `scripts.dev`) menjalankan 4 proses sekaligus lewat `concurrently`:

| Nama | Perintah | Fungsi |
|------|----------|--------|
| server | `php artisan serve` | Server PHP di `http://localhost:8000` |
| queue | `php artisan queue:listen --tries=1` | Memproses antrian job |
| logs | `php artisan pail --timeout=0` | Menampilkan log realtime |
| vite | `npm run dev` | Hot reload untuk React/Tailwind |

### Script lain

| Perintah | Fungsi |
|----------|--------|
| `npm run build` | Cek tipe TypeScript (`tsc`) lalu build produksi ke `public/build` |
| `npm run lint` | ESLint + auto-fix di `resources/js` |
| `php artisan test` atau `./vendor/bin/pest` | Menjalankan test |
| `php artisan migrate:fresh --seed` | Hapus semua tabel, buat ulang, isi data dummy |

## File Konfigurasi Penting

### `bootstrap/app.php`

- Mendaftarkan `routes/web.php`, `routes/console.php`, dan health check di `/up`.
- `trustProxies(at: '*')` → percaya semua proxy (dibutuhkan saat diakses lewat Tailscale Funnel).
- `trustHosts`:
  - Jika `APP_ENV=local` → semua host diterima (`^.*$`).
  - Selain itu → hanya host `arrijal-ifal-ideapad.taildef515.ts.net` (alamat Tailscale).
- Menambahkan middleware `HandleInertiaRequests` dan `AddLinkHeadersForPreloadedAssets` ke grup `web`.

### `app/Providers/AppServiceProvider.php`

- Jika header `X-Forwarded-Proto` = `https`, semua URL dipaksa `https` (`URL::forceScheme('https')`). Ini agar link tetap benar saat diakses lewat proxy HTTPS.
- `Vite::prefetch(concurrency: 3)` → browser memuat aset halaman lain di latar belakang.

### `vite.config.js`

- Entry point: `resources/js/app.tsx`.
- Ada blok `server` yang di-comment, berisi setting host/HMR untuk development dari jaringan lain (IP Tailscale `100.100.166.63` atau LAN `192.168.1.17`). Uncomment jika perlu akses Vite dari perangkat lain.

### `tailwind.config.js`

- Memindai file `.blade.php` dan `.tsx` di `resources/`.
- Font utama: **Figtree**.
- Animasi tambahan: `marquee` (geser horizontal, dipakai di halaman Welcome).

### `resources/views/app.blade.php`

Satu-satunya file Blade. Memuat font Figtree dari `fonts.bunny.net`, directive `@routes` (Ziggy), `@vite`, dan `@inertia` (tempat React dirender).

### `resources/js/app.tsx`

- Judul tab browser: `"{judul halaman} - {VITE_APP_NAME}"`.
- Mencari komponen halaman di `./Pages/**/*.tsx` berdasarkan nama yang dikirim controller.
- Warna progress bar loading Inertia: `#4B5563`.

### `.env.example`

Nilai penting: `APP_ENV=local`, `DB_CONNECTION=sqlite`, `APP_LOCALE=en`. Untuk MySQL, isi `DB_HOST`, `DB_PORT`, dst.

## Data Global (Shared Props)

File: `app/Http/Middleware/HandleInertiaRequests.php`

Method `share()` mengirim data berikut ke **semua** halaman React (bisa diakses dengan `usePage().props`):

| Prop | Isi |
|------|-----|
| `auth.user` | User yang sedang login. Relasinya ikut dimuat sesuai role: `teacher` → `user.teacher`, `admin` → `user.curriculum`, `student` → `user.student`. `null` jika belum login. |
| `unreadCount` | Jumlah notifikasi yang belum dibaca milik user (selalu `0` untuk admin). Dipakai untuk badge di Sidebar. |
| `flash.success` | Pesan sukses dari `->with('success', ...)` di controller |
| `flash.error` | Pesan error dari `->with('error', ...)` di controller |
| `ziggy` (dari Ziggy) | Daftar route agar fungsi `route()` bisa dipakai di React |

Tipe TypeScript untuk props ini ada di `resources/js/types/index.d.ts` → `PageProps`.
