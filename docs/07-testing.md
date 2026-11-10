# 07 · Testing

[← Kembali ke README](../README.md)

Project memakai **Pest** (di atas PHPUnit). Konfigurasi ada di `phpunit.xml` dan `tests/Pest.php`.

## Menjalankan Test

```bash
php artisan test
# atau
./vendor/bin/pest

# satu file saja
./vendor/bin/pest tests/Feature/ClassManagement/ClassManagementAccessTest.php
```

`tests/Pest.php` mengatur agar semua test di folder `Feature` memakai `Tests\TestCase` dan `RefreshDatabase` (database di-reset setiap test, jadi data asli tidak tersentuh).

## Daftar Test

### Test buatan sendiri

**`tests/Feature/ClassManagement/ClassManagementAccessTest.php`** (ditambahkan oleh `fathurnaufal24`, 2026-09-15)

| Nama test | Yang diuji |
|-----------|-----------|
| admin can open the class management create form | Admin membuka `/classmanagement/create` → 200 OK |
| admin can open the class management edit form | Admin membuka `/classmanagement/{id}/edit` → 200 OK |
| admin can create a class without sending internal status fields | POST `/classmanagement` tanpa `status` → status otomatis `inactive`, note `''` |
| admin can update a class with a string period code | PUT dengan `period = '2026-Q4'` berhasil |
| teacher can create a class assigned to themselves | Teacher membuat kelas → `teacher_id` otomatis miliknya |
| admin can generate weekly schedules for a class | POST `/set-time` dengan 4 pertemuan jam 09:30 → 4 jadwal dibuat, jam & tanggal pertama benar |
| assigned teacher can create one lesson plan and activate the class | Teacher membuat lesson plan → 1 lesson plan tersimpan, status kelas jadi `active` |

### Test bawaan Breeze

| File | Yang diuji |
|------|-----------|
| `tests/Feature/Auth/AuthenticationTest.php` | Login & logout |
| `tests/Feature/Auth/RegistrationTest.php` | Register (sudah disesuaikan untuk field `role`) |
| `tests/Feature/Auth/EmailVerificationTest.php` | Verifikasi email |
| `tests/Feature/Auth/PasswordConfirmationTest.php` | Konfirmasi password |
| `tests/Feature/Auth/PasswordResetTest.php` | Reset password |
| `tests/Feature/Auth/PasswordUpdateTest.php` | Ganti password |
| `tests/Feature/ProfileTest.php` | Halaman & update profil |
| `tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php` | Contoh |

> Beberapa test bawaan Breeze mungkin gagal karena alur profil dan register sudah diubah (mis. profil memerlukan relasi teacher/student/curriculum). Jalankan test untuk memastikan.

## Fitur yang Belum Punya Test

- Class Offering (create, apply, approve, reject, auto-archive)
- Notifikasi
- Settings
- Dashboard per role
- Pembuatan ID kelas & error ID duplikat
