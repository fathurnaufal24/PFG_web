# 03 · Routes

[← Kembali ke README](../README.md)

Semua URL aplikasi. Sumber: `routes/web.php` dan `routes/auth.php`.

Keterangan kolom **Akses**:
- **publik** = siapa saja
- **guest** = hanya yang belum login
- **login** = harus login (middleware `auth`); pembatasan role dilakukan **di dalam controller** dengan `abort(403)`
- `{classmanagement}` berisi ID kelas berbentuk teks, mis. `QV-2.1`

> Tip: jalankan `php artisan route:list` untuk melihat daftar ini langsung dari Laravel.

## Halaman Publik

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/` | – | Closure → render `Welcome` | publik |
| GET | `/up` | – | Health check bawaan Laravel | publik |

## Dashboard & Profil

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/dashboard` | `dashboard` | `DashboardController@index` | login + email terverifikasi (`verified`) |
| GET | `/profile` | `profile.edit` | `ProfileController@edit` | login |
| PATCH | `/profile` | `profile.update` | `ProfileController@update` | login |
| DELETE | `/profile` | `profile.destroy` | `ProfileController@destroy` | login |

## Class Management

| Method | URL | Nama route | Handler | Akses (dicek di controller) |
|--------|-----|-----------|---------|------------------------------|
| GET | `/classmanagement` | `classmanagement` | `ClassManagementController@index` | admin: semua kelas; teacher: kelas miliknya; lainnya: kosong |
| GET | `/classmanagement/create` | `classmanagement.create` | `@create` | admin, teacher |
| GET | `/classmanagement/{classmanagement}` | `classmanagement.show` | `@show` | admin; teacher pemilik kelas (dan status bukan `inactive`) |
| GET | `/classmanagement/{classmanagement}/edit` | `classmanagement.edit` | `@edit` | admin |
| POST | `/classmanagement` | `classmanagement.store` | `@store` | admin, teacher |
| PUT | `/classmanagement/{classmanagement}` | `classmanagement.update` | `@update` | admin |
| DELETE | `/classmanagement/{classmanagement}` | `classmanagement.destroy` | `@destroy` | admin |
| POST | `/classmanagement/{classmanagement}/lesson-plan` | `classmanagement.lesson-plan.store` | `@storeLessonPlan` | teacher pemilik kelas |
| POST | `/classmanagement/{classmanagement}/set-time` | `classmanagement.set-time` | `@setTime` | admin |
| GET | `/classmanagement/{classmanagement}/schedule` | `classmanagement.schedule` | `@getSchedule` → **JSON** | login |
| GET | `/classmanagement/{classmanagement}/can-start-lesson` | `classmanagement.can-start-lesson` | `@canStartLessonPlan` → **JSON** | login |

### ⚠️ Route yang method-nya belum ada

Route berikut sudah didaftarkan, tetapi method-nya **tidak ada** di `ClassManagementController`. Jika dipanggil akan error 500 (*"Method does not exist"*):

| Method | URL | Nama route | Method yang dicari |
|--------|-----|-----------|--------------------|
| POST | `/classmanagement/{classmanagement}/approve` | `classmanagement.approve` | `approve` |
| POST | `/classmanagement/{classmanagement}/reject` | `classmanagement.reject` | `reject` |
| POST | `/classmanagement/{classmanagement}/enroll` | `classmanagement.enroll` | `enrollStudent` |
| POST | `/classmanagement/{classmanagement}/students` | `classmanagement.students.add` | `addStudent` |
| POST | `/classmanagement/{classmanagement}/students/{student}/approve` | `classmanagement.students.approve` | `approveStudent` |
| POST | `/classmanagement/{classmanagement}/students/{student}/reject` | `classmanagement.students.reject` | `rejectStudent` |
| DELETE | `/classmanagement/{classmanagement}/students/{student}` | `classmanagement.students.remove` | `removeStudent` |

## Class Offering

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/classoffering` | `classoffering` | `ClassOfferingController@index` | login (tampilan beda untuk admin & teacher) |
| POST | `/classoffering` | `classoffering.store` | `@store` | admin |
| PUT | `/classoffering/{classOffering}` | `classoffering.update` | `@update` | admin |
| DELETE | `/classoffering/{classOffering}` | `classoffering.destroy` | `@destroy` | admin |
| POST | `/classoffering/{classOffering}/apply` | `classoffering.apply` | `@apply` | teacher |
| POST | `/classoffering/{classOffering}/approve/{applicationId}` | `classoffering.approve` | `@approve` | admin |
| POST | `/classoffering/{classOffering}/reject/{applicationId}` | `classoffering.reject` | `@reject` | admin |

`{applicationId}` = `id` dari tabel `class_offering_teacher`.

## Notifikasi

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/notifications` | `notifications` | `NotificationController@index` | login |
| POST | `/notifications/{notification}/read` | `notifications.read` | `@markAsRead` | pemilik notifikasi |
| POST | `/notifications/mark-all-read` | `notifications.mark-all-read` | `@markAllAsRead` | login |
| GET | `/notifications/unread-count` | `notifications.unread-count` | `@getUnreadCount` → **JSON** `{count}` | login |

## Settings

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/settings` | `settings` | `SettingController@index` | admin |
| PUT | `/settings/class-types` | `settings.class-types` | `@updateClassTypes` | admin |

## Halaman Lain (masih tampilan dummy)

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/revenue` | `revenue` | `RevenueController@index` → `Revenue/Index` | login |
| GET | `/schedule` | `schedule` | Closure → `Schedule/Index` | login |
| GET | `/module` | `module` | `ModuleController@index` → `Module/Index` | login |
| GET | `/parentmeeting` | `parentmeeting` | `ParentMeetingController@index` → `ParentMeeting/Index` | login |

## Autentikasi (`routes/auth.php`)

Bawaan Laravel Breeze.

| Method | URL | Nama route | Handler | Akses |
|--------|-----|-----------|---------|-------|
| GET | `/register` | `register` | `RegisteredUserController@create` | guest |
| POST | `/register` | – | `RegisteredUserController@store` | guest |
| GET | `/login` | `login` | `AuthenticatedSessionController@create` | guest |
| POST | `/login` | – | `AuthenticatedSessionController@store` | guest |
| GET | `/forgot-password` | `password.request` | `PasswordResetLinkController@create` | guest |
| POST | `/forgot-password` | `password.email` | `PasswordResetLinkController@store` | guest |
| GET | `/reset-password/{token}` | `password.reset` | `NewPasswordController@create` | guest |
| POST | `/reset-password` | `password.store` | `NewPasswordController@store` | guest |
| GET | `/verify-email` | `verification.notice` | `EmailVerificationPromptController` | login |
| GET | `/verify-email/{id}/{hash}` | `verification.verify` | `VerifyEmailController` (signed, throttle 6/menit) | login |
| POST | `/email/verification-notification` | `verification.send` | `EmailVerificationNotificationController@store` (throttle 6/menit) | login |
| GET | `/confirm-password` | `password.confirm` | `ConfirmablePasswordController@show` | login |
| POST | `/confirm-password` | – | `ConfirmablePasswordController@store` | login |
| PUT | `/password` | `password.update` | `PasswordController@update` | login |
| POST | `/logout` | `logout` | `AuthenticatedSessionController@destroy` | login |

## Kode yang di-comment di `web.php`

- Route manual `/login` dan `/register` di-comment karena sudah ada di `auth.php`.
- `use App\Models\ClassManagement;` dan `use App\Models\Teacher;` di-import tapi tidak dipakai.
- `CourseController` di-import tapi tidak punya route.
