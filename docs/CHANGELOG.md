# CHANGELOG — Riwayat Perubahan

[← Kembali ke README](../README.md)

Daftar fitur dan perbaikan di PFG Portal. Perubahan terbaru ada di paling atas.

| Label | Artinya |
|---|---|
| ✨ **New** | Fitur atau halaman baru |
| ⚡ **Improved** | Fitur lama jadi lebih baik |
| 🔄 **Changed** | Cara kerja fitur berubah |
| ✅ **Fixed** | Masalah yang sudah diperbaiki |
| 🗑️ **Removed** | Fitur yang dihapus |
| ⚠️ **Known Issue** | Masalah yang belum diperbaiki |
| 🛠️ **Technical** | Catatan untuk developer |

Tanda **(Admin)**, **(Teacher)**, atau **(Student)** menunjukkan peran yang terdampak. Tanpa tanda berarti berlaku untuk semua.

---

## 12 November 2026 — Tema gelap & terang

- ✨ **New:** Tema gelap dan terang. Secara bawaan tampilan mengikuti tema perangkat (OS/browser), dan Anda bisa memilih sendiri **Sistem**, **Terang**, atau **Gelap** lewat pilihan tema di menu samping (dan di halaman lupa/reset kata sandi). Pilihan diingat di browser.
- 🔄 **Changed:** Menu samping, tombol utama, dan halaman depan (landing page) tetap berwarna seperti semula di kedua tema.
- ⚠️ **Known Issue:** Label berwarna (badge hijau, merah, biru, dst.) tetap terang di mode gelap.
- 🛠️ **Technical:** Palet warna kini memakai CSS variable; varian `dark:` tidak dipakai lagi.
  File utama: tailwind.config.js, ThemeToggle.tsx, app.css

## 10 Oktober 2026 — Pengaturan kapasitas kelas

- ✨ **New (Admin):** Halaman **Settings** untuk mengatur jumlah maksimal siswa per tipe kelas. Bawaannya: Trial 5, Regular 8, Private 1.
- 🔄 **Changed (Admin):** Jumlah siswa saat membuat kelas atau penawaran kelas kini terisi otomatis dari Settings, tidak diisi manual lagi.
- ✅ **Fixed:** Halaman Class Offering yang sebelumnya error.
- 🛠️ **Technical:** Tabel baru `class_type_settings`, jalankan `php artisan migrate`.
  File utama: `SettingController.php`, `ClassTypeSetting.php`, `Setting/Index.tsx`

## 7 Oktober 2026 — Dashboard siswa & kode kelas baru

- ✨ **New (Student):** Dashboard dan menu samping khusus siswa.
- 🔄 **Changed:** Kode kelas kini menunjukkan mata pelajaran, periode, dan urutan kelas (contoh: `EQD-3.1`), sehingga lebih mudah dikenali.
- ⚠️ **Known Issue (Student):** Siswa belum bisa didaftarkan ke kelas.
- 🛠️ **Technical:** Primary key `class_management` diganti dari angka menjadi string `{subject}-{period}.{order}`; foreign key di tabel terkait ikut diganti. Tabel baru `class_students`. Ditambahkan 3 akun dummy siswa di seeder. Route enroll dan manajemen siswa sudah ada, tapi method controller-nya belum dibuat.
  File utama: `ClassManagement.php`, `ClassStudent.php`, `UserSeeder.php`

## 6 Oktober 2026 — Jendela konfirmasi di Class Offering

- ⚡ **Improved:** Konfirmasi approve, reject, delete, dan apply di Class Offering kini memakai jendela pop-up, bukan peringatan bawaan browser.
- ✨ **New:** Pesan berhasil atau gagal muncul setelah sebuah aksi dijalankan.

## 4 Oktober 2026 — Daftar sesi di detail kelas

- 🔄 **Changed:** Daftar sesi di halaman detail kelas kini mengikuti jadwal kelas yang sudah diatur, bukan contoh tetap.
- ⚡ **Improved:** Bagian-bagian di halaman detail kelas bisa dibuka-tutup dengan tampilan yang lebih jelas.
- 🛠️ **Technical:** Laravel Debugbar ditambahkan untuk membantu debugging.

## 15 September 2026 — Pembaruan Class Management & pendaftaran akun

- 🔄 **Changed:** Akun baru yang dibuat lewat halaman Register otomatis berperan sebagai Student.
- ⚡ **Improved:** Pembaruan tampilan dan data di halaman Class Management.
- 🛠️ **Technical:** Ditambahkan 7 test untuk hak akses Class Management.
  File utama: `ClassManagementAccessTest.php`

## 29 Agustus 2026 — Perbaikan approval & Set Time

- ✅ **Fixed (Admin):** Proses approve guru di Class Offering.
- ✅ **Fixed (Admin):** Pengaturan jadwal (Set Time) di Class Management.

## 26 Agustus 2026 — Perbaikan Class Offering

- ✅ **Fixed:** Error di halaman Class Offering.
- 🛠️ **Technical:** Kolom preferensi waktu digabung ke migration utama; 2 migration tambahan dihapus. Perlu `php artisan migrate:fresh` jika database dibuat sebelum perubahan ini.

## 25 Agustus 2026 — Preferensi waktu & jadwal kelas

- ✨ **New (Admin):** Admin bisa memberi beberapa pilihan waktu mengajar di Class Offering.
- ✨ **New (Teacher):** Guru memilih salah satu pilihan waktu saat melamar Class Offering.
- ✨ **New (Admin):** Tombol **Set Time** untuk mengatur jadwal pertemuan kelas.
- 🔄 **Changed (Teacher):** Lesson plan baru bisa dimulai setelah jadwal kelas diatur.
- 🛠️ **Technical:** Tabel baru `class_schedules`.

## 22 Agustus 2026 — Tampilan login baru & mulai pelajaran

- ✨ **New (Teacher):** Tombol **Start Lesson** di halaman Class Management untuk memulai lesson plan.
- ⚡ **Improved:** Tampilan halaman Login dan Register didesain ulang.
- ✅ **Fixed (Admin):** Form edit kelas yang tidak muncul.
- ✅ **Fixed (Teacher):** Data di halaman profil guru yang gagal dimuat.

## 20 Agustus 2026 — Halaman detail kelas

- ✨ **New:** Halaman detail kelas yang menampilkan tahapan kelas: lesson plan, kelas berjalan, laporan, dan parent meeting.
- 🛠️ **Technical:** Tabel baru `lesson_plans`. Halaman `CourseShow.tsx` diganti `Show.tsx`.

## 18 Agustus 2026 — Class Offering & notifikasi

- ✨ **New (Admin):** Admin bisa membuka penawaran kelas (Class Offering) untuk guru.
- ✨ **New (Teacher):** Guru bisa melamar penawaran kelas.
- ✨ **New:** Tanda jumlah notifikasi yang belum dibaca di menu samping.
- 🛠️ **Technical:** Tabel baru `class_offering_teacher`. Pengaturan trusted proxy dan HTTPS agar aplikasi bisa diakses lewat Tailscale Funnel.

## 13 Agustus 2026 — Tampilan halaman profil

- ⚡ **Improved:** Tata letak halaman edit profil diperbarui.
- 🛠️ **Technical:** Perubahan konfigurasi database dan `allowScripts` di `package.json`.

## 6 Agustus 2026 — Edit kelas & tombol profil

- ✨ **New (Admin):** Data kelas bisa diedit langsung di tiap baris tabel Class Management.
- ⚡ **Improved (Admin):** Pilihan course saat membuat kelas kini berupa dropdown.
- ✨ **New:** Tombol profil di menu samping.

## 3 Agustus 2026 — Class Management memakai data asli

- 🔄 **Changed:** Halaman Class Management kini menampilkan data kelas yang tersimpan, bukan contoh.
- 🔄 **Changed:** Dashboard dibedakan sesuai peran pengguna.
- 🔄 **Changed (Teacher):** Guru hanya bisa melihat kelasnya sendiri.

## 30 Juli 2026 — Pembaruan sistem

- 🛠️ **Technical:** Upgrade ke Laravel 13.

## 4 Juni 2026 — Performa guru di dashboard

- ✨ **New (Teacher):** Nilai performa guru tampil di dashboard.
- 🛠️ **Technical:** Kolom baru `performance` di tabel `teachers`.

## 29 Mei 2026 — Logout

- ✨ **New:** Tombol logout di menu samping.

## 28 Mei 2026 — Halaman-halaman baru

- ✨ **New:** Halaman Class Offering, Module, Notification, Parent Meeting, Revenue, dan My Schedule.
- ⚠️ **Known Issue:** Halaman Module, Parent Meeting, Revenue, dan My Schedule masih berisi data contoh.

## 22 Mei 2026 — Class Management & menu samping

- ✨ **New:** Halaman Class Management untuk melihat daftar kelas.
- ✨ **New:** Menu samping (sidebar) untuk berpindah halaman.

## 19 Mei 2026 — Dashboard baru

- ⚡ **Improved:** Tampilan dashboard didesain ulang.

## 16 Mei 2026 — Versi pertama

- ✨ **New:** Halaman depan, login, register, lupa kata sandi, dan edit profil.
- 🛠️ **Technical:** Dibangun dengan Laravel + Breeze (React/TypeScript). Tabel awal: `students`, `teachers`, `courses`, `books`, `mood_trackers`, `course_meetings`, `attendances`, `curricula`, `course_interests`, `revenues`. Perubahan 17–18 Mei (kolom `teacher_id` nullable, model `AvailableCourse`) juga termasuk di sini.
