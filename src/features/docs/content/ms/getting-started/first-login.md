---
title: Log masuk pertama
description: >-
  Cara log masuk ke Afenda dengan Auth0 (SSO atau email), memilih tenant dan
  memahami lawatan pertama anda.
section: getting-started
order: 2
translation:
  sourceLocale: en
  sourcePath: getting-started/first-login.md
  sourceHash: 6ee7a4d16fdbb83bbd8ef983b625dcfb52a74cadc56759dad40ad75f47e1a21c
  status: reviewed
---

# Log masuk pertama

Panduan ini menerangkan cara log masuk ke Afenda buat kali pertama, memilih organisasi (tenant) dan memanfaatkan pengalaman dashboard pertama anda.

---

## Log masuk dengan Auth0

Afenda menggunakan **Auth0** untuk pengesahan. Anda boleh log masuk dengan:

- **Single sign-on (SSO)** — Jika organisasi anda menggunakan SSO seperti Google Workspace atau Microsoft Azure AD, gunakan pilihan yang diberikan admin. Anda mungkin dialihkan ke halaman log masuk syarikat.
- **Email dan kata laluan** — Jika tenant membenarkan, anda boleh mendaftar atau log masuk dengan email.
- **Sambungan sosial atau enterprise** — Bergantung pada konfigurasi tenant, pilihan seperti Google, GitHub atau LinkedIn mungkin tersedia.

### Langkah log masuk

1. Buka URL Afenda yang diberikan organisasi anda, contohnya `https://your-tenant.afenda.app` atau domain khusus syarikat.
2. Klik **Sign in** atau **Log in**.
3. Pilih kaedah log masuk yang ditawarkan (SSO, email atau social).
4. Lengkapkan aliran Auth0: masukkan kelayakan dan luluskan MFA jika diminta.
5. Selepas pengesahan, anda dialihkan semula ke Afenda.

> **Tip:** Jika pilihan log masuk yang anda jangka tidak muncul, tenant anda mungkin hanya mengaktifkan SSO atau sambungan tertentu. Hubungi admin Afenda atau IT untuk kaedah yang betul.

---

## Pemilihan tenant (berbilang organisasi)

Jika anda berada dalam **lebih daripada satu organisasi** (tenant) di Afenda, anda perlu memilih tenant selepas log masuk.

- Anda mungkin melihat **tenant switcher** atau skrin pemilihan tenant yang menyenaraikan organisasi anda.
- Pilih tenant yang mahu digunakan. Aplikasi akan memuatkan data tenant itu: ahli, kemahiran, projek dan tetapan.
- Anda boleh menukar tenant kemudian daripada header aplikasi atau menu akaun tanpa log keluar.

Jika anda hanya mempunyai satu tenant, langkah ini mungkin dilangkau dan anda terus ke dashboard.

---

## Pengalaman dashboard kali pertama

Selepas log masuk dan memilih tenant jika perlu, anda tiba di **dashboard**. Apa yang dilihat bergantung pada role:

- **Members** melihat **My View**: dashboard peribadi dengan pautan pantas ke profil, kemahiran, OKRs, pembelajaran, prestasi dan banyak lagi.
- **Managers** juga mungkin melihat **Manager View**: gambaran pasukan, laporan dan tindakan khusus manager.
- **1:1 Facilitators** boleh membuka **1:1 View**: senarai orang yang mereka jalankan 1:1 serta mesyuarat berkaitan.
- **Admins** boleh mengakses **Admin View**: konfigurasi, ahli, kemahiran dan tetapan tenant.

Pada log masuk pertama, anda mungkin melihat:

- Bahagian kosong atau placeholder sehingga anda melengkapkan profil dan mula menggunakan ciri.
- Petunjuk onboarding atau tooltip jika tenant mengaktifkannya.
- Notifikasi atau tugasan seperti “Complete your profile” atau “Set your first OKR”.

> **Tip:** Luangkan beberapa minit pada [Persediaan profil](/docs/ms/getting-started/profile-setup) supaya nama, jawatan dan keutamaan anda tepat. Kemudian baca [Navigasi & paparan](/docs/ms/getting-started/navigation) untuk mengetahui lokasi setiap perkara.

---

## Tip untuk bermula

1. **Lengkapkan profil** — Tambah nama, jawatan, bio, timezone dan pilihan GitHub/LinkedIn. Ini membantu rakan sekerja mencari anda dalam People Finder dan menambah baik cadangan AI.
2. **Pilih paparan** — Gunakan sidebar atau view switcher untuk bergerak antara My View, Manager View, 1:1 View dan Admin View jika anda ada akses. Setiap view mempunyai menu sendiri.
3. **Gunakan carian global** — Tekan **Cmd+K** (Mac) atau **Ctrl+K** (Windows/Linux) untuk mencari orang, docs dan tindakan.
4. **Tetapkan bahasa dan tema** — Gunakan locale switcher untuk bahasa dan theme toggle untuk light/dark mode jika tenant menyokong.
5. **Bookmark docs** — Simpan [Selamat datang ke Afenda](/docs/ms/getting-started) dan panduan mengikut role untuk rujukan.

Jika anda menghadapi isu log masuk seperti tenant salah, SSO hilang atau akaun dikunci, hubungi **pentadbir Afenda** atau sokongan IT organisasi.

---

## Keselamatan dan sesi

- **Tempoh sesi** — Tempoh anda kekal log masuk bergantung pada tetapan Auth0 dan Afenda tenant. Anda mungkin perlu log masuk semula selepas tidak aktif atau selepas tempoh tertentu.
- **Log keluar** — Gunakan menu akaun (avatar atau nama dalam header) dan pilih **Sign out** atau **Log out**. Anda perlu log masuk semula untuk mengakses Afenda.
- **Berbilang peranti** — Anda boleh menggunakan Afenda pada lebih daripada satu peranti. Setiap sesi mengikuti peraturan keselamatan dan timeout yang sama. Log keluar pada peranti kongsi apabila selesai.
- **Kata laluan dan MFA** — Perubahan kata laluan dan multi-factor authentication diuruskan dalam Auth0 atau provider SSO. Jika perlu reset kata laluan atau mengemas kini MFA, gunakan pautan daripada halaman log masuk atau hubungi IT/admin Afenda.
