---
title: Cài đặt
description: >-
  Cờ tính năng, thương hiệu (logo, màu sắc), cấu hình nhà cung cấp AI, thang kỹ năng,
  danh mục kỹ năng và cài đặt storage.
section: admin
order: 8
translation:
  sourceLocale: en
  sourcePath: admin/settings.md
  sourceHash: 927d9e3e42daa45b5606256f9e0874394ca525773f8480b0190a1f1ebff642df
  status: reviewed
---

# Cài đặt

Admins cấu hình **cài đặt toàn tenant** trong **Admin** → **Settings**: feature flags, branding, AI provider, thang kỹ năng, danh mục và storage. Các cài đặt này ảnh hưởng đến giao diện và hành vi nền tảng cho mọi người trong tenant.

## Cờ tính năng

**Cờ tính năng** bật hoặc tắt tính năng cho tenant mà không cần deploy code.

| Flag phổ biến                 | Kiểm soát gì                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------ |
| **allowCustomRoles**          | Khi bật: admin có thể tạo vai trò tùy chỉnh. Khi tắt: chỉ có vai trò hệ thống. |
| **OKRs**                      | Bật hoặc ẩn tính năng OKR (mục tiêu, check-in) cho tenant.                     |
| **Recognitions**              | Bật hoặc ẩn tính năng ghi nhận/khen ngợi.                                      |
| **Integrations**              | Bật các tích hợp cụ thể, ví dụ GitHub, Slack.                                  |
| **CV upload / onboarding**    | Bật xử lý CV bằng AI và trích xuất kỹ năng cho onboarding.                     |
| **People Finder / AI search** | Bật tìm kiếm bằng ngôn ngữ tự nhiên và theo năng lực.                          |

Bật/tắt flag theo nhu cầu rollout hoặc tuân thủ. Thay đổi áp dụng sau khi lưu; người dùng có thể cần refresh.

## Thương hiệu

- **Logo** — Upload hoặc đặt logo tenant hiển thị trong header và trang đăng nhập/shell. Định dạng và kích thước khuyến nghị thường được ghi trong UI.
- **Colors** — Màu primary và tùy chọn secondary cho nút, liên kết và điểm nhấn. Dùng màu thương hiệu của tổ chức để có trải nghiệm nhất quán.

> **Mẹo:** Dùng logo và màu có độ tương phản cao để giao diện vẫn dễ tiếp cận.

## Cấu hình nhà cung cấp AI

Nếu tenant dùng **tính năng AI** như People Finder, trích xuất CV hoặc AI assistant:

- **Provider** — Ví dụ OpenAI, Azure OpenAI hoặc provider đã cấu hình khác.
- **Model** — Model dùng cho embeddings và/hoặc chat, ví dụ cho search so với assistant.
- **API key / endpoint** — Được lưu an toàn; admins đặt hoặc xoay vòng keys trong Settings. Keys không hiển thị đầy đủ sau khi lưu.

Kiểm tra tài liệu của provider về rate limits và chi phí. Thay đổi model hoặc key có thể cần restart hoặc xóa cache cho một số tính năng.

## Thang kỹ năng (1–5 cấp)

Cấp độ kỹ năng thường được định nghĩa trên một **scale**, ví dụ 1–5. Trong Settings bạn có thể:

- **Đặt scale** — Ví dụ 1 = Beginner, 5 = Expert. Nhãn có thể chỉnh theo từng cấp.
- **Dùng nhất quán** — Cùng một scale áp dụng cho self-assessments, capabilities (minimum level) và reporting. Chỉ thay đổi khi sẵn sàng căn chỉnh dữ liệu lịch sử hoặc chấp nhận migration một lần.

## Danh mục kỹ năng

- **Categories** nhóm kỹ năng trong catalog, ví dụ "Technical", "Leadership". Bạn có thể tạo, đổi tên, sắp xếp lại hoặc archive categories trong Settings hoặc Skills Management.
- Categories giúp lọc kỹ năng trong UI admin và member. Giữ danh sách ngắn gọn.

## Cài đặt lưu trữ

Tùy cách triển khai, Settings có thể gồm:

- **File storage** — Nơi lưu file upload như CV, avatar, attachments, ví dụ S3 hoặc local. Admins có thể đặt bucket, region hoặc paths.
- **Limits** — Kích thước file tối đa, loại file cho phép hoặc retention. Cấu hình theo chính sách.

## Từng bước: đổi thương hiệu và một cờ tính năng

1. Vào **Admin** → **Settings**.
2. **Branding** — Upload logo mới và đặt màu primary. Lưu.
3. **Cờ tính năng** — Tìm flag, ví dụ "Recognitions", rồi bật hoặc tắt. Lưu.
4. Refresh ứng dụng và xác nhận logo/màu cùng khả năng hiển thị tính năng, ví dụ menu Recognition xuất hiện hoặc biến mất.
