---
title: Soalan lazim
description: >-
  Soalan umum tentang platform — reset kata laluan, role, integrasi, ciri AI,
  eksport data dan cara mendapatkan bantuan.
section: faq
order: 1
translation:
  sourceLocale: en
  sourcePath: faq.md
  sourceHash: 9fbc30698e5d595996822e2151dfd6be72952e7b945c9d128f398812532a383f
  status: reviewed
---

# Soalan lazim

Jawapan kepada soalan biasa. Untuk panduan khusus role, lihat [Member](/docs/ms/member) dan [Admin](/docs/ms/admin).

## Bagaimana saya reset kata laluan?

- Jika tenant menggunakan log masuk **email/password**: Gunakan pautan **Forgot password** pada halaman sign-in. Masukkan email; anda akan menerima pautan untuk menetapkan kata laluan baharu. Pautan mungkin tamat selepas masa singkat, contohnya 1 jam.
- Jika anda log masuk dengan **SSO** seperti Google atau Microsoft: Kata laluan diuruskan oleh identity provider. Gunakan aliran reset provider itu, contohnya IT syarikat atau pemulihan akaun Google.
- Jika email tidak diterima: Semak spam, kemudian minta **admin** mengesahkan email anda dalam tenant dan menghantar semula reset.

## Bagaimana role berfungsi?

Platform menggunakan **permissions**, bukan jawatan kerja. **Roles** seperti Member, Manager dan Admin ialah kumpulan **permissions**. Apa yang boleh anda lakukan ditentukan oleh **permissions** anda.

- Anda boleh mempunyai **berbilang role** dalam tenant. Akses efektif ialah **gabungan** semua permissions daripada semua role.
- Hanya **admins** boleh menetapkan atau menukar role (Admin → Members). Jika anda tidak melihat satu bahagian, anda mungkin tidak mempunyai role/permissions yang betul — tanya admin.

> **Tip:** Authorization sentiasa menggunakan permission key seperti `admin:dashboard`, `admin:members`. Nama role hanya untuk paparan dan pengelompokan.

## Bagaimana saya menyambung integrasi?

- **Untuk tenant**: **Admins** mengkonfigurasi integrasi dalam **Admin** → **Integrations**: webhooks, OAuth apps, API keys dan data mapping. Jika integrasi tidak tersedia, admin mungkin perlu mengaktifkannya atau menambah credentials. Lihat [Integrations](/docs/ms/admin/integrations) untuk butiran.

## Bagaimana ciri AI berfungsi?

Platform boleh menggunakan AI untuk:

- **AI Assistant** — Chat dan cadangan jika diaktifkan. Menggunakan AI provider dan model yang dikonfigurasi tenant.
- **Semantic search** — Carian berkuasa AI merentas kandungan menggunakan embeddings untuk padanan berdasarkan makna.

Admins menetapkan **AI provider dan model** dalam **Admin** → **Settings**. Data yang dihantar kepada provider bergantung pada ciri. Semak dasar privasi dan pemprosesan data tenant anda.

## Bagaimana saya mengeksport data?

- **Data sendiri**: Gunakan **Profile** atau **Settings** untuk pilihan eksport data akaun.
- **Admins**: **Admin** → **Settings** mungkin menyediakan eksport untuk analitik atau audit logs.

Jika pilihan eksport tidak muncul, role anda mungkin tiada kebenaran atau ciri belum diaktifkan — tanya admin.

## Bagaimana mendapatkan bantuan?

- **Dalam aplikasi**: Gunakan pautan **Help** atau **Docs**, biasanya dalam header atau footer, untuk membuka dokumentasi ini.
- **Admin anda**: Untuk akses, role, jemputan atau kelakuan khusus tenant, hubungi **tenant admin** atau IT.
- **Sokongan**: Jika organisasi mempunyai saluran sokongan, gunakan saluran itu untuk bug, gangguan atau isu akaun.

> **Tip:** Bookmark [Docs](/docs/ms) dan gunakan sidebar untuk melompat ke role anda (Member, Admin) bagi panduan langkah demi langkah.
