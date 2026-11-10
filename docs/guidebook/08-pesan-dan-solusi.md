# Pesan yang Sering Muncul & Solusinya

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Arti pesan/error yang muncul dan cara mengatasinya.

---

| Pesan / kondisi | Penyebab | Solusi |
|-----------------|----------|--------|
| Diarahkan ke halaman masuk | Anda belum masuk atau sesi berakhir | Masuk kembali |
| **403 Forbidden** | Halaman/aksi bukan untuk peran Anda, atau kelas milik guru lain | Gunakan akun dengan peran yang sesuai |
| Terlalu banyak percobaan masuk | Salah kata sandi 5 kali | Tunggu sekitar 1 menit |
| **Admin Belum Mengatur Jam** | Kelas belum memiliki jadwal | Minta admin melakukan Set Time |
| *"Kelas masih dalam tahap Lesson Plan…"* | Guru membuka detail kelas yang belum memiliki lesson plan | Isi lesson plan terlebih dahulu |
| *"Class ID … sudah digunakan."* | Sudah ada kelas dengan course, period, dan order yang sama | Gunakan period atau order lain |
| *"Please set a deadline date."* | **Add Deadline** dicentang tetapi tanggal kosong | Isi tanggal atau hilangkan centang |
| *"Close offering must be before schedule date."* | Deadline sama dengan/sesudah jadwal rencana | Majukan deadline |
| *"This offering is no longer available."* | Offering sudah diarsip atau lewat deadline | Pilih offering lain |
| *"You have already applied for this offering."* | Sudah pernah melamar offering ini | Tunggu keputusan admin |
| *"This class already has a lesson plan."* | Lesson plan sudah pernah diisi | Tidak perlu diisi ulang |
| Tanggal Set Time ditolak | Tanggal mulai hari ini atau sebelumnya | Pilih tanggal mulai besok atau setelahnya |
| Gagal menyimpan profil (admin) | Kendala yang sudah diketahui pada penyimpanan profil admin | Laporkan ke pengembang ([detail](../teknis/08-catatan-dan-masalah.md#a-potensi-bug), butir A2) |
| Muncul halaman error (500) | Kesalahan di sisi server | Laporkan ke pengembang beserta langkah yang dilakukan |

---

[← Ringkasan Alur dari Awal sampai Kelas Berjalan](07-ringkasan-alur.md) · [Fitur yang Masih Dalam Pengembangan →](09-fitur-dalam-pengembangan.md)
