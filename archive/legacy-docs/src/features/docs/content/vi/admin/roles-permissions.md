---
title: Vai trò & quyền
description: >-
  Vai trò hệ thống (Member, Manager, Admin, 1:1er, Referente), vai trò tùy
  chỉnh, gán quyền và mô hình PBAC.
section: admin
order: 7
translation:
  sourceLocale: en
  sourcePath: admin/roles-permissions.md
  sourceHash: 0bb60719f481aebb47995e2a6ec9ca8221a294d4f201c60a0dbf36e9cc6c8f90
  status: reviewed
---

# Vai trò & quyền

Afenda dùng mô hình **permission-based** (PBAC): quyền truy cập được xác định bởi **permissions**, không phải chức danh. **Roles** là các gói permissions; một người có thể có **nhiều vai trò** trong mỗi tenant, và quyền hiệu lực là **hợp** của tất cả permissions từ các vai trò đó.

## Vai trò hệ thống

Các vai trò này thường có trong mọi tenant:

| Role          | Cách dùng phổ biến                            | Quyền chính (ví dụ)                                                                                                                              |
| ------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Member**    | Mặc định cho hầu hết người dùng               | profile, self_assess, knowledge, assistant                                                                                                       |
| **Manager**   | Người có direct reports                       | member + team, reports, manager:dashboard, manager:team, manager:assignments, manager:performance_assessments, manager:okrs, v.v.                |
| **Admin**     | Cấu hình đầy đủ tenant                        | manager + tất cả admin:_ và thường là tất cả one_on_one:_                                                                                        |
| **1:1er**     | Người hỗ trợ 1:1, không nhất thiết là quản lý | member + one_on_one:dashboard, one_on_one:meetings, one_on_one:feedback, one_on_one:performance_read, one_on_one:projects_read, one_on_one:notes |
| **Referente** | Chuyên gia chủ đề giao học tập                | member + instructor:assign_learning (có thể giao học tập cho bất kỳ ai trong tenant)                                                             |

**Manager** và **1:1er** là **tách biệt**: người hỗ trợ 1:1 không cần là quản lý của người đó. Permissions xác định bạn làm được gì; quan hệ person như manager, one_to_one xác định bạn làm với ai.

## Vai trò tùy chỉnh

Nếu tenant bật **custom roles** bằng feature flag `allowCustomRoles`:

1. Vào **Admin** → **Roles & Permissions**.
2. Nhấn **Create role** hoặc **Add role**.
3. Nhập **name** và tùy chọn **description**.
4. **Gán permissions** — Chọn quyền vai trò này cấp, ví dụ vai trò "Mentor" chỉ có one_on_one:meetings và one_on_one:notes.
5. Lưu. Vai trò mới xuất hiện trong danh sách và có thể gán cho members và invitations.

Khi custom roles **tắt**, chỉ có vai trò hệ thống; nút "Create role" bị ẩn, nhưng bạn vẫn có thể chỉnh permissions của vai trò hiện có.

## Gán quyền cho vai trò

- Mở **Admin** → **Roles & Permissions** và chọn một **role** hệ thống hoặc tùy chỉnh.
- Bạn sẽ thấy danh sách **permissions**, thường nhóm theo profile, manager, one_on_one, admin, v.v.
- **Check** các quyền vai trò này nên cấp. Lưu lại.
- Bất kỳ ai có vai trò này, riêng lẻ hoặc kèm vai trò khác, sẽ có hợp permissions từ tất cả vai trò.

> **Mẹo:** Ưu tiên cấp tập quyền tối thiểu cần cho vai trò. Bạn luôn có thể thêm sau; tránh cấp quyền admin cho nhóm rộng.

## Gán vai trò cho thành viên

- Vào **Admin** → **Members** và mở một member.
- **Roles** — Chọn một hoặc nhiều vai trò. Quyền hiệu lực của member là hợp của tất cả vai trò đã chọn.
- Lưu. Thay đổi áp dụng ở request tiếp theo; member có thể cần refresh hoặc đăng nhập lại để thấy menu và quyền mới.

## Tóm tắt mô hình PBAC

| Khái niệm         | Ý nghĩa                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Permission**    | Một quyền đơn lẻ, ví dụ `manager:dashboard`, `admin:skills`. Kiểm tra ủy quyền dùng permission keys.                       |
| **Role**          | Một gói permissions có tên. Dùng để thuận tiện và rõ ràng.                                                                 |
| **Member**        | Có thể có **nhiều vai trò** trong mỗi tenant. Quyền hiệu lực = hợp permissions từ mọi vai trò.                             |
| **Authorization** | Luôn theo permission: "Can this user do X?" → kiểm tra `hasPermission(tenant, permissionKey)`. Không chỉ dựa vào tên role. |

Admins quản lý **roles** và **permissions** trong Admin → Roles & Permissions; họ gán **roles** cho members và invitations. Hệ thống luôn phân giải truy cập bằng **permissions** trong database.
