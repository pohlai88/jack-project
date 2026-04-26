---
title: 常见问题
description: >-
  关于平台的常见问题 — 密码重置、角色、集成、AI 功能、数据导出和获取帮助。
section: faq
order: 1
translation:
  sourceLocale: en
  sourcePath: faq.md
  sourceHash: 9fbc30698e5d595996822e2151dfd6be72952e7b945c9d128f398812532a383f
  status: reviewed
---

# 常见问题

以下是常见问题的回答。按角色划分的指南请参阅 [Member](/docs/zh-CN/member) 和 [Admin](/docs/zh-CN/admin)。

## 如何重置密码？

- 如果 tenant 使用 **email/password** 登录：使用登录页上的 **Forgot password** 链接。输入 email；你会收到设置新密码的链接。链接可能在短时间后过期，例如 1 小时。
- 如果你使用 **SSO** 登录，例如 Google 或 Microsoft：密码由 identity provider 管理。请使用该 provider 的密码重置流程，例如公司 IT 或 Google 账户恢复。
- 如果没有收到 email：先检查 spam，然后请 **admin** 确认你在 tenant 中的 email 并重新发送重置邮件。

## 角色如何工作？

平台使用 **permissions**，而不是职位。**Roles**（如 Member、Manager、Admin）是 **permissions** 的集合。你能做什么由你拥有的 **permissions** 决定。

- 你可以在一个 tenant 中拥有**多个 role**。有效访问权限是所有 role 中 permissions 的**并集**。
- 只有 **admins** 可以分配或更改 role（Admin → Members）。如果你看不到某个部分，可能没有正确的 role/permissions — 请询问 admin。

> **提示：** 授权始终基于 permission key，例如 `admin:dashboard`、`admin:members`。Role 名称只用于显示和分组。

## 如何连接 integrations？

- **对于 tenant**：**Admins** 在 **Admin** → **Integrations** 中配置 integrations：webhooks、OAuth apps、API keys 和 data mapping。如果某个 integration 不可用，admin 可能需要启用它或添加 credentials。详情见 [Integrations](/docs/zh-CN/admin/integrations)。

## AI 功能如何工作？

平台可以将 AI 用于：

- **AI Assistant** — chat 和建议（如果已启用）。使用 tenant 配置的 AI provider 和 model。
- **Semantic search** — 使用 embeddings 进行基于语义匹配的 AI 搜索。

Admins 在 **Admin** → **Settings** 中设置 **AI provider 和 model**。发送给 provider 的数据取决于具体功能。请查看 tenant 的隐私和数据处理政策。

## 如何导出数据？

- **你自己的数据**：在 **Profile** 或 **Settings** 中查看账户数据导出选项。
- **Admins**：**Admin** → **Settings** 可能提供 analytics 或 audit logs 的导出。

如果没有看到导出选项，可能是你的 role 没有权限，或该功能未启用 — 请询问 admin。

## 如何获得帮助？

- **应用内**：使用 **Help** 或 **Docs** 链接（通常在 header 或 footer 中）打开本文档。
- **你的 admin**：关于访问、roles、invitations 或 tenant 特定行为，请联系 **tenant admin** 或 IT。
- **Support**：如果组织有支持渠道，请用它处理 bug、故障或账户问题。

> **提示：** 收藏 [Docs](/docs/zh-CN)，并使用 sidebar 跳转到你的角色（Member、Admin）获取分步指南。
