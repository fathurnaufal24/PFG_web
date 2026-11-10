# 08 · Catatan & Masalah yang Perlu Dicek

[← Kembali ke README](../README.md)

Daftar hal yang ditemukan saat membuat dokumentasi (per 2026-11-10). Belum ada yang diperbaiki; daftar ini untuk membantu menentukan pekerjaan berikutnya. Hapus item dari daftar setelah diperbaiki, dan catat perbaikannya di [CHANGELOG](CHANGELOG.md).

## A. Potensi Bug

| # | Lokasi | Masalah | Dampak |
|---|--------|---------|--------|
| A1 | `routes/web.php` baris 53–80 | 7 route menunjuk method yang **tidak ada** di `ClassManagementController`: `approve`, `reject`, `enrollStudent`, `addStudent`, `approveStudent`, `rejectStudent`, `removeStudent` | Error 500 jika URL tersebut dipanggil. Akibatnya juga belum ada cara memasukkan siswa ke kelas. |
| A2 | `ProfileController@update` | Untuk admin, kode mengupdate kolom `name` di tabel `curricula`, padahal tabel itu hanya punya `first_name` & `last_name` | Admin kemungkinan error saat menyimpan profil |
| A3 | `resources/js/Components/Sidebar.tsx` baris 1 | `import logoPFG from './logo-sidebar.png'` — file ini tidak ada di folder `Components/` (gambar aslinya di `public/images/`). Variabel `logoPFG` juga tidak dipakai. | Bisa menyebabkan error saat `npm run build`/`npm run dev`. Jika iya, hapus baris ini. |
| A4 | Migration `class_management`, `class_offerings` | Kolom `period` bertipe **integer**, tapi validasi controller menerima string (`'string|max:50'`) dan test/factory memakai `'2026-Q1'` | Di SQLite masih jalan, tapi di MySQL nilai seperti `2026-Q3` akan gagal/terpotong |
| A5 | `ClassManagementController@update` | Mengubah `period`/`order`/course tidak mengubah `id` kelas | ID kelas bisa tidak sesuai lagi dengan isinya |
| A6 | `ClassManagementController@storeLessonPlan` | Backend tidak mengecek apakah kelas sudah punya jadwal (hanya dicek di frontend) | Lesson plan bisa dibuat lewat request langsung sebelum Set Time |
| A7 | `ClassManagementSeeder` | Kombinasi acak period (1–4) × order (1–10) per course bisa menghasilkan ID yang sama | Seeder bisa gagal di tengah jalan |
| A8 | Model `Student` | `$fillable` berisi `first_name`, `last_name`, `pob`, `dob`, `domicile`, `card_number`, padahal tabel `students` hanya punya `name` | Error jika kolom tersebut diisi |
| A9 | Migration `available_courses` | `up()` membuat tabel `course_student`, tapi `down()` tidak menghapusnya | `migrate:rollback` meninggalkan tabel `course_student` |
| A10 | `types/index.d.ts` → `CurriculumProps` | Mendefinisikan `name`, padahal tabel punya `first_name`/`last_name` | Tipe tidak sesuai data asli |

## B. Fitur yang Masih Dummy (data tertulis di kode)

| Bagian | File | Yang dummy |
|--------|------|-----------|
| Detail kelas | `ClassManagementController::classroomPayload()` | Daftar siswa, absensi, riwayat sesi, laporan, parent meeting, link kelas |
| Detail kelas | `ClassManagement/Show.tsx` | Tambah siswa, ubah absensi, upload laporan, buat PM hanya mengubah state lokal |
| Dashboard teacher | `Dashboard.tsx` | Tabel Pending Attendance, rating bintang |
| Revenue | `Revenue/Index.tsx` | Seluruh halaman |
| My Schedule | `Schedule/Index.tsx` | Seluruh halaman (kalender statis Agustus 2026) |
| Module | `Module/Index.tsx` | Seluruh halaman (gambar dari `via.placeholder.com`) |
| Parent Meeting | `ParentMeeting/Index.tsx` | Seluruh halaman |
| Welcome | `Welcome.tsx` | Teks isi (`placeholderText`), link navbar `href="#"` |

Status kelas `report`, `pm`, `ended` belum bisa dicapai lewat aplikasi (belum ada endpoint untuk pindah tahap).

## C. Kode/File yang Tidak Terpakai

| File | Keterangan |
|------|-----------|
| `app/Http/Controllers/CourseController.php` | Tidak punya route; merender halaman `Course/...` yang sudah dihapus; memakai relasi `Course->teacher` yang tidak ada |
| `app/Http/Controllers/AvailableCourseController.php`, `ClassScheduleController.php`, `LessonPlanController.php`, `ScheduleController.php`, `CourseTabController.php` | Kosong |
| `app/Policies/CoursePolicy.php.backup` | Cadangan, tidak aktif |
| `resources/js/Pages/Profile/Edit.tsx.backup` | Cadangan versi lama halaman profil |
| `resources/js/Pages/Profile/Partials/*` | Komponen Breeze yang tidak dipakai lagi oleh `Edit.tsx` |
| `resources/js/Pages/ClassManagement/SetTeacherId.tsx` | Tidak dirender controller mana pun |
| Model `AvailableCourse`, `CourseMeeting`, `Attendance`, `MoodTracker`, `CourseInterest`, `Book`, `Revenue`, `Module`, `ParentMeeting` + tabelnya | Belum dipakai (lihat [02-database](02-database-dan-model.md#tabel-yang-belum-dipakai)) |
| `database/seeders/TeacherSeeder.php` | Kosong |
| Kolom `class_management.planned` | Diisi seeder, tidak dibaca kode |
| Field `start_this_week` di Set Time | Divalidasi tapi tidak dipakai |
| Endpoint `/classmanagement/{id}/can-start-lesson` | Ada, tapi tidak dipanggil frontend |
| `User::ROLES` berisi `curriculum` | Role ini tidak dipakai; admin memakai role `admin` |
| `use App\Models\ClassManagement`, `use App\Models\Teacher` di `routes/web.php` | Import tidak dipakai |

## D. Catatan Keamanan

- Password akun dummy ada di `UserSeeder.php`. Aman untuk lokal, tapi **jangan jalankan seeder ini di server produksi**.
- `bootstrap/app.php`: jika `APP_ENV=local`, semua host diterima. Pastikan `APP_ENV=production` saat dibuka ke internet.
- Hak akses masih dicek manual per method. Pertimbangkan Policy/Gate Laravel agar pengecekan tidak terlewat saat menambah method baru.

## E. Catatan Lain

- `catatan.txt` (belum di-commit) berisi ide: *"display chart: apexcharts.com"* — kemungkinan untuk grafik di Dashboard/Revenue.
- `public/build/` di-ignore oleh `.gitignore`, jadi perlu `npm run build` saat deploy.
