# PFG Portal

Portal web internal **PFG** untuk mengelola kelas: membuka penawaran kelas (*class offering*) ke guru, mengatur jadwal pertemuan, membuat *lesson plan*, sampai tahap laporan dan *parent meeting*. Ada tiga jenis pengguna: **admin**, **teacher** (guru), dan **student** (siswa).

README ini adalah **halaman utama dokumentasi**. Detail tiap bagian ada di folder [docs/](docs/).

---

## Daftar Isi Dokumentasi

| No | File | Isi |
|----|------|-----|
| 1 | [Arsitektur & Setup](docs/01-arsitektur-dan-setup.md) | Teknologi yang dipakai, cara kerja Laravel + Inertia + React, struktur folder, cara menjalankan project, file konfigurasi |
| 2 | [Database & Model](docs/02-database-dan-model.md) | Semua tabel, kolom, relasi antar tabel (diagram), model Eloquent, seeder, factory |
| 3 | [Routes](docs/03-routes.md) | Daftar semua URL, method HTTP, controller yang dipanggil, dan siapa yang boleh akses |
| 4 | [Controller (Backend)](docs/04-controller-backend.md) | Penjelasan tiap controller dan method: apa yang divalidasi, apa yang disimpan, data apa yang dikirim ke halaman |
| 5 | [Frontend (React)](docs/05-frontend.md) | Halaman (Pages), Layout, Component, tipe TypeScript, state dan fungsi di tiap halaman |
| 6 | [Alur Fitur](docs/06-alur-fitur.md) | Alur bisnis dari awal sampai akhir: role, class offering → class management → jadwal → lesson plan, notifikasi, settings |
| 7 | [Testing](docs/07-testing.md) | Test yang ada dan cara menjalankannya |
| 8 | [Catatan & Masalah](docs/08-catatan-dan-masalah.md) | Bagian yang masih dummy, kode yang tidak terpakai, dan potensi bug yang perlu dicek |
| 9 | [CHANGELOG](docs/CHANGELOG.md) | Log perubahan: file apa yang ditambah, diubah, atau dihapus di setiap commit |

> **Mau cari file tertentu?** Lihat [Peta File](#peta-file-cepat) di bawah, lalu klik dokumen yang membahasnya.

---

## Teknologi Singkat

- **Backend:** Laravel 13 (PHP ≥ 8.2)
- **Penghubung backend–frontend:** Inertia.js v2 (tidak ada REST API terpisah; controller langsung mengirim data ke halaman React)
- **Frontend:** React 18 + TypeScript, Tailwind CSS 3, ikon dari `lucide-react`
- **Build tool:** Vite 6
- **Database default:** SQLite (`database/database.sqlite`)
- **Testing:** Pest 4
- **Starter kit:** Laravel Breeze (fitur login/register/reset password berasal dari sini lalu dimodifikasi)

Penjelasan lengkap: [docs/01-arsitektur-dan-setup.md](docs/01-arsitektur-dan-setup.md).

---

## Menjalankan Project (Ringkas)

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed     # buat tabel + isi data dummy
composer run dev               # menjalankan server, queue, log, dan Vite sekaligus
```

Lalu buka `http://localhost:8000`.

### Akun Dummy (dari `UserSeeder`)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@localhost.com` | `admin123` |
| Teacher | `teacher1@localhost.com` / `teacher2@...` / `teacher3@...` | `teacher123` |
| Student | `student1@localhost.com` / `student2@...` / `student3@...` | `student123` |

> Akun ini hanya untuk development lokal. Jangan dipakai di server produksi.

---

## Fitur Utama per Role

| Fitur | Admin | Teacher | Student |
|-------|:-----:|:-------:|:-------:|
| Dashboard (isi berbeda per role) | ✅ statistik | ✅ performa | ✅ kelas saya |
| Class Offering – buat/edit/hapus/approve | ✅ | – | – |
| Class Offering – apply (melamar) | – | ✅ | – |
| Class Management – lihat | semua kelas | kelas miliknya | – |
| Class Management – buat kelas | ✅ | ✅ (otomatis jadi miliknya) | – |
| Class Management – edit/hapus | ✅ | – | – |
| Set Time (buat jadwal mingguan) | ✅ | – | – |
| Lesson Plan | – | ✅ | – |
| Notifikasi | – | ✅ | ✅ |
| Settings (maks. siswa per tipe kelas) | ✅ | – | – |
| Revenue, Schedule, Module, Parent Meeting | tampilan dummy | tampilan dummy | sebagian |

Alur lengkap: [docs/06-alur-fitur.md](docs/06-alur-fitur.md).

---

## Peta File Cepat

| Lokasi | Isi | Dokumen |
|--------|-----|---------|
| `routes/web.php`, `routes/auth.php` | Daftar URL | [03-routes](docs/03-routes.md) |
| `app/Http/Controllers/` | Logika backend | [04-controller-backend](docs/04-controller-backend.md) |
| `app/Http/Middleware/HandleInertiaRequests.php` | Data yang dikirim ke semua halaman (user login, jumlah notifikasi, flash message) | [01-arsitektur](docs/01-arsitektur-dan-setup.md#data-global-shared-props) |
| `app/Http/Requests/` | Aturan validasi login & update profil | [04-controller-backend](docs/04-controller-backend.md#form-request) |
| `app/Models/` | Model Eloquent (representasi tabel) | [02-database](docs/02-database-dan-model.md) |
| `database/migrations/` | Struktur tabel | [02-database](docs/02-database-dan-model.md) |
| `database/seeders/`, `database/factories/` | Data dummy | [02-database](docs/02-database-dan-model.md#seeder) |
| `resources/js/Pages/` | Halaman React | [05-frontend](docs/05-frontend.md) |
| `resources/js/Layouts/`, `resources/js/Components/` | Layout & komponen UI | [05-frontend](docs/05-frontend.md) |
| `resources/js/types/` | Tipe TypeScript | [05-frontend](docs/05-frontend.md#tipe-typescript) |
| `tests/` | Test otomatis | [07-testing](docs/07-testing.md) |
| `bootstrap/app.php`, `config/`, `vite.config.js`, `tailwind.config.js` | Konfigurasi | [01-arsitektur](docs/01-arsitektur-dan-setup.md) |
| `public/images/` | Logo dan gambar | [05-frontend](docs/05-frontend.md#aset-gambar) |

---

## Cara Merawat Dokumentasi Ini

Setiap kali ada perubahan kode:

1. Tambahkan entri baru di **paling atas** [docs/CHANGELOG.md](docs/CHANGELOG.md) (pakai format yang ada di file itu: *Ditambahkan / Diubah / Dihapus*).
2. Kalau perubahannya menyentuh tabel, route, controller, atau halaman, perbarui juga dokumen kategori yang bersangkutan.
3. Kalau ada bug yang diperbaiki dan tercatat di [08-catatan-dan-masalah.md](docs/08-catatan-dan-masalah.md), hapus atau coret dari daftar.

Kontributor: `arrijalifal`, `fathurnaufal24`.
