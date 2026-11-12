# Memulai & Mengenal Tampilan

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Mendaftar, masuk, lupa kata sandi, keluar, serta mengenal menu samping, notifikasi, dan pesan konfirmasi.

---

## Tema Terang dan Gelap

Ada tiga pilihan tema pada kontrol **Sistem / Terang / Gelap** di bagian bawah menu samping (pada halaman lupa/reset kata sandi, di bawah kotak form):\n\n| Pilihan | Hasil |\n|---|---|\n| Sistem (bawaan) | Mengikuti tema OS/browser Anda secara otomatis |\n| Terang | Selalu tampil terang |\n| Gelap | Selalu tampil gelap |\n\nPilihan tersimpan di browser yang Anda pakai. Menu samping dan halaman depan selalu tampil dengan warna aslinya.

📘 Detail teknis: [Tema Terang/Gelap](../teknis/05-frontend.md#tema-teranggelap)

---

## Memulai: Akun, Masuk, dan Keluar

### Membuka aplikasi

Buka alamat aplikasi di browser. Halaman depan menampilkan informasi tentang PFG. Di kanan atas terdapat tombol:
- **Sign In** — untuk masuk ke akun.
- **Daftar** — untuk membuat akun baru.
- **Dashboard** — muncul menggantikan dua tombol di atas jika Anda sudah masuk.

### Mendaftar akun baru

> **Prasyarat:** Anda belum memiliki akun dan sedang tidak masuk ke akun mana pun.

1. Klik **Daftar** di halaman depan, atau **Daftar Sekarang** di halaman masuk.
2. Isi **Nama Lengkap**, **Email**, **Kata Sandi**, dan **Konfirmasi Kata Sandi**.
3. Klik tombol daftar. Jika berhasil, Anda langsung masuk dan diarahkan ke Dashboard.

> **Catatan:**
> - Akun yang dibuat lewat halaman pendaftaran selalu berperan **siswa**.
> - Akun **guru** dan **admin** tidak bisa dibuat lewat halaman ini. Hubungi pengelola sistem untuk mendapatkannya.
> - Email harus belum pernah dipakai akun lain. Kata sandi dan konfirmasinya harus sama.
> - Tombol daftar dengan Google/Facebook belum berfungsi.

> 📘 **Detail teknis:** [Proses registrasi](../teknis/04-controller-backend.md#controller-auth)

### Masuk (Login)

> **Prasyarat:** Anda sudah memiliki akun.

1. Klik **Sign In** di halaman depan.
2. Isi **email** dan **kata sandi**.
3. Klik tombol masuk. Jika berhasil, Anda diarahkan ke **Dashboard**.

> **Catatan:**
> - Semua halaman selain halaman depan, masuk, dan daftar **mengharuskan Anda masuk terlebih dahulu**. Jika Anda membuka halaman tersebut tanpa masuk, aplikasi mengarahkan Anda ke halaman masuk. Setelah berhasil masuk, Anda dikembalikan ke halaman yang tadi dituju.
> - Kolom masuk bertuliskan *"Nomor HP atau Email"*, tetapi saat ini hanya **email** yang dapat digunakan.
> - Jika salah memasukkan kata sandi **5 kali**, akun dikunci sementara (sekitar 1 menit). Tunggu, lalu coba lagi.

> 📘 **Detail teknis:** [LoginRequest dan pembatasan percobaan](../teknis/04-controller-backend.md#form-request)

### Lupa kata sandi

1. Di halaman masuk, klik **Lupa Kata Sandi?**.
2. Masukkan email akun Anda. Aplikasi mengirim tautan atur ulang kata sandi ke email tersebut.
3. Buka tautan di email, lalu buat kata sandi baru.

> **Prasyarat:** Server aplikasi sudah dikonfigurasi untuk mengirim email. Jika email tidak kunjung datang, hubungi pengelola sistem.

### Keluar (Logout)

Klik **Logout** di bagian paling bawah menu samping (sidebar).


---

## Mengenal Tampilan Aplikasi

Setelah masuk, setiap halaman terdiri dari **menu samping (sidebar)** di kiri dan **isi halaman** di kanan. Di layar ponsel, sidebar tersembunyi; buka dengan tombol **☰** di kanan atas.

### Menu samping

Bagian atas sidebar menampilkan kartu berisi inisial dan nama Anda. Klik kartu tersebut untuk membuka [halaman profil](06-profil.md).

Menu yang tampil tergantung peran:

| Admin | Guru | Siswa |
|-------|------|-------|
| Dashboard | Dashboard | Dashboard |
| Class Management | Class Management | Kelas Saya |
| Revenue | Revenue | Jadwal Saya |
| My Schedule | My Schedule | Modul Belajar |
| Module | Module | Class Offering |
| Class Offering | Class Offering | Notifications |
| Notifications | Notifications | |
| Parent Meeting | Parent Meeting | |
| **Settings** | | |

### Notifikasi

Angka merah di menu **Notifications** menunjukkan jumlah notifikasi yang belum dibaca. Notifikasi saat ini dikirim otomatis ketika lamaran guru diterima atau ditolak.

Di halaman Notifications:
- Klik sebuah notifikasi untuk menandainya sudah dibaca dan membuka halaman terkait.
- Klik **Mark as read** untuk menandai satu notifikasi tanpa membukanya.
- Klik **Mark all as read** untuk menandai semua sekaligus.

> **Catatan:** Admin tidak menerima notifikasi dan tidak melihat angka di menu ini.

> 📘 **Detail teknis:** [NotificationController](../teknis/04-controller-backend.md#notificationcontroller) · [Tabel notifications](../teknis/02-database-dan-model.md#notifications--model-notification)

### Pesan konfirmasi

Setelah menyimpan, mengubah, atau menghapus data, muncul kotak pesan di bagian atas halaman: **hijau** jika berhasil, **merah** jika gagal. Klik **×** untuk menutupnya.

---

[← Istilah & Hak Akses](01-istilah-dan-hak-akses.md) · [Panduan Admin →](03-panduan-admin.md)
