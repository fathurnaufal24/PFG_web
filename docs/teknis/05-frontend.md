# 05 · Frontend (React + TypeScript)

[← Kembali ke README](../../README.md)

Semua kode frontend ada di `resources/js/`. Alias `@/` = `resources/js/` (diatur di `tsconfig.json`), jadi `@/Components/Sidebar` = `resources/js/Components/Sidebar.tsx`.

Daftar isi:
- [Entry point](#entry-point)
- [Layouts](#layouts)
- [Components](#components)
- [Pages](#pages)
- [Tipe TypeScript](#tipe-typescript)
- [Aset gambar](#aset-gambar)

---

## Entry Point

| File | Fungsi |
|------|--------|
| `app.tsx` | Membuat aplikasi Inertia, mencari halaman di `Pages/**/*.tsx`, mengatur judul tab dan warna progress bar |
| `bootstrap.ts` | Mengatur `axios` global dengan header `X-Requested-With` (bawaan Laravel) |
| `types/global.d.ts`, `types/vite-env.d.ts` | Deklarasi tipe global (fungsi `route()` dari Ziggy, env Vite, import file gambar) |

---

## Layouts

Folder `Layouts/`. Layout = kerangka yang membungkus isi halaman.

### `AuthenticatedLayout.tsx`

Dipakai semua halaman setelah login.
- Props: `children`, `className` (opsional).
- State: `isOpen` — sidebar terbuka atau tidak (untuk layar HP).
- Isi: `Sidebar` di kiri; di HP muncul header gelap dengan logo "PFG Portal" + tombol menu (☰); area konten maksimal lebar 1600px.

### `WelcomeLayout.tsx`

Dipakai halaman depan (`Welcome`).
- Props: `auth` (dari `PageProps`), `children`.
- Navbar biru (`#064e7b`) dengan logo, link Home/About/Testimoni/Layanan/Artikel (belum mengarah ke mana-mana, `href="#"`).
- Tombol kanan: jika sudah login → **Dashboard**; jika belum → **Sign In** dan **Daftar**.
- Footer berisi logo PFG dan info lain.

### `GuestLayout.tsx`

Bawaan Breeze, kotak putih di tengah dengan logo. Dipakai halaman auth bawaan (ForgotPassword, ResetPassword, ConfirmPassword, VerifyEmail).

---

## Tema Terang/Gelap

Ada 3 mode: **Sistem** (default, mengikuti `prefers-color-scheme` OS), **Terang**, dan **Gelap**. Pilihan dibuat lewat komponen `ThemeToggle` (di Sidebar dan `GuestLayout`; halaman Login, Register, dan Welcome tidak memakainya) dan disimpan di `localStorage` kunci `theme` (mode Sistem = kunci dihapus). Mode dipasang sebagai atribut `data-theme` pada `<html>`; skrip kecil di `app.blade.php` memasangnya sebelum render agar tidak berkedip.

- `tailwind.config.js`: palet `gray`, `slate`, warna `bg-white`, dan `bg-page` dibaca dari CSS variable (`--gray-50`, `--c-white`, dst.). Plugin `addBase` membuat nilai terang di `:root`, skala yang dibalik di `@media (prefers-color-scheme: dark)` (hanya bila `data-theme` bukan `light`), dan di `:root[data-theme="dark"]`. Karena itu kelas biasa seperti `bg-white`, `text-gray-700`, `border-slate-200` otomatis berganti tema; **tidak perlu menulis varian `dark:`** (semua `dark:` bawaan Breeze sudah dihapus agar tidak bentrok).
- `text-white` dan warna berwarna (emerald, indigo, red, dst.) tidak berubah di mode gelap.
- Kelas `theme-light` mengembalikan variable ke nilai terang pada elemen itu beserta isinya. Dipakai untuk area yang memang gelap/berdesain tetap: Sidebar, header mobile, `PrimaryButton`, badge gelap di `ClassManagement/Show.tsx`, tombol di `PricingCards`, dan seluruh `WelcomeLayout` (halaman depan).
- `bg-page` menggantikan warna latar halaman `#F3F4F9`.
- `resources/css/app.css`: `body` memakai `bg-white text-gray-900`, dan input/select/textarea ditimpa agar latarnya ikut tema (default `@tailwindcss/forms` selalu putih).

## Components

Folder `Components/`.

### Komponen buatan sendiri

| File | Fungsi | Props |
|------|--------|-------|
| `Sidebar.tsx` | Menu navigasi kiri | `isOpen`, `setIsOpen` |
| `ThemeToggle.tsx` | Pilihan tema Sistem/Terang/Gelap | `className?` |
| `ArticleCards.tsx` | Kartu artikel di halaman Welcome | lihat `ArticleProps` di file |
| `PricingCards.tsx` | Kartu harga paket di halaman Welcome | lihat `PricingProps` |
| `TestimonialCards.tsx` | Kartu testimoni di halaman Welcome | lihat `TestimonialProps` |

**Detail `Sidebar.tsx`:**
- Membaca `auth.user` dan `unreadCount` dari `usePage().props`.
- State `unreadCount`: diambil dari prop global; jika tidak ada, `fetch('/notifications/unread-count')`. Admin tidak memakai badge.
- Daftar menu tergantung role:

| Student | Admin & Teacher |
|---------|-----------------|
| Dashboard → `dashboard` | Dashboard |
| Kelas Saya → `classmanagement` | Class Management |
| Jadwal Saya → `schedule` | Revenue |
| Modul Belajar → `module` | My Schedule |
| Class Offering | Module |
| Notifications (dengan badge) | Class Offering |
| | Notifications (badge untuk teacher) |
| | Parent Meeting |
| | Settings (**hanya admin**) |

- Bagian atas: logo + kartu profil (inisial nama, klik → `/profile`). Fungsi `getInitials(name)` mengambil 2 huruf awal kata.
- Bagian bawah: tombol Logout (`<Link href="/logout" method="post">`).

### Komponen bawaan Breeze

`ApplicationLogo`, `Checkbox`, `DangerButton`, `Dropdown`, `InputError`, `InputLabel`, `Modal`, `NavLink`, `PrimaryButton`, `ResponsiveNavLink`, `SecondaryButton`, `TextInput`. Komponen UI dasar; sebagian dipakai di halaman Profile dan Auth.

---

## Pages

Folder `Pages/`. Satu file = satu halaman; nama file sesuai string di `Inertia::render(...)`.

### `Welcome.tsx` — Halaman depan (`/`)

Landing page publik dengan `WelcomeLayout`. Bagian: hero (judul besar + gambar), tentang, kartu harga (`PricingCard`), testimoni (`TestimonialCard`, animasi `marquee`), artikel (`ArticleCard`). Teks isi masih placeholder (`placeholderText`).

### `Auth/Login.tsx` — Login (`/login`)

- `useForm`: `email`, `password`, `remember`.
- State `showPassword` + fungsi `togglePasswordVisibility()` untuk tombol lihat password.
- `submit()` → `post('/login')`, password dikosongkan setelah selesai.
- Desain custom dengan gambar latar `Auth/background-halaman-login.jpg`.

### `Auth/Register.tsx` — Register (`/register`)

- `useForm`: `first_name`, `email`, `password`, `password_confirmation`, `role` (selalu `'student'`, dikirim lewat hidden input).
- State `showPassword`, `showPasswordConfirmation`.
- `submit()` → `post('/register')`.

### `Auth/ForgotPassword.tsx`, `ResetPassword.tsx`, `ConfirmPassword.tsx`, `VerifyEmail.tsx`

Bawaan Breeze, belum diubah.

### `Dashboard.tsx` — Dashboard (`/dashboard`)

Props: `teacherData`, `studentData`, `stats`, `isAdmin`, `userRole`, `userName` (lihat [DashboardController](04-controller-backend.md#dashboardcontroller)).

Tampilan dipilih berdasarkan role:

| Role | Isi |
|------|-----|
| student | Banner sambutan, kartu statistik (kelas diikuti, menunggu, jadwal terdekat), banner kelas pending, daftar kelas yang diikuti |
| admin | Sambutan + 3 kartu: Total Classes, Total Teachers, Total Students |
| teacher | Sambutan "Welcome {first_name}" + skor `performance` (standar 75%), kartu rating bintang, tabel **Pending Attendance** dengan pagination (data contoh) |

Jika role teacher tapi `teacherData` kosong, muncul pesan error.

### `ClassManagement/Index.tsx` — Daftar kelas (`/classmanagement`)

Props: `classes`, `tabs`, `canCreate`, `canEdit`, `courses`, `userRole` (lihat [ClassManagementController@index](04-controller-backend.md#index)).

**State:**

| State | Fungsi |
|-------|--------|
| `activeTab` | Tab status yang dipilih (default "Lesson Plan") |
| `searchTerm` | Kata kunci cari (subject atau nama guru) |
| `typeFilter` | Filter tipe: all / trial / regular / private |
| `isModalOpen`, `isEditMode`, `editId`, `isSubmitting`, `formData` | Modal tambah/edit kelas |
| `isLessonPlanModalOpen`, `selectedClassId`, `isLessonPlanSubmitting`, `lessonPlanData` | Modal lesson plan (`cdev`, `model`, `method`, `purpose`, `output`, `outcome`) |
| `isSetTimeModalOpen`, `setTimeClassId`, `isSetTimeSubmitting`, `setTimeData` | Modal set time (`start_date`, `start_time`, `start_this_week`, `meeting_count`) |
| `showNoScheduleModal` | Modal "Admin belum mengatur jam" |
| `flashVisible` | Tampil/sembunyi banner pesan |

**Variabel turunan:** `filteredClasses` (hasil filter tab + cari + tipe), `cdevOptions` (C1–C6), `isAdmin`, `isTeacher`.

**Fungsi:**

| Fungsi | Fungsi |
|--------|--------|
| `handleDelete(id, subject)` | Konfirmasi lalu `router.delete('/classmanagement/{id}')` |
| `handleInputChange`, `handleLessonPlanInputChange`, `handleSetTimeChange` | Update state form |
| `toggleCdev(value)` | Centang/hapus centang C1–C6 |
| `handleSubmit` | Validasi field wajib, lalu `router.post('/classmanagement')` atau `router.put('/classmanagement/{id}')` |
| `handleLessonPlanSubmit` | Cek minimal 1 cdev dan kelas sudah punya jadwal, lalu `router.post('/classmanagement/{id}/lesson-plan')` |
| `handleSetTimeSubmit` | `router.post('/classmanagement/{id}/set-time')` |
| `openCreateModal`, `openEditModal`, `closeModal` | Buka/tutup modal kelas |
| `openLessonPlanModal(classId)` | Jika belum ada jadwal → tampilkan `showNoScheduleModal`, jika sudah → buka form lesson plan |
| `openSetTimeModal(classId)` | Hitung tanggal default dari `preferred_day` (hari terdekat berikutnya; jika hari ini & sudah lewat jam 12, minggu depan), jam default 09:00, 10 pertemuan |
| `closeLessonPlanModal`, `closeSetTimeModal` | Tutup modal & reset |
| `getTypeBadgeClass(type)` | Warna badge: trial ungu, regular biru, private kuning |

**Tampilan:**
- Banner flash sukses/error.
- Judul "Class Overview" + tombol tambah kelas (jika `canCreate` dan di tab Lesson Plan).
- 5 kartu tab status dengan jumlah kelas.
- Filter tipe + kotak cari.
- Tabel: No, Subject, Level, Type, Session, Release Schedule, Students, Teacher, Actions.
- Aturan tombol & klik baris:
  - **Admin + kelas inactive:** tombol Set Time / Edit Time (tombol Edit & Delete disembunyikan).
  - **Admin + kelas lain:** tombol Edit & Delete.
  - **Teacher di tab Lesson Plan:** baris tidak bisa diklik; tombol "Start Lesson Plan" aktif hanya jika sudah ada jadwal.
  - Selain itu: klik baris → buka detail `/classmanagement/{id}`.
- 4 modal: Add/Edit Class, Lesson Plan, Set Time, No Schedule.

### `ClassManagement/Show.tsx` — Detail kelas (`/classmanagement/{id}`)

Props: `classData` (lihat [classroomPayload](04-controller-backend.md#classroompayloadclassmanagement-class-private)), `canEdit`, `userRole`.

**Tipe lokal:** `AttendanceStatus` (`hadir`, `sakit`, `izin`, `tidak_hadir`, `belum`), `PmStatus` (`belum`, `terlaksana`, `lanjut`), `StageKey` (`lesson_plan`, `active`, `report`, `parent_meeting`).

**State:** `openStage` (tahap yang terbuka, default sesuai status kelas), `roomOpen`, `classEnded`, `students`, `attendance`, `sessionHistory`, `reports`, `parentMeetings`, `isAddStudentOpen`, `newStudentName`, `isLessonSubmitting`, `lessonPlan`.

**Tampilan:** header judul kelas + kartu info (Teacher, Release Schedule, Level, Class Link), lalu 4 tahap accordion:

| Tahap | Isi |
|-------|-----|
| Start Lesson Plan | Form C1–C6, Learning Model, Method, Purpose, Output Plan, Outcome Plan. Submit → `router.post('/classmanagement/{id}/lesson-plan')` (hanya teacher; selain teacher hanya disimpan di layar) |
| Start Active Class | Tabel absensi per siswa per sesi (dropdown status), tombol buka room, Session History |
| Start Report | Upload laporan per siswa |
| Start Parent Meeting | Daftar PM per siswa (Lanjut / Belum PM / Class Ends) |

**Fungsi:** `toggleStage`, `toggleCdev`, `handleLessonPlanSubmit`, `updateAttendance`, `addStudent` (modal "Add Student"), `attachReport`, `createParentMeeting`. Variabel `pendingPmCount` = jumlah PM yang masih `belum`.

> ⚠️ Selain lesson plan, **semua aksi di halaman ini hanya mengubah state lokal** (hilang saat refresh). Belum ada endpoint untuk absensi, laporan, siswa, atau parent meeting.

Komponen kecil di file yang sama: `InfoCard`, `Field`, `TextAreaField`.

### `ClassManagement/SetTeacherId.tsx`

Hanya menampilkan teks "TEACHER ID BELUM DI SET!". Sisa kode lama, tidak dipakai controller mana pun.

### `ClassOffering/Index.tsx` — Penawaran kelas (`/classoffering`)

Props: `offerings`, `courses`, `isAdmin`, `canCreate`, `canEdit`, `canDelete`, `unreadCount` (lihat [ClassOfferingController@index](04-controller-backend.md#index-1)).

**Interface:** `Course`, `Preference`, `AppliedTeacher`, `AcceptedTeacher`, `Offering`, `Props`.

**State:**

| State | Fungsi |
|-------|--------|
| `searchTerm`, `selectedCourse`, `showArchived` | Filter daftar |
| `isModalOpen`, `isEditMode`, `editId`, `isSubmitting`, `formData`, `preferences` | Modal buat/edit offering. `formData`: course_id, type, level, period, order, student, schedule_at, close_offering, note, is_archived, has_deadline. `preferences`: daftar `{day, time}` |
| `expandedOffering` | Kartu yang daftar pelamarnya sedang dibuka |
| `applyModalOffering`, `selectedPreferenceIndex`, `isApplyingOffering` | Modal melamar (teacher) |
| `approveModalData`, `rejectModalData`, `deleteModalData`, `isProcessingAction` | Modal konfirmasi approve/reject/delete (admin) |
| `flashVisible` | Banner pesan |

**Konstanta:** `days` (Monday–Sunday), `times` (Morning, Afternoon, Evening, Night). Ditampilkan dalam bahasa Indonesia lewat `getDayLabel()` (Senin–Minggu) dan `getTimeLabel()` (Pagi, Siang, Sore, Malam).

**Filter `filteredOfferings`:** cocok kata kunci & course; lalu jika teacher sudah melamar → selalu tampil; selain itu `showArchived` menentukan tampil yang aktif atau yang diarsip/kedaluwarsa.

**Fungsi:**

| Fungsi | Fungsi |
|--------|--------|
| `handleInputChange` | Update `formData` |
| `handlePreferenceChange`, `addPreference`, `removePreference` | Kelola baris preferensi hari/waktu |
| `openCreateModal`, `openEditModal`, `closeModal` | Modal offering |
| `handleSubmit` | Buang preferensi kosong (minimal 1), lalu `router.post('/classoffering')` / `router.put('/classoffering/{id}')` |
| `handleOpenApplyModal`, `handleCloseApplyModal`, `handleSubmitApply` | Teacher memilih preferensi lalu `router.post('/classoffering/{id}/apply', {selected_preference})`. Jika preferensi hanya 1, otomatis terpilih |
| `handleConfirmApprove` | `router.post('/classoffering/{id}/approve/{applicationId}')` |
| `handleConfirmReject` | `router.post('/classoffering/{id}/reject/{applicationId}')` |
| `handleConfirmDelete` | `router.delete('/classoffering/{id}')` |
| `toggleExpand(id)` | Buka/tutup daftar pelamar |
| `getTypeBadge(type)` | Warna badge tipe |

**Tampilan:** banner flash, header + tombol buat (admin), kotak cari, grid kartu offering (header, body, preferensi, guru yang diterima, tombol teacher, daftar pelamar untuk admin), dan 5 modal: Create/Edit, Apply, Approve, Reject, Delete.

### `Notification/Index.tsx` — Notifikasi (`/notifications`)

Props: `notifications`, `unreadCount`.
- `getIcon`, `getIconBg`, `getBorderColor` → ikon & warna berdasarkan `type` (`class_offering_accepted` hijau, `class_offering_rejected` merah).
- `formatDate(date)` → format tanggal tampilan.
- `handleMarkAsRead(id)` → `router.post('/notifications/{id}/read')`.
- `handleMarkAllAsRead()` → `router.post('/notifications/mark-all-read')` (state `isMarkingAll`).
- `handleNotificationClick(n)` → tandai dibaca lalu buka `n.href`.

### `Setting/Index.tsx` — Pengaturan (`/settings`, admin)

Props: `classTypes` (`[{type, max_student}]`).
- State `values` (input per tipe) dan `isSaving`.
- `typeDescriptions`: penjelasan tiap tipe kelas.
- `handleSave` → `router.put('/settings/class-types', {settings: [...]})`.

### `Profile/Edit.tsx` — Profil (`/profile`)

- Data awal `initialData` diisi berdasarkan role:
  - teacher: `first_name`, `last_name`, `pob`, `dob`, `domicile`, `card_number`, `email`
  - admin: `name` (dari `curriculum.name` atau `user.name`), `email`
  - student: `name`, `email`
  - semua: `current_password`, `password`, `password_confirmation`
- `useForm(initialData)` → `patch(route('profile.update'))` untuk profil, `put(route('password.update'))` untuk password.
- Tampilan: kartu avatar (inisial, role badge berwarna), form informasi pribadi, form ganti password, bagian Delete Account.
- `Profile/Edit.tsx.backup` = versi lama (cadangan, tidak dipakai).
- `Profile/Partials/` (`DeleteUserForm`, `UpdatePasswordForm`, `UpdateProfileInformationForm`) = komponen bawaan Breeze yang **tidak dipakai** lagi oleh `Edit.tsx`.

### Halaman dummy (data tertulis langsung di kode)

| File | URL | Isi |
|------|-----|-----|
| `Revenue/Index.tsx` | `/revenue` | Riwayat gaji guru. Array `dataGaji` (bulan, jumlah sesi, nominal). Tombol "Download Slip" belum berfungsi. |
| `Schedule/Index.tsx` | `/schedule` | Kalender bulan "August 2026" (35 kotak) dengan 2 jadwal contoh. Tombol Today/Prev/Next belum berfungsi. |
| `Module/Index.tsx` | `/module` | 6 kartu modul (gambar placeholder) dengan input Teacher Name & Curriculum Code + tombol "Unlock" (belum berfungsi). |
| `ParentMeeting/Index.tsx` | `/parentmeeting` | 2 data parent meeting contoh + tombol "Create PM" (belum berfungsi). |

---

## Tipe TypeScript

File: `resources/js/types/index.d.ts`

| Tipe | Isi |
|------|-----|
| `BaseUser` | `id`, `name`, `email`, `email_verified_at?` |
| `User` | Gabungan: `BaseUser` + `role: 'teacher'` & `teacher: TeacherProps`, **atau** `role: 'admin'` & `curriculum: CurriculumProps`, **atau** `role: 'student'` & `student: StudentProps`. Dengan begitu, setelah cek `user.role === 'teacher'`, TypeScript tahu `user.teacher` ada. |
| `TeacherProps` | Semua kolom tabel `teachers` |
| `CurriculumProps` | `id`, `user_id`, `name`, timestamps (catatan: tabel aslinya punya `first_name`/`last_name`, bukan `name`) |
| `StudentProps` | `id`, `user_id`, `name`, timestamps |
| `Course` | Tipe lama (berisi level, period, teacher, dll.), sisa dari sebelum ada ClassManagement |
| `PageProps<T>` | Props global: `auth.user`, `flash.success?`, `flash.error?`, ditambah props khusus halaman `T` |

Interface khusus halaman (mis. `ClassData`, `Offering`) didefinisikan langsung di file halaman masing-masing.

---

## Aset Gambar

| File | Dipakai di |
|------|-----------|
| `public/images/logo-sidebar.png` | Sidebar, header HP di AuthenticatedLayout |
| `public/images/icon-guru.png` | Dashboard teacher |
| `public/images/PFGLogoWIthTextHD.png` | Navbar WelcomeLayout |
| `public/images/PFGLogo.png`, `PFGLogoHD.png`, `PFGLogoWithText.png` | Variasi logo |
| `public/images/HomescreenImage1.png`, `HomescreenImage2.png` | Halaman Welcome |
| `public/images/HomescreenOrnamentPagar1.png`, `HomescreenOrnamentPagar2.png` | Ornamen halaman Welcome |
| `resources/js/Pages/Auth/background-halaman-login.jpg` | Latar halaman Login/Register (di-import lewat Vite) |
