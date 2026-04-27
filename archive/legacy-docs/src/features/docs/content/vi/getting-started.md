---
title: Chào mừng đến với Afenda
description: >-
  Tổng quan nền tảng — SaaS đa tenant với trợ lý AI, RBAC và tích hợp. Các khái
  niệm chính, vai trò người dùng và liên kết nhanh đến hướng dẫn.
section: getting-started
order: 1
translation:
  sourceLocale: en
  sourcePath: getting-started.md
  sourceHash: 3c0b66627c5bea0f3e7df5a05baa432cbb8e9773c0e3ccf03124ec7b898a40fe
  status: reviewed
---

# Chào mừng đến với Afenda

Afenda là **bộ khởi tạo SaaS đa tenant** có sẵn trợ lý AI, kiểm soát truy cập theo vai trò và khả năng tích hợp. Nền tảng giúp đội nhóm cộng tác, quản lý thành viên và khai thác AI, đồng thời vẫn bảo đảm cô lập dữ liệu và phân quyền đúng theo tenant.

Hướng dẫn này giới thiệu nền tảng, các khái niệm chính, vai trò người dùng và những bước nên đọc tiếp theo.

---

## Nền tảng này làm gì

Template cung cấp ba trụ cột nền tảng:

- **Tổ chức đa tenant** — Mỗi tenant (tổ chức) có thành viên, vai trò, phòng ban và cài đặt riêng. Dữ liệu được cô lập hoàn toàn giữa các tenant.
- **Trợ lý AI** — Trợ lý AI trong ứng dụng có thể trả lời câu hỏi, tìm kiếm nội dung theo ngữ nghĩa và đưa ra đề xuất. Có thể cấu hình theo từng tenant.
- **Tích hợp và tự động hóa** — Webhooks, bộ máy đồng bộ và kết nối hệ thống bên ngoài để xây dựng quy trình phù hợp với nhu cầu của bạn.

> **Mẹo:** Đây là nền tảng **dựa trên tenant**. Tổ chức (tenant) của bạn có thành viên, cấu hình và dữ liệu riêng. Nếu thuộc nhiều tổ chức, bạn có thể chuyển đổi giữa chúng trong ứng dụng.

---

## Khái niệm chính

| Khái niệm        | Ý nghĩa                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| **Tenant**       | Tổ chức của bạn. Mỗi tenant có thành viên, vai trò và cấu hình riêng.   |
| **Person**       | Thành viên trong tenant — gồm thông tin hồ sơ, phòng ban và quan hệ.    |
| **Role**         | Xác định quyền: bạn có thể xem và làm gì (member, manager, admin).      |
| **AI Assistant** | AI hội thoại trong ứng dụng để đặt câu hỏi, tìm kiếm và nhận hướng dẫn. |
| **Integrations** | Kết nối tới hệ thống bên ngoài qua webhooks và bộ máy đồng bộ.          |

Hiểu các khái niệm này sẽ giúp bạn đọc hướng dẫn Member và Admin dễ hơn.

---

## Vai trò người dùng

Trải nghiệm của bạn phụ thuộc vào **vai trò** và quyền trong tenant. Vai trò tách biệt với chức danh công việc; chúng xác định những gì bạn được xem và thực hiện.

| Vai trò     | Dành cho ai            | Bạn có gì                                                             |
| ----------- | ---------------------- | --------------------------------------------------------------------- |
| **Member**  | Mọi người              | Hồ sơ, dashboard, trợ lý AI và quyền truy cập tài nguyên dùng chung.  |
| **Manager** | Người quản lý đội nhóm | Tất cả của Member, cộng thêm khả năng xem và quản lý đội nhóm.        |
| **Admin**   | Quản trị viên tenant   | Toàn quyền: thành viên, lời mời, vai trò, quyền, cài đặt và tích hợp. |

---

## Liên kết nhanh đến hướng dẫn

Tùy vai trò, hãy bắt đầu tại đây:

- **Mới dùng nền tảng?** → [Đăng nhập lần đầu](/docs/getting-started/first-login) và [Điều hướng](/docs/getting-started/navigation).
- **Thiết lập hồ sơ** → [Thiết lập hồ sơ](/docs/getting-started/profile-setup).
- **Member** → Hướng dẫn Member: dashboard, cài đặt hồ sơ và trợ lý AI.
- **Admin** → Hướng dẫn Admin: thành viên, vai trò, cài đặt và tích hợp.

Dùng **thanh bên tài liệu** hoặc **tìm kiếm** để chuyển nhanh đến chủ đề bất kỳ.

---

## Thành phần tương tác

Nền tảng dùng hệ thống thiết kế nhất quán. Đây là bản xem trước trực tiếp của các biến thể nút có sẵn:

```preview
component: ButtonVariants
props: {}
```

---

## Vì sao dùng template này?

Template này được thiết kế làm nền tảng vững chắc cho SaaS của bạn:

- **Đa tenant ngay từ đầu** — Cô lập dữ liệu đúng cách, cấu hình theo tenant và kiến trúc có thể mở rộng.
- **AI-native** — Hạ tầng trợ lý AI sẵn sàng cho các trường hợp sử dụng chuyên biệt theo miền của bạn.
- **Phân quyền đúng cách** — RBAC với quyền chi tiết, không chỉ kiểm tra vai trò.
- **Sẵn sàng tích hợp** — Hạ tầng webhook và bộ máy đồng bộ để kết nối hệ thống bên ngoài.

Nếu có phản hồi hoặc câu hỏi, hãy dùng kênh hỗ trợ thường dùng của tenant hoặc liên hệ admin của bạn.
