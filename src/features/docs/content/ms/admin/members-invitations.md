---
title: Ahli & jemputan
description: >-
  Tambah dan buang ahli, jana pautan jemputan dengan role, urus status ahli dan
  tamat tempoh jemputan.
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/members-invitations.md
  sourceHash: e23b8e807ebca8e8f590e0c022a1bb1a1e94c0e142b775591c9fb57ec8469305
  status: reviewed
---

# Ahli & jemputan

Admins mengurus **siapa berada dalam tenant** dan **cara mereka masuk**. Anda boleh menambah ahli secara langsung, menghantar jemputan dengan role terpilih serta mengawal tamat tempoh jemputan dan status ahli.

## Menambah ahli

Ada dua cara utama:

1. **Invitation** — Hantar pautan jemputan atau email; orang itu menerima dan ditambah dengan role yang anda pilih.
2. **Direct add / import** — Cipta membership sendiri, contohnya selepas bulk import atau SSO. Orang itu mungkin masih perlu melengkapkan profil.

### Menghantar jemputan

1. Pergi ke **Admin** → **Members** atau **Invitations**.
2. Klik **Invite member** atau **Create invitation**.
3. **Masukkan email** dan nama jika perlu.
4. **Pilih role** — Pilih role yang akan dimiliki apabila jemputan diterima, contohnya Member, Manager, 1:1er.
5. **Tetapkan expiration** jika tenant menyokong, contohnya 7 atau 30 hari.
6. Jana pautan atau hantar email. Kongsi pautan jemputan dengan orang itu, atau mereka menerimanya melalui email jika dikonfigurasi.

> **Tip:** Gunakan role yang sepadan dengan kerja orang itu: “Member” untuk kebanyakan orang, “Manager” atau “1:1er” hanya apabila permission itu diperlukan.

## Pautan jemputan dan role

- **Invite link** — URL unik yang, apabila dibuka dan log masuk atau selepas sign-up, mencipta atau mengemas kini membership orang itu dalam tenant dengan **role(s)** yang dipilih.
- **Roles** — Datang daripada role tenant anda, termasuk role sistem seperti Member, Manager, Admin, 1:1er, Referente dan custom roles. Jemputan menyimpan **role ID** pilihan; selepas diterima, role ditetapkan dalam `tenant_membership_roles`.

Seseorang boleh mempunyai **berbilang role** selepas berada dalam tenant; anda boleh menukar role kemudian daripada senarai Members.

## Mengurus status ahli

Daripada senarai **Members**, anda boleh:

- **Lihat** semua ahli tenant, role dan status seperti active atau inactive jika tenant menyokong.
- **Edit roles** — Tambah atau buang role untuk ahli. Permissions efektif ialah gabungan semua role.
- **Deactivate atau remove** — Bergantung pada konfigurasi tenant, anda boleh menyahaktifkan ahli atau membuang mereka daripada tenant.

Perubahan role berkuat kuasa pada request seterusnya; ahli mungkin perlu refresh atau log masuk semula untuk melihat menu dan permission terkini.

## Tamat tempoh jemputan

Jika **invite expiration** diaktifkan:

- Setiap jemputan mempunyai tarikh **valid until**. Selepas tarikh itu, pautan mungkin menunjukkan ralat atau meminta jemputan baharu.
- Anda boleh **resend** atau **regenerate** jemputan daripada senarai Invitations jika tamat tempoh.
- Tempoh lebih pendek seperti 7 hari meningkatkan keselamatan; tempoh lebih panjang seperti 30 hari lebih mudah untuk onboarding.

## Langkah demi langkah: jemput ahli pasukan baharu

1. Pergi ke **Admin** → **Members** → **Invitations** atau **Invite member**.
2. Masukkan **email** orang itu dan pilih **role(s)**, contohnya Member.
3. Tetapkan **expiration** jika diperlukan.
4. Klik **Send** atau **Generate link**. Salin pautan jika perlu berkongsi secara manual.
5. Orang itu membuka pautan, sign in atau sign up dan menerima jemputan. Mereka kini menjadi ahli dengan role yang dipilih.
6. Secara pilihan, pergi ke **Members**, cari mereka dan tambah role lain seperti 1:1er atau ubah jika perlu.

> **Tip:** Pantau senarai Invitations untuk jemputan tertunda atau tamat tempoh, kemudian hantar semula atau lanjutkan supaya ahli baharu tidak tersekat.
