---
title: Integrations
description: >-
  GitHub、LinkedIn、Slack、Google Workspace、GitLab、webhooks — OAuth 设置、sync 和 data mapping。
section: admin
order: 9
translation:
  sourceLocale: en
  sourcePath: admin/integrations.md
  sourceHash: e8edc889c34742728c4a5b07f82ca54c7f7713313210bf18613d2a5101b6192b
  status: reviewed
---

# Integrations

Afenda 可以连接外部系统，以同步人员、skills 或活动并丰富 profile。Admins 配置 **integrations**（OAuth、API keys、webhooks）和 **data mapping**，确保数据正确流入和流出。

## 支持的 integrations（概览）

| Integration          | Status    | 典型用途                                                         |
| -------------------- | --------- | ---------------------------------------------------------------- |
| **GitHub**           | ✅ Active | 将 profile 连接到 GitHub；从 code 同步 repos、activity 或 skills |
| **Webhooks**         | ✅ Active | Outbound events（例如 person updated、assessment submitted）     |
| **LinkedIn**         | 🔜 Soon   | 从 LinkedIn 导入 profile 或 skills                               |
| **Slack**            | 🔜 Soon   | 通知、bot 或 identity linking                                    |
| **Google Workspace** | 🔜 Soon   | 身份、calendar 或 directory sync                                 |
| **GitLab**           | 🔜 Soon   | 类似 GitHub — repos、activity、skills                            |

使用 **Admin** → **Integrations** 查看哪些已启用。

## GitHub Integration（Active）

GitHub 是主要的 active integration。配置后：

1. 在 GitHub → Developer Settings 中**创建 OAuth App**。获取 **Client ID** 和 **Client Secret**。
2. **设置 redirect URI** — 使用 Admin → Integrations → GitHub 中显示的 URL，例如 `https://your-tenant.app/api/auth/callback/github`。
3. 在 **Admin** → **Integrations** → **GitHub** 中输入 credentials 并保存。
4. Members 可以从 profile settings 连接自己的 GitHub 账户。

每次 sync 时，Afenda 会在 person profile 上**自动创建 evidence record**，显示扫描的 repos、发现的 languages、推断的 skills 和 contributions。

## Webhooks（Active — Outbound）

**Webhooks** 将 Afenda 事件发送到你的系统，例如 "person created"、"assessment submitted"：

1. **Admin** → **Integrations** → **Webhooks**。
2. **Add webhook** — URL、用于签名 payload 的可选 secret，以及要订阅的 **event types**。
3. 保存。Afenda 会在每个选定事件发生时向你的 URL POST JSON payload。请实现 idempotency 并验证 signature。

## 即将推出 integrations 的 OAuth 设置

对于使用 **OAuth** 的 integrations（LinkedIn、Slack、Google Workspace、GitLab）：

1. 在 provider 的 developer portal 中**创建 app**。获取 **Client ID** 和 **Client Secret**。
2. **设置 redirect URI** — 使用 Afenda 提供的 URL。必须完全匹配。
3. 在 **Admin** → **Integrations** 中选择 integration 并输入 credentials。
4. Members 通过 provider consent screen 授权。

> **提示：** 每个环境（dev 与 prod）使用独立 OAuth app；如 secrets 暴露，请轮换。

## Semantic Search 和 Embeddings

Integration sync 会贡献到 **semantic search**（People Finder、AI Assistant）：

- 来自 GitHub sync 的**新 skills** 会生成 embeddings 用于 skill search。
- **更新后的 profiles** 会重新生成 embedding，保持 People Finder 最新。
- **Bulk imports**（skills、capabilities、persons）也会自动生成 embeddings。
