---
title: Settings
description: >-
  Feature flags、branding（logo、颜色）、AI provider 配置、skill scales、skill categories 和 storage settings。
section: admin
order: 8
translation:
  sourceLocale: en
  sourcePath: admin/settings.md
  sourceHash: 9123c79045347ac2ad12805a11858bc83018d8a4af41fd0f9ff562409f52beb6
  status: reviewed
---

# Settings

Admins 在 **Admin** → **Settings** 中配置**整个 tenant 的设置**：feature flags、branding、AI provider、skill scales、categories 和 storage。这些设置会影响 tenant 中所有人的平台外观和行为。

## Feature Flags

**Feature flags** 可以在不部署代码的情况下为 tenant 打开或关闭功能。

| 常见 flags                    | 控制内容                                                      |
| ----------------------------- | ------------------------------------------------------------- |
| **allowCustomRoles**          | 开启时：admin 可创建 custom roles。关闭时：只存在系统 roles。 |
| **OKRs**                      | 为 tenant 启用或隐藏 OKR 功能（objectives、check-ins）。      |
| **Recognitions**              | 启用或隐藏 recognition/praise 功能。                          |
| **Integrations**              | 启用特定 integrations，例如 GitHub、Slack。                   |
| **CV upload / onboarding**    | 启用 AI 驱动的 CV 处理和 onboarding 技能提取。                |
| **People Finder / AI search** | 启用自然语言和基于 capability 的搜索。                        |

按 rollout 或合规需要切换 flags。更改保存后生效；用户可能需要 refresh。

## Branding

- **Logo** — 上传或设置 tenant logo，用于 header 和 login/shell。推荐格式和尺寸通常会在 UI 中说明。
- **Colors** — 用于按钮、链接和强调色的 primary 以及可选 secondary colors。使用组织品牌色保持一致。

> **提示：** 使用高对比 logo 和颜色，确保界面保持可访问。

## AI Provider 配置

如果 tenant 使用 **AI 功能**，例如 People Finder、CV extraction 或 AI assistant：

- **Provider** — 例如 OpenAI、Azure OpenAI 或其他已配置 provider。
- **Model** — 用于 embeddings 和/或 chat 的 model，例如 search 与 assistant 使用不同模型。
- **API key / endpoint** — 安全存储；admins 在 Settings 中设置或轮换 keys。保存后不会完整显示 keys。

请查看 provider 文档了解 rate limits 和成本。更改 model 或 key 可能需要 restart 或 cache clear 才能影响某些功能。

## Skill Scales（1–5 级）

Skill levels 通常定义在一个 **scale** 上，例如 1–5。在 Settings 中你可以：

- **设置 scale** — 例如 1 = Beginner，5 = Expert。每级标签可能可编辑。
- **一致使用** — 同一 scale 适用于 self-assessments、capabilities（minimum level）和 reporting。只有在准备好对齐历史数据或接受一次性 migration 时才更改。

## Skill Categories

- **Categories** 对 catalog 中的 skills 分组，例如 "Technical"、"Leadership"。你可以在 Settings 或 Skills Management 中创建、重命名、重排或 archive categories。
- Categories 帮助在 admin 和 member UI 中筛选 skills。保持列表简洁。

## Storage Settings

根据部署方式，Settings 可能包括：

- **File storage** — 上传文件（如 CV、avatar、attachments）的存储位置，例如 S3 或 local。Admins 可设置 bucket、region 或 paths。
- **Limits** — 最大文件大小、允许类型或 retention。按政策配置。

## 分步：更改 branding 和 feature flag

1. 进入 **Admin** → **Settings**。
2. **Branding** — 上传新 logo 并设置 primary color。保存。
3. **Feature flags** — 找到某个 flag，例如 "Recognitions"，然后打开或关闭。保存。
4. refresh 应用并确认 logo/colors 和功能可见性，例如 Recognition 菜单出现或消失。
