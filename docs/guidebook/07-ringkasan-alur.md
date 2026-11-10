# Ringkasan Alur dari Awal sampai Kelas Berjalan

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Urutan langkah lintas peran beserta syarat tiap langkah.

---

| Langkah | Siapa | Di menu | Syarat sebelum langkah ini | Hasil |
|:-------:|-------|---------|----------------------------|-------|
| 1 | Admin | Settings | – | Kapasitas siswa per tipe kelas ditentukan |
| 2 | Admin | Class Offering → **Add Offering** | Course tersedia | Offering terbuka untuk guru |
| 3 | Guru | Class Offering → **Apply Now** | Offering terbuka, belum pernah melamar | Lamaran menunggu keputusan |
| 4 | Admin | Class Offering → **Approve** | Ada lamaran | Kelas baru di tahap **Lesson Plan**; guru dapat notifikasi |
| 5 | Admin | Class Management → **Set Time** | Kelas di tahap Lesson Plan | Jadwal mingguan terbentuk |
| 6 | Guru | Class Management → **Start Lesson Plan** | Jadwal sudah dibuat (langkah 5) | Kelas pindah ke tahap **Active** |
| 7 | Guru | Class Management → klik baris kelas | Kelas sudah **Active** | Halaman detail kelas terbuka |

Langkah 2–4 dapat dilewati jika admin atau guru langsung membuat kelas lewat **Add Class**.

> 📘 **Detail teknis:** [Diagram alur lengkap](../teknis/06-alur-fitur.md#alur-utama-dari-penawaran-kelas-sampai-kelas-selesai)

---

[← Mengelola Profil](06-profil.md) · [Pesan yang Sering Muncul & Solusinya →](08-pesan-dan-solusi.md)
