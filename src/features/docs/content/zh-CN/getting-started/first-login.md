---
title: 首次登录
description: >-
  如何使用 Auth0（SSO 或 email）登录 Afenda、选择 tenant，并完成第一次访问时的初始了解。
section: getting-started
order: 2
translation:
  sourceLocale: en
  sourcePath: getting-started/first-login.md
  sourceHash: 6ee7a4d16fdbb83bbd8ef983b625dcfb52a74cadc56759dad40ad75f47e1a21c
  status: reviewed
---

# 首次登录

本指南说明如何第一次登录 Afenda、选择组织（tenant），并充分利用第一次 dashboard 体验。

---

## 使用 Auth0 登录

Afenda 使用 **Auth0** 进行身份验证。你可以通过以下方式登录：

- **Single sign-on (SSO)** — 如果组织使用 SSO（例如 Google Workspace、Microsoft Azure AD），请选择 admin 提供的登录方式。你可能会被重定向到公司登录页。
- **Email 和密码** — 如果 tenant 允许，你可以使用 email 注册或登录。
- **社交或企业连接** — 根据 tenant 配置，可能提供 Google、GitHub 或 LinkedIn 等选项。

### 登录步骤

1. 打开组织提供的 Afenda URL，例如 `https://your-tenant.afenda.app` 或公司自定义域名。
2. 点击 **Sign in** 或 **Log in**。
3. 选择可用的登录方式（SSO、email 或 social）。
4. 完成 Auth0 流程：输入凭据，并在需要时通过 MFA。
5. 验证完成后，你会被重定向回 Afenda。

> **提示：** 如果没有看到预期的登录选项，tenant 可能只启用了 SSO 或特定连接。请联系 Afenda admin 或 IT 获取正确登录方式。

---

## 选择 tenant（多个组织）

如果你在 Afenda 中属于**多个组织**（tenant），登录后必须选择要使用的组织。

- 你可能会看到 **tenant switcher** 或列出组织的 tenant 选择页面。
- 选择要工作的 tenant。应用会加载该 tenant 的数据：成员、技能、项目和设置。
- 之后可以从应用 header 或账户菜单切换 tenant，无需登出。

如果你只有一个 tenant，这一步可能会被跳过并直接进入 dashboard。

---

## 第一次 dashboard 体验

登录并选择 tenant 后，你会进入 **dashboard**。看到的内容取决于角色：

- **Members** 会看到 **My View**：个人 dashboard，包含到 profile、skills、OKRs、learning、performance 等的快速链接。
- **Managers** 可能还会看到 **Manager View**：团队概览、报告和 manager 专属操作。
- **1:1 Facilitators** 可以打开 **1:1 View**：他们负责 1:1 的人员列表以及相关会议。
- **Admins** 可以访问 **Admin View**：配置、成员、技能和 tenant 设置。

首次登录时，你可能会看到：

- 在完成 profile setup 并开始使用功能之前，一些空状态或 placeholder 区块。
- tenant 启用的 onboarding 提示或 tooltip。
- 通知或任务，例如 “Complete your profile” 或 “Set your first OKR”。

> **提示：** 花几分钟完成 [个人资料设置](/docs/zh-CN/getting-started/profile-setup)，确保姓名、职称和偏好正确。然后阅读 [导航与视图](/docs/zh-CN/getting-started/navigation)，了解各项功能的位置。

---

## 入门建议

1. **完成 profile** — 添加姓名、职称、bio、timezone，以及可选的 GitHub/LinkedIn。这有助于同事在 People Finder 中找到你，并改善 AI 建议。
2. **选择 view** — 使用 sidebar 或 view switcher 在 My View、Manager View、1:1 View 和 Admin View 之间切换（如果有权限）。每个 view 都有自己的菜单。
3. **使用全局搜索** — 按 **Cmd+K**（Mac）或 **Ctrl+K**（Windows/Linux）搜索人员、docs 和 actions。
4. **设置语言和主题** — 如果 tenant 支持，可用 locale switcher 设置语言，用 theme toggle 切换 light/dark mode。
5. **收藏 docs** — 保留 [欢迎使用 Afenda](/docs/zh-CN/getting-started) 和按角色划分的指南，便于探索时查阅。

如果遇到登录问题，例如 tenant 错误、缺少 SSO 或账户锁定，请联系你的 **Afenda administrator** 或组织 IT 支持。

---

## 安全和会话

- **会话时长** — 保持登录的时间取决于 tenant 的 Auth0 和 Afenda 设置。长时间无操作或到达固定时间后，可能需要重新登录。
- **登出** — 使用账户菜单（header 中的头像或姓名）并选择 **Sign out** 或 **Log out**。之后访问 Afenda 需要重新登录。
- **多设备** — 你可以在多个设备上使用 Afenda。每个会话遵循相同的安全和 timeout 规则。使用共享设备后请登出。
- **密码和 MFA** — 密码更改和多因素认证由 Auth0 或 SSO provider 管理。如需重置密码或更新 MFA，请使用登录页链接，或联系 IT/admin Afenda。
