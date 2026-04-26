---
title: Selamat datang ke Afenda
description: >-
  Gambaran platform — SaaS multi-tenant dengan bantuan AI, RBAC dan integrasi.
  Konsep utama, peranan pengguna dan pautan pantas kepada panduan.
section: getting-started
order: 1
translation:
  sourceLocale: en
  sourcePath: getting-started.md
  sourceHash: aac295dad4e653c2f3548b60be73410241a788ad99e512cb60c0a8a6591ca10f
  status: reviewed
---

# Selamat datang ke Afenda

Afenda ialah **starter SaaS multi-tenant** dengan bantuan AI, kawalan akses berasaskan peranan dan keupayaan integrasi terbina dalam. Ia membantu pasukan bekerjasama, mengurus ahli dan menggunakan AI sambil mengekalkan pengasingan tenant dan kebenaran yang betul.

Panduan ini memperkenalkan platform, konsep utama, peranan pengguna dan tempat untuk bermula.

---

## Apa yang platform ini lakukan

Template ini menyediakan tiga asas:

- **Organisasi multi-tenant** — Setiap tenant (organisasi) mempunyai ahli, peranan, jabatan dan tetapan sendiri. Data diasingkan sepenuhnya antara tenant.
- **Bantuan berkuasa AI** — Pembantu AI dalam aplikasi boleh menjawab soalan, mencari kandungan secara semantik dan memberi cadangan. Boleh dikonfigurasi mengikut tenant.
- **Integrasi dan automasi** — Webhooks, enjin penyegerakan dan sambungan sistem luar untuk membina aliran kerja yang sesuai dengan keperluan anda.

> **Tip:** Ini ialah platform **berasaskan tenant**. Organisasi (tenant) anda mempunyai ahli, konfigurasi dan data sendiri. Jika anda berada dalam beberapa organisasi, anda boleh bertukar antara tenant dalam aplikasi.

---

## Konsep utama

| Konsep           | Maksudnya                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Tenant**       | Organisasi anda. Setiap tenant mempunyai ahli, peranan dan konfigurasi sendiri.      |
| **Person**       | Ahli dalam tenant — mengandungi maklumat profil, jabatan dan hubungan.               |
| **Role**         | Menentukan kebenaran: apa yang boleh dilihat dan dilakukan (member, manager, admin). |
| **AI Assistant** | AI perbualan dalam aplikasi untuk soalan, carian dan panduan.                        |
| **Integrations** | Sambungan ke sistem luar melalui webhooks dan enjin penyegerakan.                    |

Memahami konsep ini membantu anda menggunakan panduan Member dan Admin.

---

## Peranan pengguna

Pengalaman anda bergantung pada **role** dan kebenaran dalam tenant. Role berbeza daripada jawatan kerja; ia menentukan apa yang boleh anda lihat dan lakukan.

| Role        | Untuk siapa                 | Apa yang anda dapat                                                      |
| ----------- | --------------------------- | ------------------------------------------------------------------------ |
| **Member**  | Semua orang                 | Profil, dashboard, AI assistant dan akses kepada sumber bersama.         |
| **Manager** | Orang yang mengurus pasukan | Semua dalam Member, serta keterlihatan dan keupayaan pengurusan pasukan. |
| **Admin**   | Pentadbir tenant            | Akses penuh: ahli, jemputan, role, kebenaran, tetapan dan integrasi.     |

---

## Pautan pantas kepada panduan

Bergantung pada role anda, mula di sini:

- **Baharu di platform?** → [Log masuk pertama](/docs/ms/getting-started/first-login) dan [Navigasi](/docs/ms/getting-started/navigation).
- **Sediakan profil anda** → [Persediaan profil](/docs/ms/getting-started/profile-setup).
- **Member** → Panduan Member: dashboard, tetapan profil dan AI assistant.
- **Admin** → Panduan Admin: ahli, role, tetapan dan integrasi.

Gunakan **sidebar docs** atau **carian** untuk pergi ke mana-mana topik.

---

## Komponen interaktif

Platform menggunakan sistem reka bentuk yang konsisten. Ini pratonton langsung variasi butang yang tersedia:

```preview
component: ButtonVariants
props: {}
```

---

## Mengapa template ini?

Template ini direka sebagai asas kukuh untuk SaaS anda:

- **Multi-tenancy dari hari pertama** — Pengasingan data yang betul, konfigurasi per tenant dan seni bina boleh skala.
- **AI-native** — Infrastruktur AI assistant sedia untuk kes penggunaan khusus domain anda.
- **Kebenaran yang betul** — RBAC dengan kebenaran halus, bukan sekadar semakan role.
- **Sedia untuk integrasi** — Infrastruktur webhook dan enjin penyegerakan untuk menyambung sistem luar.

Jika ada maklum balas atau soalan, gunakan saluran sokongan biasa tenant anda atau hubungi admin.
