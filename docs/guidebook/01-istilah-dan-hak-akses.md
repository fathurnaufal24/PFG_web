# Istilah & Hak Akses

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Arti istilah yang dipakai di aplikasi, tahapan kelas, dan apa saja yang boleh dilakukan tiap peran.

---

## Istilah Penting

| Istilah | Arti |
|---------|------|
| **Course** | Program atau mata pelajaran, ditulis dengan kode singkat. Contoh: `QV` (Quranic Vibrance), `EQD` (Emotional Quotient Development), `STEM` (STEM Creativity). |
| **Class Offering** | Penawaran kelas yang dibuat admin agar guru bisa melamar untuk mengajar. |
| **Apply / Lamaran** | Pengajuan diri guru untuk mengajar sebuah class offering. |
| **Preferensi Jadwal** | Pilihan hari dan waktu mengajar yang disediakan admin di sebuah offering, mis. *Senin – Pagi*. Guru memilih salah satu saat melamar. |
| **Deadline (Close Offering)** | Batas waktu melamar. Setelah lewat, offering otomatis diarsipkan. |
| **Class Management** | Daftar kelas yang sudah memiliki guru, beserta tahapannya. |
| **Tipe Kelas** | `Trial` (kelas percobaan), `Regular` (kelas kelompok), `Private` (kelas privat/satu siswa). |
| **Level, Period, Order** | Level = tingkat kelas. Period = periode. Order = urutan kelas dalam periode yang sama. |
| **ID Kelas** | Kode unik kelas yang dibuat otomatis dari *course–period.order*, mis. `QV-2.1`. Di tabel tampil sebagai `QV – 2.1` (ditambah `– P1` untuk kelas trial). |
| **Set Time** | Proses admin membuat jadwal pertemuan mingguan untuk sebuah kelas. |
| **Lesson Plan** | Rencana pembelajaran yang wajib diisi guru sebelum kelas aktif. |
| **Cognitive Development (C1–C6)** | Tingkat kemampuan berpikir yang ditargetkan dalam lesson plan: C1 Remember, C2 Understanding, C3 Apply, C4 Analyze, C5 Evaluate, C6 Create. |
| **Session** | Satu kali pertemuan kelas. |
| **Parent Meeting (PM)** | Pertemuan dengan orang tua siswa di akhir kelas. |

### Tahapan (status) kelas

Setiap kelas melewati tahapan berikut secara berurutan:

| Tahap | Artinya |
|-------|---------|
| **Lesson Plan** | Kelas baru dibuat. Admin perlu mengatur jadwal (Set Time), lalu guru mengisi lesson plan. |
| **Active** | Lesson plan sudah diisi. Kelas berjalan. |
| **Report** | Tahap pembuatan laporan siswa. |
| **Parent Meeting** | Tahap pertemuan dengan orang tua. |
| **Class Ended** | Kelas selesai. |

> 📘 **Detail teknis:** [Status kelas di database](../teknis/02-database-dan-model.md#class_management--model-classmanagement) · [Alur fitur](../teknis/06-alur-fitur.md#alur-utama-dari-penawaran-kelas-sampai-kelas-selesai)


---

## Peran Pengguna & Hak Akses

PFG Portal memiliki tiga peran. Menu dan tombol yang tampil menyesuaikan peran akun yang sedang masuk.

| Kegiatan | Admin | Guru | Siswa |
|----------|:-----:|:----:|:-----:|
| Melihat dashboard | ✅ | ✅ | ✅ |
| Membuat, mengubah, menghapus class offering | ✅ | – | – |
| Melamar class offering | – | ✅ | – |
| Menerima/menolak lamaran guru | ✅ | – | – |
| Melihat daftar kelas | Semua kelas | Hanya kelas sendiri | – |
| Menambah kelas langsung | ✅ | ✅ (otomatis menjadi kelas sendiri) | – |
| Mengubah dan menghapus kelas | ✅ | – | – |
| Mengatur jadwal kelas (Set Time) | ✅ | – | – |
| Mengisi lesson plan | – | ✅ | – |
| Menerima notifikasi | – | ✅ | ✅ |
| Mengatur kapasitas siswa (Settings) | ✅ | – | – |
| Mengubah profil & kata sandi | ✅ | ✅ | ✅ |

Jika Anda membuka halaman atau menjalankan aksi yang bukan hak peran Anda, aplikasi menampilkan halaman **403 Forbidden**.

> 📘 **Detail teknis:** [Daftar route dan aksesnya](../teknis/03-routes.md)

---

[← Daftar isi Guidebook](README.md) · [Memulai & Mengenal Tampilan →](02-memulai.md)
