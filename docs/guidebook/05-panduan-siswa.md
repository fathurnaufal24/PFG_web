# Panduan Siswa (Student)

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Dashboard siswa dan menu yang tersedia untuk siswa.

---

## 1. Dashboard siswa

Menampilkan:
- jumlah kelas yang Anda ikuti dan yang masih menunggu persetujuan,
- jadwal pertemuan terdekat,
- daftar kelas yang Anda ikuti beserta guru dan jadwalnya.

Jika Anda belum terdaftar di kelas mana pun, muncul pesan *"Kamu belum terdaftar di kelas manapun"* dengan tombol **Daftar Kelas Sekarang** yang mengarah ke halaman Class Offering.

## 2. Menu lain untuk siswa

| Menu | Keterangan |
|------|-----------|
| **Kelas Saya** | Membuka halaman daftar kelas. Saat ini selalu kosong untuk siswa. |
| **Jadwal Saya**, **Modul Belajar** | Masih berupa tampilan contoh. |
| **Class Offering** | Siswa dapat melihat daftar offering, tetapi **tidak dapat melamar** karena melamar khusus guru. Tombol **Apply Now** tetap tampil, tetapi jika ditekan akan muncul halaman 403. |
| **Notifications** | Notifikasi untuk akun Anda. |

> **Catatan:** Fitur pendaftaran siswa ke kelas **belum tersedia**. Saat ini siswa belum bisa memasukkan dirinya ke kelas, dan admin/guru juga belum bisa menambahkan siswa. Lihat [Fitur yang Masih Dalam Pengembangan](09-fitur-dalam-pengembangan.md).

> 📘 **Detail teknis:** [DashboardController](../teknis/04-controller-backend.md#dashboardcontroller) · [Tabel class_students](../teknis/02-database-dan-model.md#class_students--model-classstudent)

---

[← Panduan Guru (Teacher)](04-panduan-guru.md) · [Mengelola Profil →](06-profil.md)
