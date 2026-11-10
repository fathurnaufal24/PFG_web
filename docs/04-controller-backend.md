# 04 · Controller (Backend)

[← Kembali ke README](../README.md)

Semua controller ada di `app/Http/Controllers/`. Untuk tiap method dijelaskan: siapa yang boleh akses, apa yang divalidasi, apa yang dilakukan ke database, dan apa yang dikembalikan.

Pola umum di project ini:
- Cek role dengan `auth()->user()->role` lalu `abort(403)` jika tidak berhak.
- Validasi dengan `$request->validate([...])`.
- Setelah simpan → `redirect()->route(...)->with('success', '...')`. Pesan ini muncul di halaman lewat prop `flash.success`.

Daftar isi:
- [ClassManagementController](#classmanagementcontroller)
- [ClassOfferingController](#classofferingcontroller)
- [DashboardController](#dashboardcontroller)
- [NotificationController](#notificationcontroller)
- [SettingController](#settingcontroller)
- [ProfileController](#profilecontroller)
- [Controller Auth](#controller-auth)
- [Form Request](#form-request)
- [Controller sederhana / kosong](#controller-sederhana--kosong)

---

## ClassManagementController

File: `app/Http/Controllers/ClassManagementController.php`. Mengelola kelas (tabel `class_management`).

### `index()`

- **Akses:** semua user login. Admin melihat semua kelas; teacher hanya kelas dengan `teacher_id` miliknya; user lain (mis. student) mendapat daftar kosong (`whereRaw('1 = 0')`).
- Memuat relasi `course`, `teacher.user`, `schedules`.
- Setiap kelas diubah menjadi array untuk frontend:

| Key | Isi |
|-----|-----|
| `id` | ID kelas, mis. `QV-2.1` |
| `course_id` | |
| `subject` | Teks tampilan: `"{subject} – {period}.{order}"`, ditambah `" – P1"` jika tipe `trial` |
| `subject_name` | Kode course saja, mis. `QV` |
| `level`, `type`, `period`, `order` | |
| `session` | Jumlah jadwal di `class_schedules`; jika belum ada, pakai kolom `session` |
| `schedule` | `schedule_at` diformat `"Monday, 01 January 2026 (09.00 WIB)"` atau `-` |
| `schedule_at` | Format input HTML `Y-m-d\TH:i` |
| `students` / `students_text` | Kapasitas siswa / teks "8 Students" |
| `status` | Label: Lesson Plan, Active, Report, Parent Meeting, Class Ended |
| `status_raw` | Nilai asli di DB: inactive, active, report, pm, ended |
| `teacher_name`, `teacher_id` | Nama guru atau "Not Assigned" |
| `note` | |
| `preferred_day`, `preferred_time` | Pilihan hari/waktu dari offering |
| `has_schedule` | `true` jika sudah ada jadwal (sudah di-Set Time) |
| `total_meetings` | Jumlah jadwal |

- Juga menghitung jumlah kelas per status untuk tab.
- **Render:** `ClassManagement/Index` dengan props:
  - `classes` — array di atas
  - `tabs` — `[{name, count}]` untuk 5 status
  - `canCreate` — admin, atau teacher yang punya profil teacher
  - `canEdit` — hanya admin
  - `courses` — semua course (`id`, `subject`, `description`) untuk dropdown
  - `userRole`

### `store(Request $request)`

- **Akses:** admin atau teacher (yang punya profil teacher).
- **Validasi:**

| Field | Aturan |
|-------|--------|
| `course_id` | wajib, harus ada di `courses` |
| `type` | wajib, `trial` / `regular` / `private` |
| `level` | wajib, integer ≥ 1 |
| `period` | wajib, string ≤ 50 |
| `order` | opsional, integer ≥ 1 (default 1) |
| `schedule_at` | opsional, tanggal |
| `note` | opsional (default `''`) |
| `teacher_id` | opsional, harus ada di `teachers` |
| `session` | opsional, integer ≥ 0 (default 0) |

- Otomatis: `status = 'inactive'`, `student = ClassTypeSetting::maxStudentFor(type)`. Jika yang membuat teacher, `teacher_id` dipaksa jadi ID teacher tersebut.
- ID kelas dibuat otomatis oleh model (lihat [02-database](02-database-dan-model.md#class_management--model-classmanagement)).
- **Hasil:** redirect ke `/classmanagement` dengan pesan "Class created successfully".

### `create()`

Cek akses seperti `store`, lalu memanggil `index()` (modal tambah kelas ada di halaman Index).

### `edit(ClassManagement $classmanagement)`

Hanya admin. Memanggil `show()`.

### `show(ClassManagement $classmanagement)`

- **Akses:** admin bebas. Teacher hanya kelas miliknya (selain itu 403). Jika status masih `inactive`, teacher di-redirect ke daftar kelas dengan pesan error: *"Kelas masih dalam tahap Lesson Plan…"*.
- Memuat `course`, `teacher.user`, `lessonPlan`, `schedules`.
- **Render:** `ClassManagement/Show` dengan props `classData` (dari `classroomPayload()`), `canEdit`, `userRole`.

### `classroomPayload(ClassManagement $class)` *(private)*

Menyusun data untuk halaman detail kelas. Isinya:

| Key | Sumber | Keterangan |
|-----|--------|-----------|
| `id`, `title`, `subject`, `teacher_name`, `level`, `type` | Database | `title` sama dengan format `subject` di Index |
| `schedule` | Database | Format bahasa Indonesia, mis. "Senin, 05 Oktober 2026 - 09.00 WIB" |
| `status` / `status_raw` | Database | `status` berupa key: lesson_plan, active, report, parent_meeting, ended |
| `lesson_plan` | Database | `{cdev, model, method, purpose, output, outcome}` atau `null` |
| `sessions` | Database | Dari `class_schedules` (`{id, label: "Session N", datetime}`). Jika belum ada jadwal tapi `session` > 0, tanggal dihitung mingguan dari `schedule_at`. |
| `class_link` | **Dummy** | `https://meet.pfg.id/{slug judul}` |
| `room_name`, `main_alias` | **Dummy** | `PFG-{id}`, judul |
| `students` | **Dummy** | 2 siswa tetap: Muhammad Al-Fatih, Reza Alfian |
| `attendance` | **Dummy** | Absensi contoh (hadir/sakit/izin/tidak_hadir/belum) |
| `session_history` | **Dummy** | 2 riwayat sesi (durasi +70 menit, link rekaman `youtube.com`) |
| `reports` | **Dummy** | Laporan per siswa (belum ada file) |
| `parent_meetings` | **Dummy** | Data PM per siswa, status `belum` |

Komentar di kode: *"Dummy classroom payload for Teacher Portal slides 7-12. Real persistence can replace these arrays later."*

### `update(Request $request, ClassManagement $classmanagement)`

- **Akses:** admin.
- Validasi sama seperti `store`, tapi `order` wajib.
- Jika `type` berubah, `student` diperbarui sesuai `ClassTypeSetting`.
- **Catatan:** `id` kelas **tidak** ikut berubah walaupun `period`/`order` diganti (event pembuat ID hanya jalan saat create).
- **Hasil:** redirect dengan "Class updated successfully".

### `destroy(ClassManagement $classmanagement)`

Admin saja. Menghapus kelas (jadwal, lesson plan, dan class_students ikut terhapus karena cascade). Redirect dengan "Class deleted successfully".

### `storeLessonPlan(Request $request, ClassManagement $classmanagement)`

- **Akses:** hanya teacher yang mengajar kelas tersebut.
- Syarat: status kelas masih `inactive` dan belum punya lesson plan (jika tidak, kembali dengan error).
- **Validasi:** `cdev` (array minimal 1, nilai `c1`–`c6`), `model` & `method` (wajib, ≤ 255), `purpose`, `output`, `outcome` (wajib).
- Menyimpan `LessonPlan` (`cdev` disimpan sebagai JSON), lalu **mengubah status kelas menjadi `active`**.
- **Hasil:** redirect dengan "Lesson plan created successfully! Class status updated to Active."
- Catatan: backend tidak mengecek apakah kelas sudah punya jadwal; pengecekan itu hanya di frontend.

### `setTime(Request $request, ClassManagement $classmanagement)`

- **Akses:** admin.
- **Validasi:** `start_date` (wajib, setelah sekarang), `start_time` (wajib, format `HH:MM`), `meeting_count` (opsional, 1–20, default 10), `start_this_week` (boolean — divalidasi tapi tidak dipakai).
- Proses:
  1. Hapus semua jadwal lama kelas ini.
  2. Buat `meeting_count` baris `class_schedules`, satu per minggu mulai `start_date` jam `start_time`.
  3. Update kelas: `schedule_at` = pertemuan pertama, `session` = `meeting_count`.
- **Hasil:** redirect dengan "{N} weekly meeting schedules created successfully!"

### `getSchedule(ClassManagement $classmanagement)` → JSON

```json
{ "schedules": [ ...class_schedules urut meeting_number ], "preferred_day": "...", "preferred_time": "..." }
```

### `canStartLessonPlan(ClassManagement $classmanagement)` → JSON

```json
{ "can_start": true, "has_schedule": true, "has_lesson_plan": false }
```

`can_start` = sudah punya jadwal **dan** belum punya lesson plan. Saat ini belum dipanggil oleh frontend.

---

## ClassOfferingController

File: `app/Http/Controllers/ClassOfferingController.php`. Mengelola penawaran kelas dan lamaran guru.

### `index()`

1. Memanggil `autoArchiveOfferings()` → semua offering yang `close_offering`-nya sudah lewat langsung di-set `is_archived = true`.
2. Mengambil offering:
   - **Admin:** semua offering, terbaru dulu.
   - **Teacher:** offering yang (belum diarsip **dan** belum lewat deadline) **atau** yang pernah ia lamar; dan **bukan** offering di mana ia sudah diterima (karena sudah pindah ke Class Management).
3. Setiap offering diubah menjadi:

| Key | Isi |
|-----|-----|
| `id`, `course_id`, `subject`, `level`, `period`, `order`, `type`, `student`, `note` | Data offering |
| `schedule_at` / `schedule_display` | Format input / format tampilan |
| `close_offering` / `close_offering_display` | Deadline (format input / tampilan) |
| `is_archived`, `is_expired` | Status arsip / sudah lewat deadline |
| `preferences` | `[{index, day, time, label}]` |
| `applied_teachers` | Lamaran `pending`: `{id, teacher_id, teacher_name, status, applied_at, selected_preference}` |
| `accepted_teacher` | Lamaran `accepted` atau `null` |
| `has_applied`, `application_status`, `selected_preference` | Khusus teacher: status lamarannya sendiri |
| `can_apply` | Teacher, belum melamar, tidak diarsip, belum lewat deadline |

4. **Render:** `ClassOffering/Index` dengan `offerings`, `courses`, `isAdmin`, `canCreate`/`canEdit`/`canDelete` (= admin), `unreadCount`.

### `store(Request $request)`

- **Akses:** admin.
- **Validasi:**

| Field | Aturan |
|-------|--------|
| `course_id` | wajib, ada di `courses` |
| `level`, `order` | wajib, integer ≥ 1 |
| `period` | wajib, string |
| `type` | wajib, trial/regular/private |
| `schedule_at` | opsional, tanggal |
| `close_offering` | opsional, tanggal setelah sekarang |
| `note` | opsional |
| `is_archived`, `has_deadline` | boolean |
| `preferences` | wajib, array minimal 1; tiap item wajib `day` & `time` |

- Aturan tambahan: jika `has_deadline` dicentang, `close_offering` wajib diisi; `close_offering` harus **sebelum** `schedule_at`.
- Otomatis: `student` dari `ClassTypeSetting`, `curriculum_id` = profil curriculum admin (fallback `1`), `close_offering` dikosongkan jika `has_deadline` false.
- **Hasil:** redirect dengan "Class offering created successfully."

### `update(Request $request, ClassOffering $classOffering)`

Admin. Validasi hampir sama dengan `store` (tanpa syarat `close_offering` setelah sekarang). Jika tipe berubah, `student` diperbarui.

### `destroy(ClassOffering $classOffering)`

Admin. Menghapus semua lamaran lalu offering-nya.

### `apply(Request $request, ClassOffering $classOffering)`

- **Akses:** teacher (harus punya profil teacher).
- **Validasi:** `selected_preference` (wajib, integer ≥ 0) = indeks preferensi hari/waktu yang dipilih.
- Ditolak jika offering diarsip/lewat deadline, atau teacher sudah pernah melamar.
- Membuat `ClassOfferingTeacher` dengan status `pending`.
- **Hasil:** "Application submitted successfully. Please wait for admin approval."

### `approve(Request $request, ClassOffering $classOffering, $applicationId)`

- **Akses:** admin. Dijalankan dalam **transaksi database** (semua berhasil atau semua dibatalkan).
- Langkah:
  1. Lamaran yang dipilih → status `accepted`, `approved_at = now()`.
  2. Semua lamaran `pending` lain untuk offering ini → kirim notifikasi `class_offering_rejected` ("Mohon maaf anda belum diterima") lalu **hapus** lamarannya.
  3. Kirim notifikasi `class_offering_accepted` ("Selamat anda diterima!", link ke `/classmanagement`) ke guru yang diterima.
  4. Buat `ClassManagement` baru dari data offering: course, teacher, level, period, order, type, student, schedule_at, note, `session = 0`, `status = 'inactive'`, `preferred_day` & `preferred_time` dari preferensi yang dipilih guru.
  5. Offering → `is_archived = true`.
- Jika ID kelas bentrok (sudah ada kelas dengan subject-period.order sama), transaksi batal dan muncul pesan error dari model.
- **Hasil:** "Teacher approved successfully. Class Management created."

### `reject(Request $request, ClassOffering $classOffering, $applicationId)`

Admin. Kirim notifikasi `class_offering_rejected` ke guru, lalu hapus lamarannya. Offering tetap terbuka untuk guru lain.

### `autoArchiveOfferings()` *(private)*

Lihat langkah 1 di `index()`.

---

## DashboardController

File: `app/Http/Controllers/DashboardController.php`. Method `index()` mengirim data berbeda per role ke halaman `Dashboard`.

| Role | Data yang disiapkan |
|------|---------------------|
| admin | `isAdmin = true`, `stats = {totalClasses, totalTeachers, totalStudents}` (hitungan tabel) |
| teacher | `teacherData` = profil teacher (termasuk `first_name`, `performance`) |
| student | `studentData`: `id`, `name`, `enrolled_classes` (pivot status `enrolled`), `pending_classes` (pivot `pending`), `stats` = `{enrolled_count, pending_count, next_schedule}`. `next_schedule` = jadwal terdekat dari kelas yang diikuti (`subject`, `meeting_number`, `date`). |

Props yang selalu dikirim: `teacherData`, `studentData`, `stats`, `isAdmin`, `userRole`, `userName`.

---

## NotificationController

File: `app/Http/Controllers/NotificationController.php`.

| Method | Fungsi |
|--------|--------|
| `index()` | Ambil semua notifikasi milik user (terbaru dulu) + jumlah belum dibaca → render `Notification/Index` (`notifications`, `unreadCount`) |
| `markAsRead(Request, Notification)` | Hanya pemilik (selain itu 403). Set `read = true`. Balas JSON `{success: true}` jika request minta JSON, selain itu `back()` |
| `markAllAsRead()` | Tandai semua notifikasi user sebagai dibaca |
| `getUnreadCount()` | JSON `{count}` — dipakai Sidebar jika prop `unreadCount` tidak ada |

---

## SettingController

File: `app/Http/Controllers/SettingController.php`. Semua method hanya untuk admin (`authorizeAdmin()`).

| Method | Fungsi |
|--------|--------|
| `index()` | Kirim `classTypes = [{type, max_student}]` untuk 3 tipe kelas → render `Setting/Index` |
| `updateClassTypes(Request)` | Validasi `settings[]` (`type` harus salah satu `TYPES`, `max_student` 1–100), simpan dengan `updateOrCreate`. Pesan: "Settings saved. New classes will use these limits." |

Perubahan hanya berlaku untuk kelas/offering **baru** (atau saat tipe kelas diubah). Kelas lama tidak ikut berubah.

---

## ProfileController

File: `app/Http/Controllers/ProfileController.php`.

| Method | Fungsi |
|--------|--------|
| `edit(Request)` | Muat relasi sesuai role (teacher/curriculum/student), render `Profile/Edit` dengan `mustVerifyEmail`, `status`, `user` |
| `update(ProfileUpdateRequest)` | Update email jika berubah. Teacher: update `first_name`, `last_name`, `dob`, `pob`, `domicile`, `card_number` di tabel `teachers`. Admin: update `name` di `curricula` (⚠️ kolom ini tidak ada, lihat [08-catatan](08-catatan-dan-masalah.md)). Student: update `name` di `students`. |
| `destroy(Request)` | Minta password saat ini, logout, hapus akun, reset session, redirect ke `/` |

---

## Controller Auth

Folder `app/Http/Controllers/Auth/`. Hampir semuanya bawaan Laravel Breeze.

| Controller | Fungsi | Diubah dari bawaan? |
|------------|--------|---------------------|
| `RegisteredUserController` | Tampilkan & proses form register | **Ya** (lihat bawah) |
| `AuthenticatedSessionController` | Login (`store`), logout (`destroy`), tampilkan form login (`create`) | Tidak berarti |
| `PasswordResetLinkController` | Kirim email link reset password | Tidak |
| `NewPasswordController` | Form & proses password baru | Tidak |
| `PasswordController` | Ganti password dari halaman profil | Tidak |
| `ConfirmablePasswordController` | Konfirmasi password sebelum aksi sensitif | Tidak |
| `EmailVerificationPromptController` | Halaman "verifikasi email kamu" | Tidak |
| `EmailVerificationNotificationController` | Kirim ulang email verifikasi | Tidak |
| `VerifyEmailController` | Proses link verifikasi | Tidak |

**`RegisteredUserController@store`** (versi modifikasi):
- Nama diambil dari `first_name` atau `name` (salah satu wajib).
- Validasi: `email` unik & lowercase, `password` + `password_confirmation`, `role` wajib `student` atau `teacher`.
- Membuat `User`, lalu profil sesuai role: `Student` (`name`) atau `Teacher` (`first_name`).
- Login otomatis, redirect ke `/dashboard`.
- Catatan: form register di frontend selalu mengirim `role = 'student'` (hidden input), jadi pendaftaran lewat UI selalu jadi siswa.

---

## Form Request

Folder `app/Http/Requests/`.

### `Auth/LoginRequest.php`

- Aturan: `email` (wajib, email), `password` (wajib).
- `authenticate()`: coba login; gagal → tambah hitungan *rate limit*.
- `ensureIsNotRateLimited()`: maksimal **5 percobaan gagal**, setelah itu dikunci sementara.
- `throttleKey()`: kombinasi email (lowercase) + IP.

### `ProfileUpdateRequest.php`

- Jika user punya profil teacher: `first_name` wajib; `last_name`, `pob`, `dob`, `domicile` opsional; `card_number` opsional & numerik; `email` wajib, unik (kecuali dirinya).
- Selain teacher: `name` wajib, `email` wajib & unik.

---

## Controller Sederhana / Kosong

| Controller | Isi |
|------------|-----|
| `Controller.php` | Kelas dasar (abstract), kosong |
| `ModuleController` | `index()` → render `Module/Index` |
| `RevenueController` | `index()` → render `Revenue/Index` |
| `ParentMeetingController` | `index()` → render `ParentMeeting/Index` |
| `AvailableCourseController` | Kerangka resource controller, semua method kosong |
| `ClassScheduleController`, `LessonPlanController`, `ScheduleController`, `CourseTabController` | Kosong |
| `CourseController` | Kode lama (sebelum ada Class Management). Tidak punya route dan merujuk halaman `Course/...` yang sudah dihapus. |
