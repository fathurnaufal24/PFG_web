# PFG Portal

Portal web internal **PFG** untuk mengelola kelas: membuka penawaran kelas (*class offering*) ke guru, mengatur jadwal pertemuan, membuat *lesson plan*, sampai tahap laporan dan *parent meeting*. Ada tiga jenis pengguna: **admin**, **teacher** (guru), dan **student** (siswa).

README ini adalah **halaman utama dokumentasi**. Detail tiap bagian ada di folder [docs/](docs/).

> **Ingin memakai aplikasi, bukan mengembangkannya?** Langsung buka **[Panduan Pengguna (Guidebook)](docs/guidebook/README.md)**. Isinya langkah-langkah untuk admin, guru, dan siswa, beserta syarat tiap langkah.

---

## Daftar Isi Dokumentasi

Struktur folder dokumentasi:

```
docs/
├── guidebook/     # Panduan pemakaian aplikasi (untuk pengguna)
├── teknis/        # Dokumentasi teknis (untuk developer)
└── CHANGELOG.md   # Riwayat fitur & perbaikan aplikasi
```

### Guidebook — untuk pengguna aplikasi (`docs/guidebook/`)

Mulai dari [daftar isi Guidebook](docs/guidebook/README.md).

| No | File | Isi |
|----|------|-----|
| 1 | [Istilah & Hak Akses](docs/guidebook/01-istilah-dan-hak-akses.md) | Arti istilah, tahapan kelas, dan apa saja yang boleh dilakukan tiap peran |
| 2 | [Memulai & Mengenal Tampilan](docs/guidebook/02-memulai.md) | Daftar akun, masuk, lupa kata sandi, keluar, menu samping, notifikasi |
| 3 | [Panduan Admin](docs/guidebook/03-panduan-admin.md) | Settings, class offering, approve/reject guru, tambah kelas, Set Time |
| 4 | [Panduan Guru](docs/guidebook/04-panduan-guru.md) | Melamar offering, status lamaran, lesson plan, detail kelas |
| 5 | [Panduan Siswa](docs/guidebook/05-panduan-siswa.md) | Dashboard dan menu siswa |
| 6 | [Mengelola Profil](docs/guidebook/06-profil.md) | Data pribadi, kata sandi, hapus akun |
| 7 | [Ringkasan Alur](docs/guidebook/07-ringkasan-alur.md) | Urutan langkah lintas peran beserta syaratnya |
| 8 | [Pesan & Solusi](docs/guidebook/08-pesan-dan-solusi.md) | Arti pesan yang sering muncul dan cara mengatasinya |
| 9 | [Fitur Dalam Pengembangan](docs/guidebook/09-fitur-dalam-pengembangan.md) | Fitur yang datanya masih contoh |

### Dokumentasi teknis — untuk developer (`docs/teknis/`)

| No | File | Isi |
|----|------|-----|
| 1 | [Arsitektur & Setup](docs/teknis/01-arsitektur-dan-setup.md) | Teknologi yang dipakai, cara kerja Laravel + Inertia + React, struktur folder, cara menjalankan project, file konfigurasi |
| 2 | [Database & Model](docs/teknis/02-database-dan-model.md) | Semua tabel, kolom, relasi antar tabel (diagram), model Eloquent, seeder, factory |
| 3 | [Routes](docs/teknis/03-routes.md) | Daftar semua URL, method HTTP, controller yang dipanggil, dan siapa yang boleh akses |
| 4 | [Controller (Backend)](docs/teknis/04-controller-backend.md) | Penjelasan tiap controller dan method: apa yang divalidasi, apa yang disimpan, data apa yang dikirim ke halaman |
| 5 | [Frontend (React)](docs/teknis/05-frontend.md) | Halaman (Pages), Layout, Component, tipe TypeScript, state dan fungsi di tiap halaman |
| 6 | [Alur Fitur](docs/teknis/06-alur-fitur.md) | Alur bisnis dari awal sampai akhir: role, class offering → class management → jadwal → lesson plan, notifikasi, settings |
| 7 | [Testing](docs/teknis/07-testing.md) | Test yang ada dan cara menjalankannya |
| 8 | [Catatan & Masalah](docs/teknis/08-catatan-dan-masalah.md) | Bagian yang masih dummy, kode yang tidak terpakai, dan potensi bug yang perlu dicek |
| 9 | [Panduan Changelog](docs/teknis/09-panduan-changelog.md) | Aturan menulis entri changelog: label, format, template, contoh |
| — | [CHANGELOG](docs/CHANGELOG.md) | Riwayat fitur dan perbaikan aplikasi, ditulis untuk pengguna |

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

Penjelasan lengkap: [docs/teknis/01-arsitektur-dan-setup.md](docs/teknis/01-arsitektur-dan-setup.md).

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

Alur lengkap: [docs/teknis/06-alur-fitur.md](docs/teknis/06-alur-fitur.md).

---

## Peta File Cepat

| Lokasi | Isi | Dokumen |
|--------|-----|---------|
| `routes/web.php`, `routes/auth.php` | Daftar URL | [03-routes](docs/teknis/03-routes.md) |
| `app/Http/Controllers/` | Logika backend | [04-controller-backend](docs/teknis/04-controller-backend.md) |
| `app/Http/Middleware/HandleInertiaRequests.php` | Data yang dikirim ke semua halaman (user login, jumlah notifikasi, flash message) | [01-arsitektur](docs/teknis/01-arsitektur-dan-setup.md#data-global-shared-props) |
| `app/Http/Requests/` | Aturan validasi login & update profil | [04-controller-backend](docs/teknis/04-controller-backend.md#form-request) |
| `app/Models/` | Model Eloquent (representasi tabel) | [02-database](docs/teknis/02-database-dan-model.md) |
| `database/migrations/` | Struktur tabel | [02-database](docs/teknis/02-database-dan-model.md) |
| `database/seeders/`, `database/factories/` | Data dummy | [02-database](docs/teknis/02-database-dan-model.md#seeder) |
| `resources/js/Pages/` | Halaman React | [05-frontend](docs/teknis/05-frontend.md) |
| `resources/js/Layouts/`, `resources/js/Components/` | Layout & komponen UI | [05-frontend](docs/teknis/05-frontend.md) |
| `resources/js/types/` | Tipe TypeScript | [05-frontend](docs/teknis/05-frontend.md#tipe-typescript) |
| `tests/` | Test otomatis | [07-testing](docs/teknis/07-testing.md) |
| `bootstrap/app.php`, `config/`, `vite.config.js`, `tailwind.config.js` | Konfigurasi | [01-arsitektur](docs/teknis/01-arsitektur-dan-setup.md) |
| `public/images/` | Logo dan gambar | [05-frontend](docs/teknis/05-frontend.md#aset-gambar) |

---

## Cara Merawat Dokumentasi Ini

Setiap kali ada perubahan kode:

1. Tambahkan entri baru di **paling atas** [docs/CHANGELOG.md](docs/CHANGELOG.md), ikuti [Panduan Changelog](docs/teknis/09-panduan-changelog.md). Perubahan dokumentasi tidak perlu dicatat.
2. Kalau perubahannya menyentuh tabel, route, controller, atau halaman, perbarui dokumen yang bersangkutan di `docs/teknis/`.
3. Kalau perubahannya mengubah cara pemakaian (langkah, tombol, syarat, pesan yang tampil), perbarui juga file yang bersangkutan di `docs/guidebook/`.
4. Kalau ada bug yang diperbaiki dan tercatat di [08-catatan-dan-masalah.md](docs/teknis/08-catatan-dan-masalah.md), hapus item tersebut dari daftar.

Kontributor: `arrijalifal`, `fathurnaufal24`.
