---
title: Thành viên & lời mời
description: >-
  Thêm và xóa thành viên, tạo liên kết mời kèm vai trò, quản lý trạng thái
  thành viên và thời hạn lời mời.
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/members-invitations.md
  sourceHash: e23b8e807ebca8e8f590e0c022a1bb1a1e94c0e142b775591c9fb57ec8469305
  status: reviewed
---

# Thành viên & lời mời

Admins quản lý **ai thuộc tenant** và **cách họ tham gia**. Bạn có thể thêm thành viên trực tiếp, gửi lời mời với vai trò đã chọn, kiểm soát thời hạn lời mời và trạng thái thành viên.

## Thêm thành viên

Có hai cách chính để thêm thành viên:

1. **Invitation** — Gửi liên kết mời hoặc email; người được mời chấp nhận và được thêm với vai trò bạn chọn.
2. **Direct add / import** — Tự tạo membership, ví dụ sau bulk import hoặc SSO. Người đó vẫn có thể cần hoàn tất thiết lập hồ sơ.

### Gửi lời mời

1. Vào **Admin** → **Members** hoặc **Invitations**.
2. Nhấn **Invite member** hoặc **Create invitation**.
3. **Nhập email** và tùy chọn tên.
4. **Chọn vai trò** — Chọn vai trò người đó sẽ có khi chấp nhận, ví dụ Member, Manager, 1:1er. Đây là quyền ban đầu.
5. **Đặt thời hạn** nếu tenant hỗ trợ, ví dụ 7 hoặc 30 ngày. Sau thời hạn, liên kết có thể không còn hoạt động và cần gửi lại.
6. Tạo liên kết hoặc gửi email. Chia sẻ liên kết mời với người đó, hoặc họ nhận qua email nếu đã cấu hình.

> **Mẹo:** Dùng vai trò khớp với công việc của người đó: ví dụ “Member” cho đa số, “Manager” hoặc “1:1er” chỉ khi họ cần các quyền đó.

## Liên kết mời và vai trò

- **Invite link** — URL duy nhất; khi mở và đăng nhập/đăng ký, nó tạo hoặc cập nhật membership của người đó trong tenant với **role(s)** bạn đã chọn.
- **Roles** — Đến từ vai trò của tenant, gồm vai trò hệ thống như Member, Manager, Admin, 1:1er, Referente và vai trò tùy chỉnh. Lời mời lưu **role ID** đã chọn; khi chấp nhận, vai trò được gán trong `tenant_membership_roles`.

Một người có thể có **nhiều vai trò** sau khi tham gia; bạn có thể đổi vai trò sau trong danh sách Members.

## Quản lý trạng thái thành viên

Từ danh sách **Members**, bạn có thể:

- **Xem** toàn bộ thành viên tenant, vai trò và trạng thái như active, inactive nếu tenant hỗ trợ.
- **Chỉnh vai trò** — Thêm hoặc xóa vai trò của thành viên. Quyền hiệu lực là hợp của mọi vai trò.
- **Vô hiệu hóa hoặc xóa** — Tùy cấu hình tenant, bạn có thể vô hiệu hóa thành viên để họ mất quyền truy cập, hoặc xóa khỏi tenant.

Thay đổi vai trò có hiệu lực ở request tiếp theo; thành viên có thể cần refresh hoặc đăng nhập lại để thấy menu và quyền mới.

## Thời hạn lời mời

Nếu bật **invite expiration**:

- Mỗi lời mời có ngày **valid until**. Sau ngày đó, liên kết có thể báo lỗi hoặc yêu cầu lời mời mới.
- Bạn có thể **resend** hoặc **regenerate** lời mời từ danh sách Invitations nếu đã hết hạn.
- Thời hạn ngắn hơn, ví dụ 7 ngày, tăng bảo mật; dài hơn, ví dụ 30 ngày, thuận tiện hơn cho onboarding.

## Từng bước: mời thành viên mới

1. Vào **Admin** → **Members** → **Invitations** hoặc **Invite member**.
2. Nhập **email** của người đó và chọn **role(s)**, ví dụ Member.
3. Đặt **expiration** nếu cần.
4. Nhấn **Send** hoặc **Generate link**. Sao chép liên kết nếu cần chia sẻ thủ công.
5. Người đó mở liên kết, đăng nhập hoặc đăng ký và chấp nhận. Họ trở thành thành viên với vai trò đã chọn.
6. Tùy chọn vào **Members**, tìm họ và thêm vai trò khác, ví dụ 1:1er, hoặc điều chỉnh khi cần.

> **Mẹo:** Theo dõi danh sách Invitations để xử lý lời mời đang chờ hoặc đã hết hạn, gửi lại hoặc gia hạn để người mới không bị chặn.
