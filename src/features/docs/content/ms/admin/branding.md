---
title: Branding & penyesuaian
description: >-
  Sesuaikan tenant Afenda dengan warna, typography, density, surface styles dan
  tetapan visual lain.
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/branding.md
  sourceHash: 3050eecffc34bc19774d2477d2318be0966baa3fc37c526bffa9ca5818a753ed
  status: reviewed
---

# Branding & penyesuaian

Afenda sangat boleh disesuaikan untuk memadankan identiti visual dan pilihan reka bentuk organisasi. Panduan ini menerangkan tetapan branding yang tersedia kepada admin.

---

## Tempat mencari tetapan Branding

1. Log masuk sebagai **Admin** dan pergi ke **Admin View**
2. Dalam sidebar, pilih **Settings**
3. Klik tab **Branding** atau yang seumpamanya
4. Buat perubahan dan **Save**

Semua perubahan digunakan serta-merta kepada tenant untuk semua pengguna dan peranti.

---

## Elemen branding yang boleh disesuaikan

### Warna

Sesuaikan tiga warna utama yang mentakrifkan jenama anda dalam Afenda:

#### Primary Color

- **Apa itu:** Warna jenama utama untuk butang utama, pautan, aksen dan highlight.
- **Default:** Biru terang (`#3B82F6`)
- **Tip:**
  - Pilih warna dengan kontras baik terhadap putih dan latar neutral pilihan.
  - Gunakan warna tepu dan mudah diingati; elakkan kelabu dan putih.
  - Uji dalam light dan dark mode untuk memastikan kebolehbacaan.

#### Secondary Color

- **Apa itu:** Warna pelengkap untuk tindakan sekunder, badges dan elemen sokongan.
- **Default:** Teal (`#10B981`)
- **Tip:**
  - Sesuai sebagai aksen kontras, contohnya untuk progress atau tindakan positif.
  - Perlu berpadu dengan Primary Color.

#### Accent Color

- **Apa itu:** Warna cerah dan bertenaga untuk highlight, amaran dan penegasan.
- **Default:** Amber hangat (`#F59E0B`)
- **Tip:**
  - Selalunya digunakan untuk amaran, CTA sekunder dan hover interaktif.
  - Perlu berbeza daripada Primary dan Secondary.

#### Maklum balas kontras warna

- **WCAG Validation** — Apabila anda menetapkan pasangan warna, Afenda menyemak automatik sama ada ia memenuhi piawaian kontras Web Content Accessibility Guidelines (WCAG).
- **Green check** — Pasangan warna memenuhi **WCAG AA** (nisbah kontras 4.5:1 untuk teks biasa).
- **Orange warning** — Kontras baik, tetapi pertimbangkan peningkatan untuk patuh AA.
- **Recommendation** — Jika kontras rendah, sistem mencadangkan tona lebih cerah atau gelap untuk memenuhi standard accessibility.

**Contoh:**

```
Primary: #0066CC (Blue)
Background: #FFFFFF (White)
Contrast ratio: 8.6:1 ✓ WCAG AAA (best readability)
```

---

### Typography

Sesuaikan cara teks muncul di seluruh platform.

#### Font Family

Pilih daripada keluarga font profesional:

- **DM Sans** (default) — Moden, mesra dan sedikit bulat. Bagus untuk produk teknologi.
- **Inter** — Neutral dan sangat mudah dibaca. Cemerlang untuk UI dan teks badan.
- **Open Sans** — Hangat dan mudah didekati. Sesuai untuk persekitaran korporat.
- **System Font** — Menggunakan font lalai OS (San Francisco pada Mac, Segoe UI pada Windows). Paling cepat dimuat tanpa font luar.

**Tip:**

- Jika prestasi kritikal, gunakan **System Font**.
- Untuk konsistensi jenama, padankan font dan weights dengan laman marketing.
- Semua font termasuk weights 400, 500, 600 dan 700.

---

### Density

Kawal jumlah spacing (padding dan margin) dalam interface.

- **Compact** (0.75x) — Spacing dikurangkan. Lebih banyak data pada skrin. Baik untuk pasukan yang mengurus banyak item.
- **Default** (1x) — Spacing seimbang. Pengalaman Afenda standard.
- **Comfortable** (1.25x) — Spacing ditambah. Lebih baik untuk accessibility dan kebolehbacaan.

**Tip:**

- Compact berguna untuk dashboard admin padat data atau view pasukan besar.
- Comfortable lebih baik untuk member yang fokus pada pembangunan peribadi.
- Hanya satu density boleh ditetapkan per tenant; pengguna individu tidak boleh override.

---

### Surface Style

Kawal kedalaman visual dan elevation cards, panels dan containers.

- **Flat** — Tiada shadows, pemisahan visual minimum. Estetik bersih dan minimal.
- **Elevated** (default) — Shadows halus dan isyarat kedalaman. Lebih mudah diimbas secara visual.
- **Glass** (Glassmorphism) — Kesan kaca kabur dengan blur dan transparency. Moden dan menonjol.

**Tip:**

- **Flat** sesuai untuk interface padat data.
- **Elevated** ialah default paling selamat untuk estetik dan usability seimbang.
- **Glass** moden dan menarik; uji dalam dark mode supaya kekal boleh dibaca.

---

### Neutral Warmth

Laraskan undertone warna neutral seperti kelabu dan border.

- **Cool** — Kelabu dengan undertone biru. Terasa segar dan teknikal.
- **Neutral** (default) — Kelabu tulen tanpa warmth/cool. Serba guna dan moden.
- **Warm** — Kelabu dengan undertone hangat (oren/coklat). Terasa mesra.

**Tip:**

- Padankan warmth palet neutral dengan Primary Color untuk harmoni visual.
- Cool sesuai dengan biru, teal, ungu.
- Warm sesuai dengan oren, merah, coklat.
- Neutral paling selamat untuk persekitaran korporat.

---

## Logo & identiti organisasi

Selain warna dan typography:

- **Tenant name** — Nama organisasi yang dipaparkan dalam headers dan footers.
- **Logo** — Jika tersedia, upload logo organisasi untuk header dan halaman login.
- **Favicon** — Ikon kecil dalam tab browser.
- **Email template colors** — Email daripada platform boleh menggunakan warna jenama anda.

---

## Pratonton & ujian langsung

Sebelum menyimpan, gunakan **preview panel** dalam tetapan Branding untuk:

1. Melihat pilihan warna pada butang, cards dan elemen UI
2. Bertukar antara light dan dark mode
3. Menyemak kontras teks dan kebolehbacaan

**Sentiasa uji:**

- Light mode dan dark mode
- Saiz skrin berbeza (desktop, tablet, mobile)
- Dengan pasukan anda, dapatkan maklum balas beberapa pengguna

---

## Amalan terbaik

### Konsistensi

- Padankan warna dan font laman marketing jika boleh.
- Gunakan branding konsisten merentas Afenda, email templates dan integrations.

### Accessibility

- Sentiasa kekalkan kontras baik (WCAG AA atau AAA).
- Gunakan validator kontras terbina dalam Afenda semasa memilih warna.
- Jangan bergantung pada warna sahaja untuk menyampaikan makna; gunakan ikon + warna untuk status.

### Prestasi

- Elakkan terlalu banyak custom fonts; kekalkan 1–2 font families.
- System Font paling cepat dimuat; custom fonts boleh menambah 50–200ms pada masa muat halaman.
- Perbezaan visual kecil untuk kebanyakan pengguna.

### Dark Mode

- Uji semua pilihan warna dalam dark mode.
- Glass surfaces mungkin perlu pelarasan supaya kekal terbaca dalam gelap.
- Pastikan Primary Color cukup cerah pada latar gelap.

### Mobile

- Density dan surface style memberi kesan besar pada usability mobile.
- Uji pada telefon atau tablet sebenar, bukan hanya browser devtools.
- Skrin kecil mendapat manfaat daripada Comfortable spacing dan Elevated surface style.

---

## Reset kepada default

Jika mahu bermula semula:

1. Pergi ke **Settings** → **Branding**
2. Klik **Reset to Defaults** jika tersedia
3. Sahkan

Ini mengembalikan semua warna, font, density dan surface style kepada default Afenda. Nama tenant dan logo kekal.

---

## Troubleshooting

**Warna tidak berubah selepas saya simpan:**

- Refresh halaman atau kosongkan cache browser (Cmd+Shift+R pada Mac, Ctrl+Shift+R pada Windows).
- Semak sambungan internet.
- Jika isu berterusan, hubungi sokongan Afenda.

**Custom font saya tidak muncul:**

- Sesetengah browser menyekat font luar jika anda berada di belakang proxy korporat.
- Cuba System Font sebagai alternatif.
- Minta pasukan IT allowlist `fonts.googleapis.com` atau `fonts.gstatic.com` jika menggunakan custom fonts.

**Amaran kontras teks — apa perlu dibuat?**

- Validator terbina dalam mencadangkan tona lebih cerah atau gelap.
- Anda boleh menerima cadangan atau melaras sendiri.
- WCAG AA (4.5:1) ialah standard undang-undang minimum; AAA (7:1) lebih baik untuk accessibility.

**Dark mode kelihatan berbeza daripada light mode:**

- Ini normal; persepsi warna berubah mengikut kecerahan latar.
- Laraskan warna untuk kedua-dua mode atau dapatkan bantuan reka bentuk.

---

## Langkah seterusnya

- **Teroka tetapan lain** → [Gambaran Settings](./settings)
- **Tambah integrasi** → [Panduan Integrations](./integrations)
- **Urus ahli dan role** → [Members & Invitations](./members-invitations)
- **Perlu panduan reka bentuk lanjut?** → Hubungi designer Afenda anda atau <support@example.com>

Jenama anda penting. Luangkan masa untuk mendapatkan warna dan typography yang tepat kerana itulah antara perkara pertama yang orang lihat dalam Afenda setiap hari.
