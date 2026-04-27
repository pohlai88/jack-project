---
title: 导航与视图
description: >-
  了解四个主要视图（My View、Manager、1:1、Admin）、sidebar 导航、全局搜索、主题和 locale 选项。
section: getting-started
order: 3
translation:
  sourceLocale: en
  sourcePath: getting-started/navigation.md
  sourceHash: 1c56d63a27bfe0ca1cfda7c74d8925da76a898a9a847d10da06548552b005474
  status: reviewed
---

# 导航与视图

Afenda 将产品组织为 **views** 和 **sidebar**。本页说明如何在应用中移动、使用全局搜索，并调整主题和语言。

---

## 四个主要视图

你在应用中看到的内容取决于 **role 和 permissions**。四个 view 是：

| View             | 谁能看到                              | 用途                                                                                                                                        |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **My View**      | 所有人                                | 你的 profile、skills、OKRs、learning、performance、projects、People Finder、Knowledge Base、feedback 和 AI assistant。                      |
| **Manager View** | 拥有 manager 或更高权限的用户         | 团队 dashboard、报告、projects & clients、performance assessments、learning assignments、team OKRs 和 1:1 meeting tools。                   |
| **1:1 View**     | 至少为一人担任 1:1 facilitator 的用户 | 你负责 1:1 的人员列表、他们的会议，以及对其 performance 和 projects 的只读访问。                                                            |
| **Admin View**   | 拥有 admin 权限的用户                 | tenant 配置：members & invitations、skills、capabilities、role profiles、roadmaps、roles & permissions、settings、integrations、analytics。 |

你只会看到有权访问的 view。例如，如果你只是 Member，只会看到 **My View**。如果你是 Manager 也是 1:1 Facilitator，会看到 **My View**、**Manager View** 和 **1:1 View**。

### 切换视图

- 使用 **sidebar**：顶层区块通常对应这些 view，例如 “My”、“Manager”、“1:1”、“Admin”。
- 或使用 header/sidebar 中的 **view switcher** 选择当前 view。sidebar 菜单随后显示该 view 的项目。

---

## 侧边栏导航

**Sidebar** 是在各部分之间移动的主要方式。

- **可折叠** — 你可以将 sidebar 折叠为仅显示图标，以获得更多空间；展开后可查看完整标签。
- **按 view 变化** — 当你切换 view（My / Manager / 1:1 / Admin）时，sidebar 会更新为该 view 相关页面。例如：
  - 在 **My View**：Dashboard、Profile、Skills、OKRs、Learning、Performance、Projects、People Finder、Knowledge Base、Feedback & recognition、AI Assistant 等。
  - 在 **Manager View**：Manager dashboard、Team、Projects & clients、Performance assessments、Learning assignments、Team OKRs、1:1 meetings、Analytics。
  - 在 **1:1 View**：1:1 dashboard、Meetings、Performance & projects（对 1:1 对象只读）。
  - 在 **Admin View**：Members & invitations、Skills、Capabilities、Role profiles、Roadmaps、Roles & permissions、Settings、Integrations、Analytics 等。

点击 sidebar 项即可进入对应页面。当前页面通常会高亮。

> **提示：** 如果没有看到预期的部分，可能是你没有权限，或它位于其他 view。切换 view 后再检查 sidebar。

---

## 全局搜索（Cmd+K / Ctrl+K）

Afenda 提供 **global search**，让你无需层层点击菜单即可跳转到人员、docs 或 actions。

1. 按 **Cmd+K**（Mac）或 **Ctrl+K**（Windows/Linux），或使用 header 中的搜索入口。
2. 输入查询，例如人员姓名、doc 标题或 “Create OKR” 这样的 action。
3. 用键盘或鼠标选择结果。你会进入相应页面或动作。

熟悉应用后，全局搜索尤其有用；可快速打开 profile、docs 或常用任务。

---

## 主题切换（浅色 / 深色）

如果 tenant 允许，你可以在 **light** 和 **dark** 主题之间切换。

- 在 header、sidebar footer 或 profile/settings 中寻找 **theme toggle**，例如太阳/月亮图标。
- 你的选择通常会被保存，下一次登录时仍使用相同主题。

toggle 的位置可能因 layout 而不同；如果没有看到，请检查顶部栏或 **Profile / Settings** 区域。

---

## 语言切换器

Afenda 可使用多种语言，例如 **English**、**Español**、**Tiếng Việt**、**Bahasa Melayu** 和 **简体中文**。

- 使用 header 或账户菜单中的 **locale switcher**，通常是地球图标或语言代码控件。
- 选择偏好的语言。UI 和可用文档会切换到对应 locale。
- 该设置通常会在下次访问时保留。

> **提示：** 文档可能提供所选语言版本。切换语言后，文档内容和侧边栏应更新，而 URL 保持不带语言前缀，例如 `/docs/getting-started`。

---

## 组合使用

1. 从 sidebar 或 view switcher **选择 view**（My / Manager / 1:1 / Admin）。
2. **使用 sidebar** 打开所需部分；需要更多屏幕空间时可折叠。
3. **使用 Cmd+K 或 Ctrl+K** 搜索并跳转到人员、docs 或 actions。
4. 通过 header 或 settings **设置主题和语言**，让应用符合你的偏好。

下一步，请完成 [个人资料设置](/docs/getting-started/profile-setup)，确保你的身份和偏好在整个平台中正确配置。
