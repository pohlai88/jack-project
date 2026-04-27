---
title: Đăng nhập lần đầu
description: >-
  Cách đăng nhập Afenda bằng Auth0 (SSO hoặc email), chọn tenant và làm quen
  trong lần truy cập đầu tiên.
section: getting-started
order: 2
translation:
  sourceLocale: en
  sourcePath: getting-started/first-login.md
  sourceHash: 52813e8d99ceccb042bb59e82b166dd9d7811ea2dacafc8c599670b0d400bde9
  status: reviewed
---

# Đăng nhập lần đầu

Hướng dẫn này giúp bạn đăng nhập Afenda lần đầu, chọn tổ chức (tenant) và tận dụng trải nghiệm dashboard đầu tiên.

---

## Đăng nhập bằng Auth0

Afenda dùng **Auth0** để xác thực. Bạn có thể đăng nhập bằng:

- **Single sign-on (SSO)** — Nếu tổ chức dùng SSO (ví dụ Google Workspace, Microsoft Azure AD), hãy chọn phương thức admin cung cấp. Bạn có thể được chuyển đến trang đăng nhập của công ty.
- **Email và mật khẩu** — Nếu tenant cho phép, bạn có thể đăng ký hoặc đăng nhập bằng email.
- **Kết nối mạng xã hội hoặc doanh nghiệp** — Tùy cấu hình tenant, có thể có các lựa chọn như Google, GitHub hoặc LinkedIn.

### Các bước đăng nhập

1. Mở URL Afenda do tổ chức cung cấp (ví dụ `https://your-tenant.afenda.app` hoặc domain riêng của công ty).
2. Nhấn **Sign in** hoặc **Log in**.
3. Chọn phương thức đăng nhập được cung cấp (SSO, email hoặc social).
4. Hoàn tất luồng Auth0 (nhập thông tin đăng nhập, xác nhận MFA nếu được yêu cầu).
5. Sau khi xác thực, bạn được chuyển lại Afenda.

> **Mẹo:** Nếu không thấy phương thức đăng nhập mong đợi, tenant có thể chỉ bật SSO hoặc một số kết nối cụ thể. Hãy liên hệ admin Afenda hoặc IT để biết cách đăng nhập đúng.

---

## Chọn tenant (nhiều tổ chức)

Nếu bạn thuộc **nhiều hơn một tổ chức** (tenant) trong Afenda, bạn cần chọn tổ chức để sử dụng sau khi đăng nhập.

- Bạn có thể thấy **tenant switcher** hoặc màn hình chọn tenant liệt kê các tổ chức.
- Chọn tenant bạn muốn làm việc. Ứng dụng sẽ tải dữ liệu của tenant đó: thành viên, kỹ năng, dự án và cài đặt.
- Bạn có thể chuyển tenant sau này từ header hoặc menu tài khoản mà không cần đăng xuất.

Nếu chỉ có một tenant, bước này có thể bị bỏ qua và bạn sẽ vào thẳng dashboard.

---

## Trải nghiệm dashboard lần đầu

Sau khi đăng nhập và chọn tenant nếu cần, bạn sẽ vào **dashboard**. Nội dung hiển thị phụ thuộc vào vai trò:

- **Members** thấy **My View**: dashboard cá nhân với liên kết nhanh đến hồ sơ, kỹ năng, OKRs, học tập, hiệu suất và hơn thế nữa.
- **Managers** cũng có thể thấy **Manager View**: tổng quan đội nhóm, báo cáo và hành động dành cho quản lý.
- **1:1 Facilitators** có thể mở **1:1 View**: danh sách những người họ họp 1:1 và các cuộc họp liên quan.
- **Admins** có thể truy cập **Admin View**: cấu hình, thành viên, kỹ năng và cài đặt tenant.

Trong lần đăng nhập đầu tiên, bạn có thể thấy:

- Các phần trống hoặc placeholder cho đến khi hoàn tất hồ sơ và bắt đầu dùng tính năng.
- Gợi ý onboarding hoặc tooltip nếu tenant đã bật.
- Thông báo hoặc tác vụ như “Complete your profile” hoặc “Set your first OKR”.

> **Mẹo:** Dành vài phút cho [Thiết lập hồ sơ](/docs/getting-started/profile-setup) để tên, chức danh và tùy chọn của bạn chính xác. Sau đó đọc [Điều hướng & chế độ xem](/docs/getting-started/navigation) để biết mọi thứ nằm ở đâu.

---

## Mẹo để bắt đầu

1. **Hoàn tất hồ sơ** — Thêm tên, chức danh, tiểu sử, múi giờ và tùy chọn GitHub/LinkedIn. Điều này giúp đồng nghiệp tìm thấy bạn trong People Finder và cải thiện đề xuất AI.
2. **Chọn chế độ xem** — Dùng sidebar hoặc view switcher để chuyển giữa My View, Manager View, 1:1 View và Admin View nếu bạn có quyền. Mỗi view có menu riêng.
3. **Dùng tìm kiếm toàn cục** — Nhấn **Cmd+K** (Mac) hoặc **Ctrl+K** (Windows/Linux) để tìm người, tài liệu và hành động.
4. **Đặt ngôn ngữ và giao diện** — Dùng locale switcher cho ngôn ngữ và theme toggle cho sáng/tối nếu tenant hỗ trợ.
5. **Đánh dấu tài liệu** — Giữ [Chào mừng đến với Afenda](/docs/getting-started) và các hướng dẫn theo vai trò để tham khảo khi khám phá.

Nếu gặp vấn đề đăng nhập như sai tenant, thiếu SSO hoặc tài khoản bị khóa, hãy liên hệ **quản trị viên Afenda** hoặc bộ phận IT của tổ chức.

---

## Bảo mật và phiên đăng nhập

- **Thời lượng phiên** — Thời gian duy trì đăng nhập phụ thuộc vào cài đặt Auth0 và Afenda của tenant. Bạn có thể được yêu cầu đăng nhập lại sau một thời gian không hoạt động hoặc sau mốc thời gian cố định.
- **Đăng xuất** — Dùng menu tài khoản (avatar hoặc tên ở header) và chọn **Sign out** hoặc **Log out**. Bạn sẽ cần đăng nhập lại để truy cập Afenda.
- **Nhiều thiết bị** — Bạn có thể dùng Afenda trên nhiều thiết bị. Mỗi phiên tuân theo cùng quy tắc bảo mật và timeout. Hãy đăng xuất trên thiết bị dùng chung khi hoàn tất.
- **Mật khẩu và MFA** — Đổi mật khẩu và xác thực đa yếu tố được quản lý trong Auth0 hoặc nhà cung cấp SSO. Nếu cần đặt lại mật khẩu hoặc cập nhật MFA, hãy dùng liên kết từ trang đăng nhập hoặc liên hệ IT/admin Afenda.
