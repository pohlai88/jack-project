---
title: Tích hợp
description: >-
  GitHub, LinkedIn, Slack, Google Workspace, GitLab, webhooks — thiết lập OAuth,
  đồng bộ và data mapping.
section: admin
order: 9
translation:
  sourceLocale: en
  sourcePath: admin/integrations.md
  sourceHash: bf7697687d139f10500512f0bbdcfbc377297876a575ada2ce17e9d494693371
  status: reviewed
---

# Tích hợp

Afenda có thể kết nối với hệ thống bên ngoài để đồng bộ con người, kỹ năng hoặc hoạt động và làm giàu hồ sơ. Admins cấu hình **integrations** (OAuth, API keys, webhooks) và **data mapping** để dữ liệu đi vào và đi ra đúng cách.

## Tích hợp được hỗ trợ (tổng quan)

| Tích hợp             | Trạng thái | Cách dùng phổ biến                                                      |
| -------------------- | ---------- | ----------------------------------------------------------------------- |
| **GitHub**           | ✅ Active  | Liên kết hồ sơ với GitHub; đồng bộ repo, hoạt động hoặc kỹ năng từ code |
| **Webhooks**         | ✅ Active  | Sự kiện outbound, ví dụ person updated, assessment submitted            |
| **LinkedIn**         | 🔜 Soon    | Nhập hồ sơ hoặc kỹ năng từ LinkedIn                                     |
| **Slack**            | 🔜 Soon    | Thông báo, bot hoặc liên kết danh tính                                  |
| **Google Workspace** | 🔜 Soon    | Danh tính, lịch hoặc đồng bộ danh bạ                                    |
| **GitLab**           | 🔜 Soon    | Tương tự GitHub — repo, hoạt động, kỹ năng                              |

Dùng **Admin** → **Integrations** để xem tích hợp nào đang bật.

## Tích hợp GitHub (đang hoạt động)

GitHub là tích hợp chính đang hoạt động. Sau khi cấu hình:

1. **Tạo OAuth App** trong GitHub → Developer Settings. Lấy **Client ID** và **Client Secret**.
2. **Đặt redirect URI** — dùng URL hiển thị trong Admin → Integrations → GitHub, ví dụ `https://your-tenant.app/api/auth/callback/github`.
3. Trong **Admin** → **Integrations** → **GitHub**, nhập credentials và lưu.
4. Members có thể kết nối tài khoản GitHub từ cài đặt hồ sơ.

Mỗi lần đồng bộ, Afenda **tự động tạo evidence record** trên hồ sơ person cho biết repo đã quét, ngôn ngữ tìm thấy, kỹ năng suy luận và đóng góp.

## Webhooks (đang hoạt động — gửi đi)

**Webhooks** gửi sự kiện từ Afenda đến hệ thống của bạn, ví dụ "person created", "assessment submitted":

1. **Admin** → **Integrations** → **Webhooks**.
2. **Add webhook** — URL, secret tùy chọn để ký payload và **event types** cần subscribe.
3. Lưu. Afenda sẽ POST payload JSON đến URL của bạn cho mỗi sự kiện đã chọn. Hãy triển khai idempotency và xác minh chữ ký.

## Thiết lập OAuth cho tích hợp sắp ra mắt

Với tích hợp dùng **OAuth** như LinkedIn, Slack, Google Workspace, GitLab:

1. **Tạo app** trong developer portal của provider. Lấy **Client ID** và **Client Secret**.
2. **Đặt redirect URI** — dùng URL Afenda cung cấp. Phải khớp chính xác.
3. Trong **Admin** → **Integrations**, chọn tích hợp và nhập credentials.
4. Members cấp quyền qua màn hình consent của provider.

> **Mẹo:** Dùng OAuth app riêng cho từng môi trường (dev và prod), và xoay vòng secrets nếu bị lộ.

## Tìm kiếm ngữ nghĩa và embedding

Đồng bộ tích hợp đóng góp vào **semantic search** (People Finder, AI Assistant):

- **Kỹ năng mới** từ GitHub sync được tạo embeddings để tìm kiếm kỹ năng.
- **Hồ sơ cập nhật** được tạo lại embedding để People Finder luôn mới.
- **Bulk imports** (skills, capabilities, persons) cũng tự động tạo embeddings.
