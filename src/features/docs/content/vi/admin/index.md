---
title: Tổng quan hướng dẫn Admin
description: 'Trách nhiệm admin, dashboard và quyền admin.'
section: admin
order: 1
translation:
  sourceLocale: en
  sourcePath: admin/index.md
  sourceHash: aaede5bb4288e92321874f98c507c2f1a574719b749ae94f1c772c13e83214a1
  status: reviewed
---

# Tổng quan hướng dẫn Admin

**Admins** cấu hình nền tảng cho tổ chức: thành viên, vai trò, cài đặt, tích hợp và nhiều phần khác. Hướng dẫn này mô tả admin có thể làm gì và cách truy cập khu vực Admin.

## Trách nhiệm của Admin

| Khu vực                   | Admin làm gì                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Members & Invitations** | Thêm và xóa thành viên, tạo liên kết mời kèm vai trò, quản lý trạng thái thành viên |
| **Roles & Permissions**   | Quản lý vai trò hệ thống và tùy chỉnh; gán quyền; cấu hình PBAC                     |
| **Settings**              | Feature flags, branding (màu sắc, typography), cấu hình AI provider, storage        |
| **Integrations**          | Cấu hình Webhooks, đồng bộ hệ thống ngoài, OAuth và data mapping                    |

## Admin Dashboard

**Admin Dashboard** là trang đầu tiên khi bạn mở phần Admin. Nó thường hiển thị:

- **Tổng quan tenant** — Tên, số lượng thành viên, tóm tắt cấu hình chính
- **Liên kết nhanh** đến Members, Settings và các khu vực admin khác
- **Hoạt động gần đây hoặc cảnh báo** — ví dụ lời mời đang chờ hoặc mục cần chú ý

Dùng nó làm điểm bắt đầu mỗi khi làm việc trong Admin.

## Quyền Admin

Truy cập tính năng admin dựa trên **permissions** (PBAC). Admin có các quyền như:

| Nhóm quyền              | Ví dụ                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| **Dashboard**           | `admin:dashboard` — Xem khu vực admin                            |
| **Members & invites**   | `admin:members`, `admin:invites` — Quản lý thành viên và lời mời |
| **System**              | `admin:roles` — Vai trò & quyền; `admin:settings` — Cài đặt      |
| **Integrations & data** | Cấu hình tích hợp và webhooks                                    |

Bạn chỉ thấy menu và trang tương ứng với quyền mình có. Nếu không thấy gì đó, hãy nhờ senior admin gán đúng vai trò hoặc quyền.

## Truy cập khu vực Admin

1. Đăng nhập và mở điều hướng chính.
2. Vào **Admin** hoặc nhãn tương đương của tenant.
3. Bạn sẽ vào Admin Dashboard. Dùng sidebar để mở Members, Settings và các phần khác.

Chỉ người dùng có ít nhất một quyền admin, ví dụ `admin:dashboard`, mới thấy phần Admin.

## Liên kết nhanh

- [Members & Invitations](/docs/vi/admin/members-invitations)
- [Roles & Permissions](/docs/vi/admin/roles-permissions)
- [Settings](/docs/vi/admin/settings)
- [Integrations](/docs/vi/admin/integrations)

> **Mẹo:** Bắt đầu với Members & Invitations và Settings để bảo đảm tenant và con người được thiết lập đúng.
