# PFG_web

Aplikasi manajemen sekolah/kelas. Laravel 13 + Inertia 2 + React 18 + TypeScript + Tailwind 3 (Vite). Tidak ada REST API terpisah: controller memanggil `Inertia::render('Folder/Halaman', props)` -> `resources/js/Pages/Folder/Halaman.tsx`.

## Perintah
- Dev server: `composer dev` (menjalankan server, queue, log, dan Vite sekaligus), atau `php artisan serve` + `npm run dev`
- Build/cek tipe: `npm run build`; lint: `npm run lint`
- Test: Pest (`php artisan test`); format PHP: Pint

## Struktur penting
- `app/Http/Controllers`, `app/Models`, `routes/web.php`, `database/migrations`
- `resources/js/Pages` (1 file = 1 halaman), `Components`, `Layouts`, `types`
- Nama route di React memakai Ziggy: `route('nama.route')`

## Dokumentasi (wajib dijaga)
- `docs/teknis/` (01-09): arsitektur, DB/model, routes, controller, frontend, alur fitur, testing, catatan masalah, panduan changelog
- `docs/guidebook/`: panduan pengguna per kategori (01 istilah & hak akses, 02 memulai, 03 admin, 04 guru, 05 siswa, 06 profil, 07 ringkasan alur, 08 pesan & solusi, 09 fitur dalam pengembangan; index di `docs/guidebook/README.md`)
- `docs/CHANGELOG.md`, `README.md` (halaman utama dokumentasi)

## Aturan kerja
1. Setiap perubahan kode yang memengaruhi sisi teknis (tabel, model, route, controller, halaman, komponen) atau alur pemakaian (langkah, tombol, syarat, pesan ke pengguna) WAJIB diikuti update dokumentasi di sesi yang sama.
2. "Update" = EDIT teks yang ada agar sesuai kode terbaru: ganti penjelasan usang, hapus bagian yang tidak relevan. Jangan menambah paragraf baru yang bertentangan dengan yang lama. Tambah bagian baru hanya untuk fitur baru.
3. Satu-satunya file yang ditambah (append) adalah `docs/CHANGELOG.md`: entri baru di paling atas, ikuti `docs/teknis/09-panduan-changelog.md`. Ringkasnya:
   - Ditulis untuk pengguna aplikasi (bahasa fitur, bukan nama file); label bahasa Inggris, kalimat bahasa Indonesia.
   - Label: ✨ New, ⚡ Improved, 🔄 Changed, ✅ Fixed, 🗑️ Removed, ⚠️ Known Issue, 🛠️ Technical (selalu paling bawah; boleh baris "File utama: ..." berisi nama file tanpa path lengkap, maks 3-4 file).
   - Tandai peran: (Admin), (Teacher), (Student). Tanpa tanda berarti berlaku untuk semua.
   - Satu entri per tanggal; tanpa commit ID & nama penulis.
   - Perubahan dokumentasi TIDAK dicatat di changelog.
4. Guidebook: bila alur atau tampilan berubah, perbarui langkah, blok **Prasyarat**, tabel pesan, dan tautan 📘 Detail teknis (format `../teknis/...`).
5. Jika memperbaiki item di `docs/teknis/08-catatan-dan-masalah.md`, hapus item itu dari daftar.
6. Perbarui `README.md` root jika ada file dokumentasi baru.
7. Di ringkasan akhir, sebutkan dokumen mana saja yang diperbarui.

## Alur tim
- Keputusan akhir ada pada kepala tim IT. Perubahan di-review sebelum merge; kerjakan di branch terpisah.
- (Tambahkan konvensi commit/branch, bahasa UI, dsb. di sini setelah disepakati.)
