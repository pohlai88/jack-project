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
  sourceHash: 7cf639cf207aa59b7d7c2e562f6749a3cbaaf13d2193c386f42b2c09d0ca6ae2
  status: reviewed
---

# Soalan lazim

Jawapan kepada soalan biasa. Untuk panduan khusus role, lihat [Member](/docs/member) dan [Admin](/docs/admin).

## Bagaimana saya menetapkan semula kata laluan?

- Jika tenant menggunakan log masuk **email/password**: Gunakan pautan **Forgot password** pada halaman sign-in. Masukkan email; anda akan menerima pautan untuk menetapkan kata laluan baharu. Pautan mungkin tamat selepas masa singkat, contohnya 1 jam.
- Jika anda log masuk dengan **SSO** seperti Google atau Microsoft: Kata laluan diuruskan oleh identity provider. Gunakan aliran reset provider itu, contohnya IT syarikat atau pemulihan akaun Google.
- Jika email tidak diterima: Semak spam, kemudian minta **admin** mengesahkan email anda dalam tenant dan menghantar semula reset.

## Bagaimana peranan berfungsi?

Platform menggunakan **permissions**, bukan jawatan kerja. **Roles** seperti Member, Manager dan Admin ialah kumpulan **permissions**. Apa yang boleh anda lakukan ditentukan oleh **permissions** anda.

- Anda boleh mempunyai **berbilang role** dalam tenant. Akses efektif ialah **gabungan** semua permissions daripada semua role.
- Hanya **admins** boleh menetapkan atau menukar role (Admin → Members). Jika anda tidak melihat satu bahagian, anda mungkin tidak mempunyai role/permissions yang betul — tanya admin.

> **Tip:** Authorization sentiasa menggunakan permission key seperti `admin:dashboard`, `admin:members`. Nama role hanya untuk paparan dan pengelompokan.

## Bagaimana saya menyambung integrasi?

- **Untuk tenant**: **Admins** mengkonfigurasi integrasi dalam **Admin** → **Integrations**: webhooks, OAuth apps, API keys dan data mapping. Jika integrasi tidak tersedia, admin mungkin perlu mengaktifkannya atau menambah credentials. Lihat [Integrations](/docs/admin/integrations) untuk butiran.

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

> **Tip:** Bookmark [Docs](/docs) dan gunakan sidebar untuk melompat ke role anda (Member, Admin) bagi panduan langkah demi langkah.
