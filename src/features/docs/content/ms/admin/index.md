---
title: Gambaran panduan Admin
description: 'Tanggungjawab admin, dashboard dan kebenaran admin.'
section: admin
order: 1
translation:
  sourceLocale: en
  sourcePath: admin/index.md
  sourceHash: e1bb454f189f18e6c36ce9e55834c897f228d94eae9953fcd6a02b62702ce510
  status: reviewed
---

# Gambaran panduan Admin

**Admins** mengkonfigurasi platform untuk organisasi: ahli, role, tetapan, integrasi dan banyak lagi. Panduan ini menerangkan apa yang admin boleh lakukan dan cara mengakses kawasan Admin.

## Tanggungjawab Admin

| Kawasan                   | Apa yang admin lakukan                                                    |
| ------------------------- | ------------------------------------------------------------------------- |
| **Members & Invitations** | Tambah dan buang ahli, jana pautan jemputan dengan role, urus status ahli |
| **Roles & Permissions**   | Urus role sistem dan custom; tetapkan permissions; konfigurasi PBAC       |
| **Settings**              | Feature flags, branding, konfigurasi AI provider, storage                 |
| **Integrations**          | Konfigurasi Webhooks, sync sistem luar, OAuth dan data mapping            |

## Papan pemuka pentadbir

**Admin Dashboard** ialah halaman permulaan apabila anda membuka bahagian Admin. Ia biasanya menunjukkan:

- **Gambaran tenant** — Nama, bilangan ahli, ringkasan konfigurasi utama
- **Pautan pantas** ke Members, Settings dan kawasan admin lain
- **Aktiviti terkini atau amaran** — contohnya jemputan tertunda atau item yang memerlukan perhatian

Gunakannya sebagai titik mula setiap kali bekerja dalam Admin.

## Kebenaran Admin

Akses kepada ciri admin adalah **berasaskan permissions** (PBAC). Admin mempunyai permissions seperti:

| Kategori permission     | Contoh                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| **Dashboard**           | `admin:dashboard` — Lihat kawasan admin                          |
| **Members & invites**   | `admin:members`, `admin:invites` — Urus ahli dan jemputan        |
| **System**              | `admin:roles` — Roles & permissions; `admin:settings` — Settings |
| **Integrations & data** | Konfigurasi integrations dan webhooks                            |

Anda hanya melihat menu dan halaman yang sepadan dengan permission anda. Jika sesuatu tidak muncul, minta senior admin menetapkan role atau permission yang betul.

## Mengakses kawasan Admin

1. Log masuk dan buka navigasi utama.
2. Pergi ke **Admin** atau label setara untuk tenant.
3. Anda akan tiba di Admin Dashboard. Gunakan sidebar untuk membuka Members, Settings dan bahagian lain.

Hanya pengguna dengan sekurang-kurangnya satu permission admin seperti `admin:dashboard` melihat bahagian Admin.

## Pautan pantas

- [Ahli & jemputan](/docs/admin/members-invitations)
- [Peranan & kebenaran](/docs/admin/roles-permissions)
- [Tetapan](/docs/admin/settings)
- [Integrasi](/docs/admin/integrations)

> **Tip:** Mula dengan Members & Invitations dan Settings untuk memastikan tenant serta orang anda disediakan dengan betul.
