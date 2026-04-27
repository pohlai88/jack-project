---
title: Thương hiệu & tùy chỉnh
description: >-
  Tùy chỉnh tenant Afenda bằng màu sắc, typography, mật độ, kiểu bề mặt và các
  cài đặt hình ảnh khác.
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/branding.md
  sourceHash: 8aaf92670ab03db5a7a4acd107eb7d3e31dcaef30ee188c706bb3edc9fa45255
  status: reviewed
---

# Thương hiệu & tùy chỉnh

Afenda có khả năng tùy chỉnh cao để khớp nhận diện hình ảnh và sở thích thiết kế của tổ chức. Hướng dẫn này giới thiệu các cài đặt branding dành cho admin.

---

## Tìm cài đặt thương hiệu ở đâu

1. Đăng nhập với vai trò **Admin** và vào **Admin View**
2. Trong sidebar, chọn **Settings**
3. Nhấn tab **Branding** hoặc mục tương tự
4. Thực hiện thay đổi và **Save**

Mọi thay đổi áp dụng ngay cho tenant trên tất cả người dùng và thiết bị.

---

## Các thành phần thương hiệu có thể tùy chỉnh

### Màu sắc

Tùy chỉnh ba màu chính định nghĩa thương hiệu của bạn trong Afenda:

#### Màu chính

- **Là gì:** Màu thương hiệu chính dùng cho nút chính, liên kết, điểm nhấn và highlight.
- **Mặc định:** Xanh dương rực (`#3B82F6`)
- **Mẹo:**
  - Chọn màu có độ tương phản tốt với nền trắng và nền trung tính bạn chọn.
  - Dùng màu bão hòa, dễ nhớ; tránh xám và trắng.
  - Kiểm tra cả light mode và dark mode để bảo đảm dễ đọc.

#### Màu phụ

- **Là gì:** Màu bổ trợ cho hành động phụ, badge và thành phần hỗ trợ.
- **Mặc định:** Teal (`#10B981`)
- **Mẹo:**
  - Phù hợp làm điểm nhấn tương phản, ví dụ tiến độ hoặc hành động tích cực.
  - Nên phối hợp tốt với Primary Color.

#### Màu nhấn

- **Là gì:** Màu sáng, năng lượng cho highlight, cảnh báo và nhấn mạnh.
- **Mặc định:** Amber ấm (`#F59E0B`)
- **Mẹo:**
  - Thường dùng cho cảnh báo, CTA phụ và trạng thái hover tương tác.
  - Nên khác biệt với Primary và Secondary.

#### Phản hồi độ tương phản màu

- **WCAG Validation** — Khi bạn đặt cặp màu, Afenda tự kiểm tra có đạt tiêu chuẩn tương phản Web Content Accessibility Guidelines (WCAG) không.
- **Green check** — Cặp màu đạt **WCAG AA** (tỷ lệ tương phản 4.5:1 cho chữ thường).
- **Orange warning** — Tương phản tốt nhưng nên cải thiện để đạt AA.
- **Recommendation** — Nếu tương phản thấp, hệ thống gợi ý sắc độ sáng hơn hoặc tối hơn để đạt accessibility.

**Ví dụ:**

```
Primary: #0066CC (Blue)
Background: #FFFFFF (White)
Contrast ratio: 8.6:1 ✓ WCAG AAA (best readability)
```

---

### Kiểu chữ

Tùy chỉnh cách chữ hiển thị trên nền tảng.

#### Họ phông chữ

Chọn từ các họ font được duy trì chuyên nghiệp:

- **DM Sans** (mặc định) — Hiện đại, thân thiện, bo nhẹ. Tốt cho sản phẩm công nghệ.
- **Inter** — Trung tính, rất dễ đọc. Xuất sắc cho UI và nội dung.
- **Open Sans** — Ấm áp, dễ tiếp cận. Phù hợp môi trường doanh nghiệp.
- **System Font** — Dùng font mặc định của OS (San Francisco trên Mac, Segoe UI trên Windows). Tải nhanh nhất, không cần font ngoài.

**Mẹo:**

- Nếu hiệu năng là ưu tiên, dùng **System Font**.
- Để nhất quán thương hiệu, khớp font và weight với website marketing.
- Mọi font gồm weight 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

---

### Mật độ

Kiểm soát lượng khoảng cách (padding và margin) trong giao diện.

- **Compact** (0.75x) — Giảm khoảng cách. Nhiều dữ liệu hơn trên mỗi màn hình. Tốt cho đội quản lý nhiều mục.
- **Default** (1x) — Cân bằng khoảng cách. Trải nghiệm Afenda chuẩn.
- **Comfortable** (1.25x) — Tăng khoảng cách. Tốt hơn cho accessibility và dễ đọc, phù hợp tổ chức ưu tiên khả năng tiếp cận.

**Mẹo:**

- Compact hữu ích cho dashboard admin nhiều dữ liệu hoặc view đội nhóm lớn.
- Comfortable tốt hơn cho member tập trung phát triển cá nhân.
- Chỉ đặt được một density cho mỗi tenant; người dùng cá nhân không thể ghi đè.

---

### Kiểu bề mặt

Kiểm soát chiều sâu thị giác và elevation của cards, panels, containers.

- **Flat** — Không shadow, tách biệt tối thiểu. Gọn và tối giản.
- **Elevated** (mặc định) — Shadow nhẹ và gợi ý chiều sâu. Dễ quét bằng mắt hơn.
- **Glass** (Glassmorphism) — Hiệu ứng kính mờ với blur và trong suốt. Hiện đại và nổi bật.

**Mẹo:**

- **Flat** phù hợp giao diện nhiều dữ liệu, mật độ cao.
- **Elevated** là mặc định an toàn cho cân bằng thẩm mỹ và khả dụng.
- **Glass** hiện đại và bắt mắt; kiểm tra trong dark mode để bảo đảm vẫn dễ đọc.

---

### Độ ấm màu trung tính

Tinh chỉnh sắc độ nền của màu trung tính (xám và viền).

- **Cool** — Xám có undertone xanh. Cảm giác tươi và kỹ thuật. Dùng với màu tông lạnh.
- **Neutral** (mặc định) — Xám thuần, không ấm/lạnh. Linh hoạt và hiện đại.
- **Warm** — Xám có undertone ấm (cam/nâu). Cảm giác thân thiện. Dùng với màu tông ấm.

**Mẹo:**

- Khớp warmth của bảng màu trung tính với Primary Color để hài hòa.
- Cool hợp với xanh dương, teal, tím.
- Warm hợp với cam, đỏ, nâu.
- Neutral an toàn nhất cho môi trường doanh nghiệp.

---

## Logo & nhận diện tổ chức

Bên cạnh màu sắc và typography:

- **Tenant name** — Tên tổ chức, hiển thị ở header và footer.
- **Logo** — Nếu có, upload logo tổ chức cho header và trang đăng nhập.
- **Favicon** — Biểu tượng nhỏ trong tab trình duyệt.
- **Email template colors** — Email gửi từ nền tảng có thể dùng màu thương hiệu.

---

## Xem trước & kiểm thử trực tiếp

Trước khi lưu, dùng **preview panel** trong cài đặt thương hiệu để:

1. Xem màu đã chọn áp dụng lên nút, card và thành phần UI
2. Chuyển giữa light và dark mode
3. Kiểm tra tương phản chữ và độ dễ đọc

**Luôn kiểm thử:**

- Light mode và dark mode
- Nhiều kích thước màn hình (desktop, tablet, mobile)
- Với đội nhóm của bạn (lấy phản hồi từ vài người dùng)

---

## Các thực hành tốt nhất

### Nhất quán

- Khớp màu và font với website marketing nếu có thể.
- Dùng branding nhất quán trên Afenda, email templates và integrations.

### Khả năng tiếp cận

- Luôn duy trì tương phản tốt (WCAG AA hoặc AAA).
- Dùng trình kiểm tra tương phản tích hợp của Afenda khi chọn màu.
- Không chỉ dựa vào màu để truyền đạt ý nghĩa; ví dụ dùng icon + màu cho trạng thái.

### Hiệu năng

- Tránh quá nhiều custom fonts; giữ 1–2 font families.
- System Font tải nhanh nhất; custom fonts có thể thêm 50–200ms vào thời gian tải trang.
- Khác biệt thị giác là tối thiểu với đa số người dùng.

### Chế độ tối

- Kiểm tra mọi màu trong dark mode.
- Glass surfaces có thể cần điều chỉnh để vẫn dễ đọc trong nền tối.
- Bảo đảm Primary Color đủ sáng trên nền tối.

### Di động

- Density và surface style ảnh hưởng mạnh đến khả dụng trên mobile.
- Kiểm tra trên điện thoại hoặc tablet thật, không chỉ browser devtools.
- Màn hình nhỏ thường hưởng lợi từ Comfortable spacing và Elevated surface style.

---

## Đặt lại mặc định

Nếu muốn bắt đầu lại:

1. Vào **Settings** → **Branding**
2. Nhấn **Reset to Defaults** nếu có
3. Xác nhận

Thao tác này đưa mọi màu, font, density và surface style về mặc định của Afenda. Tên tenant và logo không đổi.

---

## Xử lý sự cố

**Màu không thay đổi sau khi lưu:**

- Refresh trang hoặc xóa cache trình duyệt (Cmd+Shift+R trên Mac, Ctrl+Shift+R trên Windows).
- Kiểm tra kết nối internet.
- Nếu vẫn còn, liên hệ hỗ trợ Afenda.

**Custom font không hiển thị:**

- Một số trình duyệt chặn font ngoài nếu bạn ở sau proxy doanh nghiệp.
- Thử System Font làm lựa chọn thay thế.
- Nhờ đội IT allowlist `fonts.googleapis.com` hoặc `fonts.gstatic.com` nếu dùng custom fonts.

**Cảnh báo tương phản chữ — cần làm gì?**

- Validator tích hợp gợi ý sắc độ sáng hơn hoặc tối hơn.
- Bạn có thể chấp nhận gợi ý hoặc tự chỉnh.
- WCAG AA (4.5:1) là chuẩn pháp lý tối thiểu; AAA (7:1) tốt hơn cho accessibility.

**Dark mode trông khác light mode:**

- Điều này bình thường; cảm nhận màu thay đổi theo độ sáng nền.
- Điều chỉnh màu cho cả hai mode hoặc hỏi hỗ trợ thiết kế.

---

## Bước tiếp theo

- **Khám phá cài đặt khác** → [Tổng quan cài đặt](./settings)
- **Thêm tích hợp** → [Hướng dẫn tích hợp](./integrations)
- **Quản lý thành viên và vai trò** → [Thành viên & lời mời](./members-invitations)
- **Cần thêm hướng dẫn thiết kế?** → Liên hệ designer Afenda hoặc <support@example.com>

Thương hiệu của bạn quan trọng. Hãy dành thời gian chỉnh màu và typography thật chuẩn vì đó là một trong những điều đầu tiên mọi người thấy trong Afenda mỗi ngày.
