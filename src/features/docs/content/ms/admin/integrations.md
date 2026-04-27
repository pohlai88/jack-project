---
title: Integrasi
description: >-
  GitHub, LinkedIn, Slack, Google Workspace, GitLab, webhooks — setup OAuth,
  sync dan data mapping.
section: admin
order: 9
translation:
  sourceLocale: en
  sourcePath: admin/integrations.md
  sourceHash: bf7697687d139f10500512f0bbdcfbc377297876a575ada2ce17e9d494693371
  status: reviewed
---

# Integrasi

Afenda boleh menyambung ke sistem luar supaya anda boleh menyegerakkan orang, skills atau aktiviti dan memperkaya profil. Admins mengkonfigurasi **integrations** (OAuth, API keys, webhooks) dan **data mapping** supaya data mengalir masuk dan keluar dengan betul.

## Integrasi disokong (gambaran)

| Integration          | Status    | Kegunaan biasa                                                       |
| -------------------- | --------- | -------------------------------------------------------------------- |
| **GitHub**           | ✅ Active | Paut profil ke GitHub; sync repo, aktiviti atau skills daripada code |
| **Webhooks**         | ✅ Active | Event outbound seperti person updated, assessment submitted          |
| **LinkedIn**         | 🔜 Soon   | Import profil atau skills daripada LinkedIn                          |
| **Slack**            | 🔜 Soon   | Notifikasi, bot atau pemautan identiti                               |
| **Google Workspace** | 🔜 Soon   | Identiti, kalendar atau sync direktori                               |
| **GitLab**           | 🔜 Soon   | Sama seperti GitHub — repo, aktiviti, skills                         |

Gunakan **Admin** → **Integrations** untuk melihat yang diaktifkan.

## Integrasi GitHub (aktif)

GitHub ialah integrasi aktif utama. Selepas dikonfigurasi:

1. **Cipta OAuth App** dalam GitHub → Developer Settings. Dapatkan **Client ID** dan **Client Secret**.
2. **Tetapkan redirect URI** — gunakan URL yang ditunjukkan dalam Admin → Integrations → GitHub, contohnya `https://your-tenant.app/api/auth/callback/github`.
3. Dalam **Admin** → **Integrations** → **GitHub**, masukkan credentials dan simpan.
4. Members boleh menyambungkan akaun GitHub daripada profile settings.

Pada setiap sync, Afenda **mencipta evidence record secara automatik** pada profil person yang menunjukkan repo diimbas, bahasa ditemui, skills disimpulkan dan sumbangan.

## Webhooks (aktif — keluar)

**Webhooks** menghantar event daripada Afenda ke sistem anda, contohnya "person created", "assessment submitted":

1. **Admin** → **Integrations** → **Webhooks**.
2. **Add webhook** — URL, secret pilihan untuk menandatangani payload dan **event types** untuk subscribe.
3. Simpan. Afenda akan POST payload JSON ke URL anda pada setiap event terpilih. Laksanakan idempotency dan sahkan signature.

## Penyediaan OAuth untuk integrasi akan datang

Untuk integrasi yang menggunakan **OAuth** seperti LinkedIn, Slack, Google Workspace, GitLab:

1. **Cipta app** dalam developer portal provider. Dapatkan **Client ID** dan **Client Secret**.
2. **Tetapkan redirect URI** — gunakan URL yang diberikan Afenda. Ia mesti sepadan tepat.
3. Dalam **Admin** → **Integrations**, pilih integrasi dan masukkan credentials.
4. Members memberi authorization melalui consent screen provider.

> **Tip:** Gunakan OAuth app khusus bagi setiap environment (dev vs prod) dan putar secrets jika terdedah.

## Carian semantik dan embeddings

Sync integrasi menyumbang kepada **semantic search** (People Finder, AI Assistant):

- **Skills baharu** daripada GitHub sync mendapat embeddings untuk carian skill.
- **Profil dikemas kini** menjana semula embedding supaya People Finder kekal terkini.
- **Bulk imports** (skills, capabilities, persons) juga menjana embeddings secara automatik.
