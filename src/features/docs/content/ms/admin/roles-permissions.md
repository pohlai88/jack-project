---
title: Roles & Permissions
description: >-
  Role sistem (Member, Manager, Admin, 1:1er, Referente), custom roles,
  penetapan permissions dan model PBAC.
section: admin
order: 7
translation:
  sourceLocale: en
  sourcePath: admin/roles-permissions.md
  sourceHash: 82e558def93309a948272fa19cb4822e542075710f2b7314d5074b1b3eaf527b
  status: reviewed
---

# Roles & Permissions

Afenda menggunakan model **permission-based** (PBAC): akses ditentukan oleh **permissions**, bukan jawatan kerja. **Roles** ialah kumpulan permissions; seseorang boleh mempunyai **berbilang role** per tenant, dan permissions efektif ialah **gabungan** semua permissions daripada role tersebut.

## Role sistem

Role ini biasanya tersedia dalam setiap tenant:

| Role          | Kegunaan biasa                            | Permissions utama (contoh)                                                                                                                       |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Member**    | Lalai untuk kebanyakan pengguna           | profile, self_assess, knowledge, assistant                                                                                                       |
| **Manager**   | Orang dengan direct reports               | member + team, reports, manager:dashboard, manager:team, manager:assignments, manager:performance_assessments, manager:okrs dan lain-lain        |
| **Admin**     | Konfigurasi tenant penuh                  | manager + semua admin:_ dan selalunya semua one_on_one:_                                                                                         |
| **1:1er**     | Fasilitator 1:1, tidak semestinya manager | member + one_on_one:dashboard, one_on_one:meetings, one_on_one:feedback, one_on_one:performance_read, one_on_one:projects_read, one_on_one:notes |
| **Referente** | Pakar subjek yang menetapkan pembelajaran | member + instructor:assign_learning (boleh menetapkan pembelajaran kepada sesiapa dalam tenant)                                                  |

**Manager** dan **1:1er** adalah **berasingan**: fasilitator 1:1 tidak perlu menjadi manager seseorang. Permissions menentukan apa yang boleh anda lakukan; hubungan person seperti manager dan one_to_one menentukan dengan siapa.

## Custom roles

Jika tenant mempunyai **custom roles** diaktifkan (feature flag `allowCustomRoles`):

1. Pergi ke **Admin** → **Roles & Permissions**.
2. Klik **Create role** atau **Add role**.
3. Masukkan **name** dan **description** jika perlu.
4. **Tetapkan permissions** — Pilih permissions yang role ini berikan, contohnya role "Mentor" dengan hanya one_on_one:meetings dan one_on_one:notes.
5. Simpan. Role baharu muncul dalam senarai role dan boleh ditetapkan kepada members serta invitations.

Apabila custom roles **dinyahaktifkan**, hanya role sistem wujud; butang "Create role" disembunyikan, tetapi anda masih boleh mengedit permissions role sedia ada.

## Menetapkan permissions kepada role

- Buka **Admin** → **Roles & Permissions** dan pilih **role** sistem atau custom.
- Anda akan melihat senarai **permissions**, selalunya dikumpulkan mengikut kategori seperti profile, manager, one_on_one, admin.
- **Check** permissions yang perlu diberikan role ini. Simpan.
- Sesiapa yang mempunyai role ini, sendiri atau bersama role lain, akan mempunyai gabungan permissions daripada semua role.

> **Tip:** Berikan set permissions minimum yang diperlukan. Anda boleh tambah kemudian; elakkan memberi permissions admin kepada kumpulan luas.

## Menetapkan role kepada members

- Pergi ke **Admin** → **Members** dan buka seorang member.
- **Roles** — Pilih satu atau lebih role. Permissions efektif member ialah gabungan semua role yang dipilih.
- Simpan. Perubahan berkuat kuasa pada request seterusnya; member mungkin perlu refresh atau log masuk semula.

## Ringkasan model PBAC

| Konsep            | Maksud                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Permission**    | Hak tunggal, contohnya `manager:dashboard`, `admin:skills`. Semakan authorization menggunakan permission keys.                    |
| **Role**          | Kumpulan permissions bernama. Digunakan untuk kemudahan dan kejelasan.                                                            |
| **Member**        | Boleh mempunyai **berbilang role** per tenant. Permissions efektif = gabungan permissions semua role.                             |
| **Authorization** | Sentiasa mengikut permission: "Can this user do X?" → semak `hasPermission(tenant, permissionKey)`. Jangan guna nama role sahaja. |

Admins mengurus **roles** dan **permissions** dalam Admin → Roles & Permissions; mereka menetapkan **roles** kepada members dan invitations. Sistem sentiasa menyelesaikan akses melalui **permissions** dalam database.
