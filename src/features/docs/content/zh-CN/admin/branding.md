---
title: Branding 和自定义
description: >-
  使用颜色、typography、density、surface styles 和其他视觉设置自定义 Afenda tenant。
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/branding.md
  sourceHash: 3050eecffc34bc19774d2477d2318be0966baa3fc37c526bffa9ca5818a753ed
  status: reviewed
---

# Branding 和自定义

Afenda 可高度自定义，以匹配组织的视觉身份和设计偏好。本指南介绍 admin 可用的 branding 设置。

---

## 在哪里找到 Branding 设置

1. 以 **Admin** 身份登录并进入 **Admin View**
2. 在 sidebar 中选择 **Settings**
3. 点击 **Branding** tab 或类似入口
4. 进行更改并 **Save**

所有更改会立即应用到 tenant 的所有用户和设备。

---

## 可自定义的 branding 元素

### 颜色

自定义定义 Afenda 品牌的三种主要颜色：

#### Primary Color

- **是什么：** 主品牌色，用于主按钮、链接、强调和高亮。
- **默认：** 明亮蓝色 (`#3B82F6`)
- **提示：**
  - 选择与白色和所选中性背景有良好对比的颜色。
  - 使用饱和、易记的颜色；避免灰色和白色。
  - 在 light 和 dark mode 中测试，确保可读。

#### Secondary Color

- **是什么：** 用于次要操作、badges 和辅助元素的补充色。
- **默认：** Teal (`#10B981`)
- **提示：**
  - 适合作为对比强调，例如进度或正向操作。
  - 应与 Primary Color 协调。

#### Accent Color

- **是什么：** 明亮、有活力的颜色，用于高亮、警告和强调。
- **默认：** 暖 amber (`#F59E0B`)
- **提示：**
  - 常用于 warnings、secondary CTAs 和交互 hover states。
  - 应区别于 Primary 和 Secondary colors。

#### 颜色对比反馈

- **WCAG Validation** — 设置一组颜色时，Afenda 会自动检查其是否符合 Web Content Accessibility Guidelines (WCAG) 对比标准。
- **Green check** — 颜色组合达到 **WCAG AA**（普通文本 4.5:1 对比度）。
- **Orange warning** — 对比度不错，但建议改进以达到 AA。
- **Recommendation** — 如果对比度低，系统会建议更亮或更暗的色阶以满足 accessibility。

**示例：**

```
Primary: #0066CC (Blue)
Background: #FFFFFF (White)
Contrast ratio: 8.6:1 ✓ WCAG AAA (best readability)
```

---

### Typography

自定义整个平台中的文字显示方式。

#### Font Family

可从多个专业维护的字体族中选择：

- **DM Sans**（默认）— 现代、友好、略圆润。适合科技产品。
- **Inter** — 中性、易读。非常适合 UI 和正文。
- **Open Sans** — 温暖、易接近。适合企业环境。
- **System Font** — 使用 OS 默认字体（Mac 上 San Francisco，Windows 上 Segoe UI）。加载最快，无需外部字体。

**提示：**

- 如果性能很重要，请使用 **System Font**。
- 为保持品牌一致，匹配 marketing site 使用的字体和 weights。
- 所有字体包含 400、500、600 和 700 weights。

---

### Density

控制界面中的 spacing（padding 和 margin）。

- **Compact** (0.75x) — 减少 spacing。每屏显示更多数据。适合管理大量项目的团队。
- **Default** (1x) — 平衡 spacing。标准 Afenda 体验。
- **Comfortable** (1.25x) — 增加 spacing。更利于 accessibility 和可读性。

**提示：**

- Compact 适合数据密集的 admin dashboards 或大型团队视图。
- Comfortable 更适合专注个人发展的 members。
- 每个 tenant 只能设置一个 density；个人用户不能覆盖。

---

### Surface Style

控制 cards、panels 和 containers 的视觉深度与 elevation。

- **Flat** — 无 shadows，视觉分隔最少。干净、极简。
- **Elevated**（默认）— 细微 shadows 和深度提示。更容易扫视。
- **Glass**（Glassmorphism）— 带 blur 和透明度的磨砂玻璃效果。现代且醒目。

**提示：**

- **Flat** 适合高密度、数据导向界面。
- **Elevated** 是审美和可用性平衡的安全默认值。
- **Glass** 现代且有视觉冲击；请在 dark mode 中测试以确保可读。

---

### Neutral Warmth

微调中性色（灰色和边框）的 undertone。

- **Cool** — 带蓝色 undertone 的灰色。感觉清新、技术化。
- **Neutral**（默认）— 纯灰，无冷暖。灵活、现代。
- **Warm** — 带暖色（橙/棕）undertone 的灰色。感觉友好、易接近。

**提示：**

- 让中性色 warmth 与 Primary Color 匹配，保持视觉和谐。
- Cool 适合蓝色、teal、紫色。
- Warm 适合橙色、红色、棕色。
- Neutral 对企业环境最安全。

---

## Logo 和组织身份

除颜色和 typography 外：

- **Tenant name** — 组织名称，显示在 headers 和 footers。
- **Logo** — 如果可用，上传组织 logo，用于 header 和登录页。
- **Favicon** — 浏览器标签页中的小图标。
- **Email template colors** — 平台发送的 emails 可以使用品牌色。

---

## 预览和实时测试

保存前，使用 Branding 设置中的 **preview panel**：

1. 查看颜色应用到 buttons、cards 和 UI elements 的效果
2. 在 light 和 dark mode 间切换
3. 检查文本对比度和可读性

**始终测试：**

- Light mode 和 dark mode
- 不同屏幕尺寸（desktop、tablet、mobile）
- 团队内部反馈（找几位用户试用）

---

## 最佳实践

### 一致性

- 如果可能，匹配 marketing site 的颜色和字体。
- 在 Afenda、email templates 和 integrations 中使用一致 branding。

### Accessibility

- 始终保持良好对比度（WCAG AA 或 AAA）。
- 选色时使用 Afenda 内置对比验证器。
- 不要只依赖颜色表达含义；例如状态应使用 icon + color。

### 性能

- 避免过多 custom fonts；保持 1–2 个 font families。
- System Font 加载最快；custom fonts 可能增加 50–200ms 页面加载时间。
- 对大多数用户而言，视觉差异很小。

### Dark Mode

- 在 dark mode 中测试所有颜色。
- Glass surfaces 可能需要调整才能在深色背景中保持可读。
- 确保 Primary Color 在深色背景上足够明亮。

### Mobile

- Density 和 surface style 对 mobile usability 影响很大。
- 在真实手机或 tablet 上测试，而不只是 browser devtools。
- 小屏幕通常更适合 Comfortable spacing 和 Elevated surface style。

---

## 重置为默认值

如果想重新开始：

1. 进入 **Settings** → **Branding**
2. 点击 **Reset to Defaults**（如果可用）
3. 确认

这会将所有颜色、字体、density 和 surface styles 恢复为 Afenda 默认值。Tenant name 和 logo 不会改变。

---

## Troubleshooting

**保存后颜色没有变化：**

- Refresh 页面或清除浏览器缓存（Mac 上 Cmd+Shift+R，Windows 上 Ctrl+Shift+R）。
- 检查网络连接。
- 如果问题仍存在，联系 Afenda support。

**Custom font 没有显示：**

- 如果在企业代理后面，某些浏览器会阻止外部字体。
- 尝试使用 System Font 作为替代。
- 如果使用 custom fonts，请让 IT allowlist `fonts.googleapis.com` 或 `fonts.gstatic.com`。

**文本对比度警告 — 应该怎么办？**

- 内置 validator 会建议更亮或更暗的色阶。
- 你可以接受建议或手动调整。
- WCAG AA (4.5:1) 是最低法律标准；AAA (7:1) 对 accessibility 更好。

**Dark mode 和 light mode 看起来不同：**

- 这是正常现象；背景亮度会改变色彩感知。
- 为两种模式调整颜色，或寻求设计帮助。

---

## 下一步

- **探索其他设置** → [Settings 概览](./settings)
- **添加 integrations** → [Integrations 指南](./integrations)
- **管理成员和 roles** → [Members & Invitations](./members-invitations)
- **需要更多设计指导？** → 联系你的 Afenda designer 或 <support@example.com>

你的品牌很重要。请花时间把颜色和 typography 调整到位，因为这是人们每天在 Afenda 中最先看到的内容之一。
