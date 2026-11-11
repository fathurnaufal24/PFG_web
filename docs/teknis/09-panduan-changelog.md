# 09 · Panduan Menulis Changelog

[← Kembali ke README](../../README.md)

Aturan menulis entri di [CHANGELOG](../CHANGELOG.md). Changelog dibaca umum, tapi **pengguna aplikasi (admin, guru, siswa) diutamakan**.

## Aturan

1. **Tulis apa yang dilihat atau dilakukan pengguna**, bukan nama file. Contoh: "Admin bisa mengatur kapasitas kelas di halaman Settings", bukan "Tambah `SettingController`".
2. **Label bahasa Inggris, isi kalimat bahasa Indonesia.**
3. **Satu entri per tanggal.** Perubahan di hari yang sama digabung jadi satu entri dengan satu judul singkat.
4. **Sebut peran yang terdampak** dalam bahasa Inggris: `(Admin)`, `(Teacher)`, `(Student)`. Tanpa tanda berarti berlaku untuk semua.
5. **Tidak perlu** commit ID dan nama penulis.
6. **Perubahan dokumentasi tidak dicatat.**
7. **Perubahan yang tidak terasa oleh pengguna** (upgrade library, konfigurasi server, struktur database) hanya ditulis di poin 🛠️ **Technical**.
8. Entri terbaru ditaruh di **paling atas**, di bawah garis `---`.

## Label

Urutkan poin sesuai urutan tabel ini. 🛠️ **Technical** selalu paling bawah.

| Label | Emoji | Dipakai untuk |
|---|---|---|
| **New** | ✨ | Fitur atau halaman baru |
| **Improved** | ⚡ | Fitur lama jadi lebih baik atau lebih mudah dipakai |
| **Changed** | 🔄 | Cara kerja fitur berubah (pengguna perlu tahu) |
| **Fixed** | ✅ | Masalah yang sudah diperbaiki |
| **Removed** | 🗑️ | Fitur yang dihapus |
| **Known Issue** | ⚠️ | Masalah yang belum diperbaiki |
| **Technical** | 🛠️ | Catatan untuk developer |

## Poin Technical

- Tulis hal yang perlu diketahui developer: tabel baru, perintah yang harus dijalankan (`php artisan migrate`), library baru, perubahan konfigurasi.
- Kalau perlu menyebut file, tambahkan baris **File utama** di bawahnya. Cukup nama file tanpa path lengkap, maksimal 3–4 file.
- Kalau tidak ada catatan untuk developer, poin ini tidak perlu ditulis.

## Template

```markdown
## 10 Oktober 2026 — Judul singkat perubahan

- ✨ **New (Admin):** ...
- ⚡ **Improved:** ...
- 🔄 **Changed (Teacher):** ...
- ✅ **Fixed:** ...
- 🗑️ **Removed:** ...
- ⚠️ **Known Issue (Student):** ...
- 🛠️ **Technical:** ...
  File utama: `NamaFile.php`, `NamaHalaman.tsx`
```

Hapus label yang tidak dipakai.

## Contoh

```markdown
## 10 Oktober 2026 — Pengaturan kapasitas kelas

- ✨ **New (Admin):** Halaman **Settings** untuk mengatur jumlah maksimal siswa per tipe kelas. Bawaannya: Trial 5, Regular 8, Private 1.
- 🔄 **Changed (Admin):** Jumlah siswa saat membuat kelas atau penawaran kelas kini terisi otomatis dari Settings, tidak diisi manual lagi.
- ✅ **Fixed:** Halaman Class Offering yang sebelumnya error.
- 🛠️ **Technical:** Tabel baru `class_type_settings`, jalankan `php artisan migrate`.
  File utama: `SettingController.php`, `ClassTypeSetting.php`, `Setting/Index.tsx`
```

Tips: lihat daftar file yang berubah dengan `git show --name-status HEAD` untuk mengisi poin Technical.
