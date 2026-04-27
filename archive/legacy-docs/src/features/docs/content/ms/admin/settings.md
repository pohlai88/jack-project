---
title: Tetapan
description: >-
  Bendera ciri, penjenamaan (logo, warna), konfigurasi pembekal AI, skala
  kemahiran, kategori kemahiran dan tetapan storan.
section: admin
order: 8
translation:
  sourceLocale: en
  sourcePath: admin/settings.md
  sourceHash: 927d9e3e42daa45b5606256f9e0874394ca525773f8480b0190a1f1ebff642df
  status: reviewed
---

# Tetapan

Admins mengkonfigurasi **tetapan seluruh tenant** dalam **Admin** → **Tetapan**: bendera ciri, penjenamaan, pembekal AI, skala kemahiran, kategori dan storan. Tetapan ini mempengaruhi rupa dan tingkah laku platform untuk semua orang dalam tenant.

## Bendera ciri

**Bendera ciri** menghidupkan atau mematikan ciri untuk tenant tanpa code deploy.

| Flag biasa                    | Apa yang dikawal                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **allowCustomRoles**          | Apabila hidup: admin boleh cipta custom roles. Apabila mati: hanya role sistem wujud. |
| **OKRs**                      | Aktifkan atau sembunyikan ciri OKR (objectives, check-ins) untuk tenant.              |
| **Recognitions**              | Aktifkan atau sembunyikan ciri recognition/praise.                                    |
| **Integrations**              | Aktifkan integrasi tertentu seperti GitHub, Slack.                                    |
| **CV upload / onboarding**    | Aktifkan pemprosesan CV berkuasa AI dan ekstraksi kemahiran untuk onboarding.         |
| **People Finder / AI search** | Aktifkan carian bahasa semula jadi dan berasaskan capability.                         |

Tukar flags mengikut keperluan rollout atau compliance. Perubahan digunakan selepas simpan; pengguna mungkin perlu refresh.

## Penjenamaan

- **Logo** — Upload atau tetapkan logo tenant yang ditunjukkan dalam header dan login/shell. Format dan saiz disyorkan biasanya dinyatakan dalam UI.
- **Warna** — Warna primary dan pilihan secondary untuk butang, pautan dan aksen. Gunakan warna jenama organisasi untuk rupa konsisten.

> **Tip:** Gunakan logo dan warna kontras tinggi supaya interface kekal accessible.

## Konfigurasi pembekal AI

Jika tenant menggunakan **ciri AI** seperti People Finder, CV extraction atau AI assistant:

- **Provider** — Contohnya OpenAI, Azure OpenAI atau provider lain yang dikonfigurasi.
- **Model** — Model untuk embeddings dan/atau chat, contohnya untuk search berbanding assistant.
- **API key / endpoint** — Disimpan selamat; admins menetapkan atau memutar kunci dalam Settings. Kunci tidak ditunjukkan penuh selepas disimpan.

Semak dokumentasi provider untuk rate limits dan kos. Perubahan model atau key mungkin memerlukan restart atau cache clear untuk sesetengah ciri.

## Skala kemahiran (1–5 tahap)

Tahap kemahiran biasanya ditakrifkan pada **scale** seperti 1–5. Dalam Settings anda boleh:

- **Tetapkan scale** — Contohnya 1 = Beginner, 5 = Expert. Label mungkin boleh diedit per tahap.
- **Gunakan secara konsisten** — Scale yang sama digunakan untuk self-assessments, capabilities (minimum level) dan reporting. Ubah hanya apabila bersedia menyelaraskan data sejarah atau menerima migration sekali.

## Kategori kemahiran

- **Categories** mengumpulkan skills dalam katalog, contohnya "Technical", "Leadership". Anda boleh cipta, namakan semula, susun semula atau archive categories dalam Settings atau Skills Management.
- Categories membantu menapis skills dalam UI admin dan member. Pastikan senarai ringkas.

## Tetapan storan

Bergantung pada deployment, Settings mungkin termasuk:

- **File storage** — Tempat fail upload seperti CV, avatar, attachments disimpan, contohnya S3 atau local. Admins boleh menetapkan bucket, region atau paths.
- **Limits** — Saiz fail maksimum, jenis dibenarkan atau retention. Konfigurasi mengikut polisi.

## Langkah demi langkah: ubah penjenamaan dan bendera ciri

1. Pergi ke **Admin** → **Settings**.
2. **Branding** — Upload logo baharu dan tetapkan primary color. Simpan.
3. **Bendera ciri** — Cari flag seperti "Recognitions" dan hidupkan atau matikan. Simpan.
4. Refresh aplikasi dan sahkan logo/warna serta keterlihatan ciri, contohnya menu Recognition muncul atau hilang.
