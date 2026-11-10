# CHANGELOG — Log Perubahan

[← Kembali ke README](../README.md)

Catatan semua perubahan kode: file apa yang **ditambahkan**, **diubah**, atau **dihapus**. Entri terbaru di paling atas.

## Cara Menambah Entri

Salin template ini ke **bawah garis ini** (di atas entri terbaru), lalu isi:

```markdown
## YYYY-MM-DD — Judul singkat perubahan
**Commit:** `abc1234` · **Oleh:** nama

Ringkasan 1–2 kalimat: apa yang berubah dan kenapa.

**Ditambahkan**
- `path/file` — keterangan

**Diubah**
- `path/file` — keterangan

**Dihapus**
- `path/file` — keterangan
```

Tips: lihat daftar file yang berubah di commit terakhir dengan `git show --name-status HEAD`. Kode: `A` = ditambahkan, `M` = diubah, `D` = dihapus, `R` = di-rename.

---

## 2026-11-10 — Dokumentasi project
**Commit:** (belum di-commit) · **Oleh:** Claude (atas permintaan arrijalifal)

Membuat dokumentasi lengkap project. README template Laravel diganti.

**Ditambahkan**
- `docs/01-arsitektur-dan-setup.md` — teknologi, struktur folder, cara menjalankan, konfigurasi
- `docs/02-database-dan-model.md` — tabel, kolom, relasi, model, seeder, factory
- `docs/03-routes.md` — daftar semua route
- `docs/04-controller-backend.md` — penjelasan tiap controller & method
- `docs/05-frontend.md` — halaman, layout, komponen, tipe TypeScript
- `docs/06-alur-fitur.md` — alur bisnis per fitur
- `docs/07-testing.md` — daftar test
- `docs/08-catatan-dan-masalah.md` — potensi bug, fitur dummy, kode tidak terpakai
- `docs/CHANGELOG.md` — file ini

**Diubah**
- `README.md` — template Laravel diganti menjadi halaman utama dokumentasi

---

## 2026-10-10 — Perbaikan Class Offering & halaman Settings
**Commit:** `7364b04` · **Oleh:** arrijalifal

Kapasitas siswa per tipe kelas kini diatur admin lewat halaman Settings, bukan diisi manual.

**Ditambahkan**
- `app/Http/Controllers/SettingController.php` — halaman & simpan pengaturan
- `app/Models/ClassTypeSetting.php` — model + `maxStudentFor()`
- `database/migrations/2026_10_10_000000_create_class_type_settings_table.php` — tabel + data awal (trial 5, regular 8, private 1)
- `resources/js/Pages/Setting/Index.tsx` — halaman Settings

**Diubah**
- `app/Http/Controllers/ClassManagementController.php`, `ClassOfferingController.php` — `student` diisi dari `ClassTypeSetting`
- `resources/js/Components/Sidebar.tsx` — menu Settings untuk admin
- `resources/js/Pages/ClassManagement/Index.tsx`, `ClassOffering/Index.tsx`
- `routes/web.php` — route `/settings`, `/settings/class-types`

## 2026-10-07 — ID kelas berdasarkan period & order
**Commit:** `f660c44` · **Oleh:** arrijalifal

Primary key `class_management` diganti dari angka menjadi teks `{subject}-{period}.{order}`.

**Diubah**
- `app/Models/ClassManagement.php` — event `creating` pembuat ID, key string
- `database/migrations/2026_05_22_083151_create_class_management_table.php` — `id` jadi string primary
- `database/migrations/2026_08_20_080845_create_lesson_plans_table.php`, `2026_08_23_115207_create_class_schedules_table.php`, `2026_10_06_165925_create_class_students_table.php` — foreign key ikut jadi string
- `app/Http/Controllers/ClassManagementController.php`, `resources/js/Pages/ClassManagement/Index.tsx`, `Show.tsx` — format tampilan subject

## 2026-10-07 — Akun dummy student
**Commit:** `4220175` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Models/ClassStudent.php` — tabel penghubung siswa ↔ kelas
- `database/migrations/2026_10_06_165925_create_class_students_table.php`

**Diubah**
- `app/Models/ClassManagement.php`, `app/Models/Student.php` — relasi siswa ↔ kelas
- `app/Http/Controllers/DashboardController.php`, `resources/js/Pages/Dashboard.tsx` — dashboard student
- `database/seeders/UserSeeder.php` — 3 akun student
- `resources/js/Components/Sidebar.tsx` — menu khusus student
- `routes/web.php` — route enroll & manajemen siswa (method controller belum dibuat)

## 2026-10-06 — Ganti alert jadi modal di Class Offering
**Commit:** `b90df18` · **Oleh:** arrijalifal

**Diubah**
- `resources/js/Pages/ClassOffering/Index.tsx` — modal konfirmasi approve/reject/delete & apply
- `resources/js/Pages/ClassManagement/Index.tsx`
- `app/Http/Controllers/ClassManagementController.php`, `ClassOfferingController.php`
- `app/Http/Middleware/HandleInertiaRequests.php` — flash `success`/`error`
- `resources/js/types/index.d.ts` — tipe `flash`

## 2026-10-04 — Sesi dinamis per kelas
**Commit:** `01cafc2` · **Oleh:** arrijalifal

**Ditambahkan**
- `storage/debugbar/.gitignore` — untuk Laravel Debugbar

**Diubah**
- `app/Http/Controllers/ClassManagementController.php` — daftar sesi di halaman detail dari `class_schedules`
- `resources/js/Pages/ClassManagement/Show.tsx`
- `composer.json`, `composer.lock`, `package-lock.json` — tambah debugbar

## 2026-09-15 — Update Class Management & test
**Commit:** `df13651`, `67ca609` · **Oleh:** fathurnaufal24

**Ditambahkan**
- `tests/Feature/ClassManagement/ClassManagementAccessTest.php` — 7 test Class Management

**Diubah**
- `app/Http/Controllers/ClassManagementController.php`, `resources/js/Pages/ClassManagement/Index.tsx`, `Show.tsx`
- `app/Http/Controllers/Auth/AuthenticatedSessionController.php`, `RegisteredUserController.php` — register dengan role
- `app/Models/Course.php`, `app/Models/Student.php`
- `database/factories/ClassManagementFactory.php`, `CourseFactory.php`, `UserFactory.php`
- `resources/js/Components/Sidebar.tsx`, `resources/js/Layouts/AuthenticatedLayout.tsx`
- `routes/web.php`, `phpunit.xml`, `tests/Feature/Auth/RegistrationTest.php`

## 2026-08-29 — Perbaikan approval offering & Set Time
**Commit:** `58aa436` · **Oleh:** arrijalifal

**Diubah**
- `app/Http/Controllers/ClassManagementController.php`, `ClassOfferingController.php`
- Migration `class_management`, `class_offerings`, `class_offering_teacher`

## 2026-08-26 — Perbaikan error Class Offering
**Commit:** `fd2d0b1` · **Oleh:** arrijalifal

Kolom preferensi digabung langsung ke migration utama.

**Diubah**
- `app/Http/Controllers/ClassOfferingController.php`, `resources/js/Pages/ClassOffering/Index.tsx`
- Migration `class_management`, `class_offerings`, `class_offering_teacher` — tambah kolom preferensi

**Dihapus**
- `database/migrations/2026_08_23_125430_add_preferences_to_class_offerings_and_class_offering_teacher.php`
- `database/migrations/2026_08_23_125648_add_preferred_fields_to_class_management.php`

## 2026-08-25 — Preferensi waktu & jadwal kelas
**Commit:** `ae0f019` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Models/ClassSchedule.php`, `app/Http/Controllers/ClassScheduleController.php` (kosong)
- `database/migrations/2026_08_23_115207_create_class_schedules_table.php`
- 2 migration tambahan kolom preferensi (dihapus lagi di `fd2d0b1`)

**Diubah**
- `ClassManagementController.php` — `setTime`, `getSchedule`, `canStartLessonPlan`
- `ClassOfferingController.php`, model `ClassManagement`, `ClassOffering`, `ClassOfferingTeacher`
- `resources/js/Pages/ClassManagement/Index.tsx`, `ClassOffering/Index.tsx`, `routes/web.php`

## 2026-08-22 — Perbaikan profil teacher
**Commit:** `686223c` · **Oleh:** arrijalifal

**Diubah**
- `app/Http/Controllers/ProfileController.php`, `app/Http/Middleware/HandleInertiaRequests.php` — muat relasi sesuai role
- `resources/js/Pages/Profile/Edit.tsx`

## 2026-08-22 — Perbaikan edit kelas tidak muncul
**Commit:** `211ee76` · **Oleh:** arrijalifal

**Diubah**
- `resources/js/Pages/ClassManagement/Index.tsx`

## 2026-08-22 — Desain ulang Login & Register
**Commit:** `ccfadc4` · **Oleh:** arrijalifal

**Ditambahkan**
- `resources/js/Pages/Auth/background-halaman-login.jpg`

**Diubah**
- `resources/js/Pages/Auth/Login.tsx`, `Register.tsx`

## 2026-08-22 — Tombol Start Lesson untuk teacher
**Commit:** `b91cc4a` · **Oleh:** arrijalifal

**Diubah**
- `ClassManagementController.php` — `storeLessonPlan`
- `app/Models/LessonPlan.php`, `resources/js/Pages/ClassManagement/Index.tsx`, `routes/web.php`

## 2026-08-20 — Model Lesson Plan
**Commit:** `d127599` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Models/LessonPlan.php`, `app/Http/Controllers/LessonPlanController.php` (kosong)
- `database/migrations/2026_08_20_080845_create_lesson_plans_table.php`
- `resources/js/Pages/ClassManagement/Show.tsx` — halaman detail kelas

**Diubah**
- `app/Models/ClassManagement.php`, migration `class_management`, `UserSeeder.php`

**Dihapus**
- `resources/js/Pages/ClassManagement/CourseShow.tsx` — diganti `Show.tsx`

## 2026-08-18 — Badge notifikasi untuk Class Offering
**Commit:** `9280f1f` · **Oleh:** arrijalifal

**Diubah**
- `NotificationController.php`, `HandleInertiaRequests.php` — `unreadCount`
- `Sidebar.tsx`, `ClassOffering/Index.tsx`, `Notification/Index.tsx`, `routes/web.php`

## 2026-08-18 — Akses lewat Tailscale Funnel
**Commit:** `bcf252e` · **Oleh:** arrijalifal

**Diubah**
- `bootstrap/app.php` — trusted proxy & host
- `app/Providers/AppServiceProvider.php` — paksa HTTPS di belakang proxy
- `resources/js/Pages/ClassManagement/CourseShow.tsx`, `resources/js/types/index.d.ts`

## 2026-08-18 — Class Offering awal
**Commit:** `fc270d4` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Models/ClassOfferingTeacher.php`
- `database/migrations/2026_08_15_073428_create_class_offering_teacher.php`

**Diubah**
- `ClassOfferingController.php`, `NotificationController.php`, model `ClassOffering`, `Notification`
- Migration `class_offerings`, `notifications`
- `resources/js/Pages/ClassOffering/Index.tsx`, `routes/web.php`

## 2026-08-13 — Konfigurasi database & npm
**Commit:** `001ab4c` · **Oleh:** arrijalifal

**Diubah**
- `config/database.php`, `package.json` (`allowScripts`), `package-lock.json`

## 2026-08-13 — Layout halaman profil
**Commit:** `99811c3` · **Oleh:** arrijalifal

**Diubah**
- `resources/js/Layouts/AuthenticatedLayout.tsx`, `resources/js/Pages/Profile/Edit.tsx`

## 2026-08-06 — Edit kelas, dropdown course, tombol profil
**Commit:** `a5ef48e`, `989f0c2`, `1489de3` · **Oleh:** arrijalifal

**Diubah**
- `ClassManagementController.php`, `ClassManagement/Index.tsx` — dropdown course & edit per baris
- `UserSeeder.php`
- `Sidebar.tsx` — tombol profil

## 2026-08-03 — Class Management terhubung ke database
**Commit:** `b129f77`, `14a6d78`, `82f8944` · **Oleh:** arrijalifal

Data kelas diambil dari database, dashboard dipisah per role, teacher hanya melihat kelasnya sendiri.

**Ditambahkan**
- `database/seeders/ClassManagementSeeder.php`

**Diubah**
- `ClassManagementController.php`, `app/Models/ClassManagement.php`
- Migration `curricula`, `class_management`
- `UserSeeder.php`, `ClassManagement/Index.tsx`, `routes/web.php`
- `DashboardController.php`, `Dashboard.tsx`

## 2026-07-30 — Upgrade ke Laravel 13
**Commit:** `475e36d` · **Oleh:** arrijalifal

**Diubah**
- `composer.json`, `composer.lock`

## 2026-06-04 — Kolom performance teacher
**Commit:** `3d14a83` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Http/Controllers/DashboardController.php`

**Diubah**
- `app/Models/Teacher.php`, migration `teachers` — kolom `performance`
- `UserSeeder.php`, `Dashboard.tsx`, `resources/js/types/index.d.ts`, `routes/web.php`

## 2026-05-29 — Logout
**Commit:** `8bd6d69` · **Oleh:** arrijalifal

**Diubah**
- `resources/js/Components/Sidebar.tsx` — tombol logout

## 2026-05-28 — Halaman-halaman baru (konversi JS ke TSX)
**Commit:** `4da8dfe` · **Oleh:** arrijalifal

**Ditambahkan**
- Controller: `ClassOfferingController`, `ModuleController`, `NotificationController`, `ParentMeetingController`
- Model + factory: `ClassOffering`, `Module`, `Notification`, `ParentMeeting`
- Migration: `modules`, `class_offerings`, `notifications`, `parent_meetings`
- Halaman: `ClassOffering/Index.tsx`, `Module/Index.tsx`, `Notification/Index.tsx`, `ParentMeeting/Index.tsx`, `Revenue/Index.tsx`, `Schedule/Index.tsx`

**Diubah**
- `RevenueController.php`, `routes/web.php`

**Dihapus**
- `ClassOffering/ClassOffering.tsx`, `Module/ModuleIndex.tsx`, `Revenue/RevenueIndex.tsx`, `Schedule/ScheduleIndex.tsx` — diganti versi `Index.tsx`

## 2026-05-22 — Integrasi React & Class Management
**Commit:** `8476441`, `6af1db4` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Http/Controllers/AvailableCourseController.php`, `ClassManagementController.php`
- `app/Models/ClassManagement.php`, `database/factories/ClassManagementFactory.php`
- `database/migrations/2026_05_22_083151_create_class_management_table.php`
- `resources/js/Components/Sidebar.tsx`, `public/images/logo-sidebar.png`
- `resources/js/Pages/ClassManagement/Index.tsx`

**Diubah**
- `app/Models/Teacher.php`, `AuthenticatedLayout.tsx`, `WelcomeLayout.tsx`, `Dashboard.tsx`, `routes/web.php`
- `Course/CourseShow.tsx` → `ClassManagement/CourseShow.tsx` (rename)
- `Course/SetTeacherId.tsx` → `ClassManagement/SetTeacherId.tsx` (rename)

**Dihapus**
- `resources/js/Layouts/AuthenticatedLayout.tsx copy.backup`
- `resources/js/Pages/Course/CourseDashboard.tsx`

## 2026-05-19 — Dashboard baru & seeder
**Commit:** `c0adf3d`, `be22d53`, `b145e06`, `f2264ad`, `7d4a8a9` · **Oleh:** arrijalifal

**Ditambahkan**
- `public/images/icon-guru.png`

**Diubah**
- `CourseSeeder.php`, `UserSeeder.php`, `DatabaseSeeder.php` — hapus kolom `subject` lama di seeder
- `resources/js/Pages/Dashboard.tsx`, `resources/js/types/vite-env.d.ts`, `.gitignore`

## 2026-05-18 — Model AvailableCourse
**Commit:** `6d07264` · **Oleh:** arrijalifal

**Ditambahkan**
- `app/Models/AvailableCourse.php`, `database/factories/AvailableCourseFactory.php`
- `database/migrations/2026_05_17_125144_create_available_courses_table.php`

**Diubah**
- `app/Models/Course.php`, `app/Models/Teacher.php`, migration `courses`

## 2026-05-17 — teacher_id nullable di course
**Commit:** `6f75a49` · **Oleh:** arrijalifal

**Diubah**
- Migration `courses`, `.gitignore`, `package.json`, `package-lock.json`

## 2026-05-16 — Commit pertama
**Commit:** `973ad50` · **Oleh:** arrijalifal

Kerangka awal dari Laravel + Breeze (React/TypeScript) plus model & migration awal: `students`, `teachers`, `courses`, `books`, `mood_trackers`, `course_meetings`, `attendances`, `curricula`, `course_interests`, `revenues`. Halaman awal: `Welcome`, `Dashboard`, Auth, Profile, `Course/*`, `ClassOffering/ClassOffering.tsx`, `Module/ModuleIndex.tsx`, `Revenue/RevenueIndex.tsx`, `Schedule/ScheduleIndex.tsx`. Komponen `ArticleCards`, `PricingCards`, `TestimonialCards`, layout `WelcomeLayout`. Gambar logo & homescreen di `public/images/`.
