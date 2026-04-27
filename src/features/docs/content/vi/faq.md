---
title: Câu hỏi thường gặp
description: >-
  Các câu hỏi phổ biến về nền tảng — đặt lại mật khẩu, vai trò, tích hợp, tính
  năng AI, xuất dữ liệu và cách nhận trợ giúp.
section: faq
order: 1
translation:
  sourceLocale: en
  sourcePath: faq.md
  sourceHash: 7cf639cf207aa59b7d7c2e562f6749a3cbaaf13d2193c386f42b2c09d0ca6ae2
  status: reviewed
---

# Câu hỏi thường gặp

Câu trả lời cho các câu hỏi phổ biến. Với hướng dẫn theo vai trò, xem [Member](/docs/member) và [Admin](/docs/admin).

## Làm sao đặt lại mật khẩu?

- Nếu tenant dùng đăng nhập **email/password**: Dùng liên kết **Forgot password** trên trang đăng nhập. Nhập email; bạn sẽ nhận liên kết để đặt mật khẩu mới. Liên kết có thể hết hạn sau thời gian ngắn, ví dụ 1 giờ.
- Nếu bạn đăng nhập bằng **SSO** như Google hoặc Microsoft: Mật khẩu do nhà cung cấp danh tính quản lý. Hãy dùng quy trình đặt lại mật khẩu của nhà cung cấp đó, ví dụ IT công ty hoặc khôi phục tài khoản Google.
- Nếu không nhận email: Kiểm tra spam, sau đó nhờ **admin** xác nhận email của bạn trong tenant và gửi lại.

## Vai trò hoạt động như thế nào?

Nền tảng dùng **permissions**, không dùng chức danh công việc. **Roles** như Member, Manager, Admin là các gói **permissions**. Bạn làm được gì phụ thuộc vào **permissions** bạn có.

- Bạn có thể có **nhiều vai trò** trong một tenant. Quyền hiệu lực là **hợp** của tất cả quyền từ mọi vai trò.
- Chỉ **admins** có thể gán hoặc đổi vai trò (Admin → Members). Nếu không thấy một phần nào đó, có thể bạn chưa có đúng vai trò/quyền — hãy hỏi admin.

> **Mẹo:** Ủy quyền luôn dựa trên permission key, ví dụ `admin:dashboard`, `admin:members`. Tên vai trò chỉ để hiển thị và nhóm quyền.

## Làm sao kết nối tích hợp?

- **Cho tenant**: **Admins** cấu hình tích hợp trong **Admin** → **Integrations**: webhooks, OAuth apps, API keys và data mapping. Nếu tích hợp chưa có, admin có thể cần bật hoặc thêm credentials. Xem [Tích hợp](/docs/admin/integrations) để biết chi tiết.

## Tính năng AI hoạt động thế nào?

Nền tảng có thể dùng AI cho:

- **AI Assistant** — Chat và đề xuất nếu được bật. Dùng provider và model AI đã cấu hình của tenant.
- **Tìm kiếm ngữ nghĩa** — Tìm kiếm bằng AI trên nội dung với embeddings để khớp theo ý nghĩa.

Admins đặt **AI provider và model** trong **Admin** → **Settings**. Dữ liệu gửi đến provider phụ thuộc vào từng tính năng. Hãy kiểm tra chính sách riêng tư và xử lý dữ liệu của tenant.

## Làm sao xuất dữ liệu?

- **Dữ liệu của bạn**: Dùng **Profile** hoặc **Settings** để xem tùy chọn xuất dữ liệu tài khoản.
- **Admins**: **Admin** → **Settings** có thể cung cấp xuất dữ liệu phân tích hoặc audit logs.

Nếu không thấy tùy chọn xuất, vai trò của bạn có thể chưa có quyền hoặc tính năng chưa được bật — hãy hỏi admin.

## Làm sao nhận trợ giúp?

- **Trong ứng dụng**: Dùng liên kết **Help** hoặc **Docs**, thường ở header hoặc footer, để mở tài liệu này.
- **Admin của bạn**: Với quyền truy cập, vai trò, lời mời hoặc hành vi riêng theo tenant, hãy liên hệ **tenant admin** hoặc IT.
- **Hỗ trợ**: Nếu tổ chức có kênh hỗ trợ, hãy dùng kênh đó cho lỗi, sự cố hoặc vấn đề tài khoản.

> **Mẹo:** Đánh dấu [Docs](/docs) và dùng sidebar để chuyển đến vai trò của bạn (Member, Admin) cho hướng dẫn từng bước.
