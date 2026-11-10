# Panduan Guru (Teacher)

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Melamar class offering, memantau lamaran, mengisi lesson plan, dan halaman detail kelas.

---

## 1. Dashboard guru

Menampilkan sapaan, **skor performa** Anda dibandingkan standar 75%, dan daftar *Pending Attendance*.

## 2. Melamar class offering

> **Prasyarat:**
> - Masuk dengan akun **guru**.
> - Offering masih terbuka: belum diarsipkan dan belum melewati deadline.
> - Anda belum pernah melamar offering tersebut.

1. Buka menu **Class Offering**.
2. Pada kartu offering yang diinginkan, klik **Apply Now**.
3. Di jendela **Pilih Jadwal Mengajar**, pilih salah satu preferensi hari dan waktu. (Jika hanya ada satu pilihan, pilihan itu otomatis terpilih.)
4. Klik **Konfirmasi & Apply**.

> **Catatan:**
> - Setiap offering hanya bisa dilamar **satu kali**. Pilihan jadwal tidak dapat diubah setelah dikirim.
> - Jika tombol bertuliskan **Offering archived** atau **Not available**, offering sudah ditutup.
> - Jika muncul *"Offering ini belum memiliki opsi waktu"*, hubungi admin.

> 📘 **Detail teknis:** [ClassOfferingController@apply](../teknis/04-controller-backend.md#applyrequest-request-classoffering-classoffering)

## 3. Memantau status lamaran

Setelah melamar, kartu offering menampilkan status:

| Status | Arti |
|--------|------|
| ⏳ **Waiting for approval...** | Menunggu keputusan admin. |
| ❌ **Rejected** | Lamaran ditolak. |

Anda juga menerima **notifikasi** saat admin mengambil keputusan.

Jika lamaran **diterima**, kartu offering hilang dari halaman Class Offering, dan **kelasnya muncul di menu Class Management** pada tab **Lesson Plan**.

## 4. Mengisi lesson plan

Lesson plan wajib diisi agar kelas bisa dimulai.

> **Prasyarat:**
> - Masuk sebagai **guru pengajar** kelas tersebut.
> - Kelas berada di tahap **Lesson Plan**.
> - **Admin sudah mengatur jadwal (Set Time)** untuk kelas ini.
> - Kelas belum memiliki lesson plan.

1. Buka **Class Management**, lalu tab **Lesson Plan**.
2. Klik **Start Lesson Plan** pada kelas Anda.
3. Isi formulir:
   - **Cognitive Development** — centang minimal satu dari C1–C6.
   - **Learning Model** — mis. *Cooperative Learning*, *Project Based Learning*.
   - **Learning Method** — mis. *Discussion, Demonstration, Simulation*.
   - **Purpose** — tujuan pembelajaran.
   - **Output** — hasil yang diharapkan.
   - **Outcome** — dampak/kemampuan yang diharapkan pada siswa.
4. Simpan.

Setelah tersimpan, kelas otomatis pindah ke tahap **Active**.

> **Catatan:**
> - Jika admin belum mengatur jadwal, muncul jendela **"Admin Belum Mengatur Jam"**. Hubungi admin, lalu ulangi setelah jadwal dibuat.
> - Setiap kelas hanya memiliki **satu** lesson plan dan tidak dapat diisi ulang.
> - Selama kelas di tahap Lesson Plan, baris kelas **tidak dapat diklik** untuk membuka detail.

> 📘 **Detail teknis:** [ClassManagementController@storeLessonPlan](../teknis/04-controller-backend.md#storelessonplanrequest-request-classmanagement-classmanagement) · [Tabel lesson_plans](../teknis/02-database-dan-model.md#lesson_plans--model-lessonplan)

## 5. Halaman detail kelas

> **Prasyarat:**
> - Kelas adalah kelas Anda sendiri (guru tidak dapat membuka kelas guru lain).
> - Kelas **sudah melewati** tahap Lesson Plan.

Buka **Class Management**, pilih tab tahap yang sesuai (mis. **Active**), lalu klik baris kelas.

Bagian atas halaman menampilkan nama guru, jadwal, level, dan link kelas. Di bawahnya terdapat empat bagian yang dapat dibuka-tutup:

| Bagian | Isi |
|--------|-----|
| **Start Lesson Plan** | Lesson plan yang sudah diisi. |
| **Start Active Class** | Tombol **Open Room / Close Room**, tabel absensi siswa per sesi (Hadir, Sakit, Izin, Tidak Hadir, Belum Absen), dan riwayat sesi. |
| **Start Report** | Unggah laporan untuk setiap siswa. |
| **Start Parent Meeting** | Status pertemuan orang tua per siswa (Lanjut, Belum PM) dan tombol **Class Ends**. |

> **Catatan penting:** Saat ini hanya **daftar sesi** dan **lesson plan** yang berasal dari data asli. Daftar siswa, absensi, laporan, riwayat sesi, dan parent meeting masih berupa **data contoh**. Perubahan pada bagian tersebut **tidak tersimpan** dan hilang saat halaman dimuat ulang. Lihat [Fitur yang Masih Dalam Pengembangan](09-fitur-dalam-pengembangan.md).

> 📘 **Detail teknis:** [Isi data halaman detail](../teknis/04-controller-backend.md#classroompayloadclassmanagement-class-private) · [Halaman Show.tsx](../teknis/05-frontend.md#classmanagementshowtsx--detail-kelas-classmanagementid)

## 6. Menambah kelas sendiri

Guru juga dapat membuat kelas secara langsung dengan langkah yang sama seperti [admin](03-panduan-admin.md#7-menambah-kelas-secara-langsung). Kelas yang dibuat guru **otomatis tercatat sebagai kelas guru tersebut**.

> **Catatan:** Guru tidak dapat mengubah atau menghapus kelas. Hubungi admin jika ada data yang salah.

---

[← Panduan Admin](03-panduan-admin.md) · [Panduan Siswa (Student) →](05-panduan-siswa.md)
