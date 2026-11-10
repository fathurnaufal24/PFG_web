# Panduan Admin

[Daftar isi Guidebook](README.md) · [Halaman utama](../../README.md)

Settings, class offering, menerima/menolak guru, membuat kelas, dan mengatur jadwal (Set Time).

---

## 1. Dashboard admin

Menampilkan jumlah total **kelas**, **guru**, dan **siswa** yang terdaftar.

## 2. Mengatur kapasitas siswa per tipe kelas (Settings)

Admin menentukan berapa siswa maksimal untuk setiap tipe kelas. Nilai ini **otomatis dipakai** setiap kali kelas atau class offering baru dibuat, sehingga kapasitas tidak perlu diisi manual.

> **Prasyarat:** Masuk sebagai admin.

1. Buka menu **Settings**.
2. Ubah angka untuk **Trial**, **Regular**, dan/atau **Private** (1–100).
3. Klik **Save**.

> **Catatan:**
> - Nilai awal: Trial 5, Regular 8, Private 1.
> - Perubahan **tidak** mengubah kapasitas kelas yang sudah ada. Kapasitas kelas lama hanya ikut diperbarui jika tipe kelasnya diganti.
> - Sebaiknya atur Settings sebelum membuat offering atau kelas.

> 📘 **Detail teknis:** [SettingController](../teknis/04-controller-backend.md#settingcontroller) · [Tabel class_type_settings](../teknis/02-database-dan-model.md#class_type_settings--model-classtypesetting)

## 3. Membuat class offering

Class offering dipakai untuk mencari guru pengajar sebuah kelas.

> **Prasyarat:**
> - Masuk sebagai admin.
> - Course (mata pelajaran) yang akan ditawarkan sudah tersedia di sistem.

1. Buka menu **Class Offering**, lalu klik **Add Offering**.
2. Isi formulir:
   - **Course** dan **Class Type** (Trial/Regular/Private).
   - **Level**, **Period**, dan **Order**.
   - **Preferensi jadwal**: pilih hari dan waktu (Pagi/Siang/Sore/Malam). Klik tombol tambah untuk memberi lebih dari satu pilihan; klik ikon hapus untuk membuang pilihan.
   - **Jadwal rencana** (opsional).
   - **Add Deadline** (opsional): centang lalu isi batas waktu melamar.
   - **Note** (opsional).
   - **Archived (hide from teachers)**: centang jika offering belum ingin ditampilkan ke guru.
3. Klik **Create Offering**.

> **Syarat pengisian:**
> - Minimal **satu** preferensi jadwal dengan hari dan waktu terisi.
> - Jika **Add Deadline** dicentang, tanggal deadline **wajib diisi**, harus **setelah waktu sekarang**, dan harus **sebelum** jadwal rencana.

> 📘 **Detail teknis:** [ClassOfferingController@store](../teknis/04-controller-backend.md#storerequest-request-1) · [Tabel class_offerings](../teknis/02-database-dan-model.md#class_offerings--model-classoffering)

## 4. Mencari, mengubah, dan menghapus offering

- **Mencari:** ketik di kolom **Search offerings...**.
- **Melihat offering lama:** klik **Show Archived** untuk menampilkan offering yang diarsipkan atau sudah lewat deadline. Klik lagi (**Showing Archived**) untuk kembali.
- **Mengubah:** klik ikon pensil (**Edit**) di kartu offering, ubah data, lalu klik **Update Offering**.
- **Menghapus:** klik ikon tempat sampah (**Delete**), lalu konfirmasi. Semua lamaran pada offering tersebut ikut terhapus.

> **Catatan:** Offering yang deadline-nya sudah lewat **diarsipkan otomatis** setiap kali halaman Class Offering dibuka. Kartu tersebut diberi label **Expired** atau **Archived**.

## 5. Menerima atau menolak lamaran guru

> **Prasyarat:** Sudah ada guru yang melamar offering tersebut.

1. Di kartu offering, klik **Show Applications (n)**. Daftar pelamar muncul beserta jadwal yang mereka pilih.
2. Pilih tindakan:
   - **Approve** — menerima guru. Periksa ringkasan di jendela konfirmasi, lalu setujui.
   - **Reject** — menolak guru. Konfirmasi di jendela yang muncul.

**Yang terjadi setelah Approve:**
1. Guru terpilih menerima notifikasi *"Selamat anda diterima!"*.
2. **Semua pelamar lain otomatis ditolak** dan menerima notifikasi *"Mohon maaf anda belum diterima"*.
3. **Kelas baru otomatis dibuat** di Class Management pada tahap **Lesson Plan**, dengan hari dan waktu sesuai pilihan guru.
4. Offering diarsipkan dan tidak bisa dilamar lagi.

**Yang terjadi setelah Reject:** guru tersebut menerima notifikasi penolakan dan lamarannya dihapus. Offering tetap terbuka untuk pelamar lain.

> **Catatan:** Approve akan gagal jika sudah ada kelas dengan ID yang sama (course, period, dan order sama). Ubah period atau order offering terlebih dahulu, lalu coba lagi.

> 📘 **Detail teknis:** [ClassOfferingController@approve](../teknis/04-controller-backend.md#approverequest-request-classoffering-classoffering-applicationid)

## 6. Melihat daftar kelas (Class Management)

Buka menu **Class Management**. Halaman ini menampilkan:
- **Lima kartu tahap** (Lesson Plan, Active, Report, Parent Meeting, Class Ended) beserta jumlah kelasnya. Klik kartu untuk menampilkan kelas pada tahap tersebut.
- **Filter tipe** (All/Trial/Regular/Private) dan kolom pencarian berdasarkan subject atau nama guru.
- Tabel kelas: No, Subject, Level, Type, Session, Release Schedule, Students, Teacher, Actions.

Klik sebuah baris untuk membuka [halaman detail kelas](04-panduan-guru.md#5-halaman-detail-kelas).

## 7. Menambah kelas secara langsung

Selain melalui offering, admin dapat membuat kelas langsung jika gurunya sudah ditentukan.

> **Prasyarat:** Masuk sebagai admin dan berada di tab **Lesson Plan** (tombol tambah hanya muncul di tab ini).

1. Klik **Add Class**.
2. Isi **Course**, **Type**, **Level**, **Period**, **Order**, dan opsional **Start Schedule** serta **Note**.
3. Klik **Create Class**.

Kelas baru berada di tahap **Lesson Plan**. ID kelas dibuat otomatis.

> **Catatan:** Kombinasi course + period + order harus unik. Jika sudah dipakai, muncul pesan *"Class ID … sudah digunakan."*

> 📘 **Detail teknis:** [ClassManagementController@store](../teknis/04-controller-backend.md#storerequest-request) · [Cara ID kelas dibuat](../teknis/06-alur-fitur.md#5-id-kelas)

## 8. Mengatur jadwal kelas (Set Time)

Langkah ini **wajib** dilakukan admin sebelum guru bisa mengisi lesson plan.

> **Prasyarat:**
> - Masuk sebagai admin.
> - Kelas berada di tahap **Lesson Plan**.

1. Di tab **Lesson Plan**, klik **Set Time** pada kelas yang dimaksud. (Jika jadwal sudah pernah dibuat, tombolnya bertuliskan **Edit Time**.)
2. Periksa isian yang terisi otomatis:
   - **Tanggal mulai** — otomatis diisi hari terdekat sesuai pilihan guru.
   - **Jam mulai** — default 09:00.
   - **Meeting Count** — jumlah pertemuan, default 10 (maksimal 20).
3. Ubah jika perlu, lalu simpan.

Aplikasi membuat jadwal **mingguan**: pertemuan ke-1 di tanggal mulai, pertemuan ke-2 seminggu kemudian, dan seterusnya.

> **Syarat & catatan:**
> - Tanggal mulai harus **setelah hari ini** (paling cepat besok).
> - Menekan **Edit Time** lalu menyimpan akan **mengganti seluruh jadwal lama**.
> - Kotak *"Start this week"* saat ini belum memengaruhi hasil; jadwal selalu dimulai dari tanggal yang Anda pilih.
> - Selama kelas masih di tahap Lesson Plan, tombol Edit dan Delete untuk kelas itu disembunyikan dan digantikan tombol Set Time.

> 📘 **Detail teknis:** [ClassManagementController@setTime](../teknis/04-controller-backend.md#settimerequest-request-classmanagement-classmanagement) · [Tabel class_schedules](../teknis/02-database-dan-model.md#class_schedules--model-classschedule)

## 9. Mengubah dan menghapus kelas

> **Prasyarat:** Masuk sebagai admin, dan kelas sudah **bukan** di tahap Lesson Plan.

- **Mengubah:** klik ikon pensil (**Edit**), ubah data, lalu klik **Update Class**.
- **Menghapus:** klik ikon tempat sampah (**Delete**), lalu konfirmasi. Jadwal dan lesson plan kelas ikut terhapus dan **tidak dapat dikembalikan**.

> **Catatan:** Mengubah period atau order **tidak mengubah ID kelas** yang sudah ada.

---

[← Memulai & Mengenal Tampilan](02-memulai.md) · [Panduan Guru (Teacher) →](04-panduan-guru.md)
