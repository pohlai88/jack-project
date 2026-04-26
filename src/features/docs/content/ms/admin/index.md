---
title: Gambaran panduan Admin
description: 'Tanggungjawab admin, dashboard dan kebenaran admin.'
section: admin
order: 1
translation:
  sourceLocale: en
  sourcePath: admin/index.md
  sourceHash: aaede5bb4288e92321874f98c507c2f1a574719b749ae94f1c772c13e83214a1
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

## Admin Dashboard

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

- [Members & Invitations](/docs/ms/admin/members-invitations)
- [Roles & Permissions](/docs/ms/admin/roles-permissions)
- [Settings](/docs/ms/admin/settings)
- [Integrations](/docs/ms/admin/integrations)

> **Tip:** Mula dengan Members & Invitations dan Settings untuk memastikan tenant serta orang anda disediakan dengan betul.
