---
title: 设置
description: >-
  功能开关、品牌（logo、颜色）、AI 提供商配置、技能等级、技能分类和存储设置。
section: admin
order: 8
translation:
  sourceLocale: en
  sourcePath: admin/settings.md
  sourceHash: 927d9e3e42daa45b5606256f9e0874394ca525773f8480b0190a1f1ebff642df
  status: reviewed
---

# 设置

管理员在 **Admin** → **Settings** 中配置**整个租户的设置**：功能开关、品牌、AI 提供商、技能等级、分类和存储。这些设置会影响 tenant 中所有人的平台外观和行为。

## 功能开关

**功能开关** 可以在不部署代码的情况下为 tenant 打开或关闭功能。

| 常见开关                      | 控制内容                                                 |
| ----------------------------- | -------------------------------------------------------- |
| **allowCustomRoles**          | 开启时：管理员可创建自定义角色。关闭时：只存在系统角色。 |
| **OKRs**                      | 为 tenant 启用或隐藏 OKR 功能（objectives、check-ins）。 |
| **Recognitions**              | 启用或隐藏 recognition/praise 功能。                     |
| **Integrations**              | 启用特定集成，例如 GitHub、Slack。                       |
| **CV upload / onboarding**    | 启用 AI 驱动的 CV 处理和 onboarding 技能提取。           |
| **People Finder / AI search** | 启用自然语言和基于 capability 的搜索。                   |

按 rollout 或合规需要切换 flags。更改保存后生效；用户可能需要 refresh。

## 品牌

- **Logo** — 上传或设置 tenant logo，用于 header 和 login/shell。推荐格式和尺寸通常会在 UI 中说明。
- **颜色** — 用于按钮、链接和强调色的 primary 以及可选 secondary colors。使用组织品牌色保持一致。

> **提示：** 使用高对比 logo 和颜色，确保界面保持可访问。

## AI 提供商配置

如果 tenant 使用 **AI 功能**，例如 People Finder、CV extraction 或 AI assistant：

- **Provider** — 例如 OpenAI、Azure OpenAI 或其他已配置 provider。
- **Model** — 用于 embeddings 和/或 chat 的 model，例如 search 与 assistant 使用不同模型。
- **API key / endpoint** — 安全存储；admins 在 Settings 中设置或轮换 keys。保存后不会完整显示 keys。

请查看 provider 文档了解 rate limits 和成本。更改 model 或 key 可能需要 restart 或 cache clear 才能影响某些功能。

## 技能等级（1–5 级）

技能等级通常定义在一个 **scale** 上，例如 1–5。在 Settings 中，你可以：

- **设置等级** — 例如 1 = Beginner，5 = Expert。每级标签可能可编辑。
- **一致使用** — 同一等级体系 适用于 self-assessments、capabilities（minimum level）和 reporting。只有在准备好对齐历史数据或接受一次性 migration 时才更改。

## 技能分类

- **分类**对目录中的技能分组，例如 "Technical"、"Leadership"。你可以在 Settings 或 Skills Management 中创建、重命名、重排或 archive categories。
- 分类帮助在管理员和成员界面中筛选技能。保持列表简洁。

## 存储设置

根据部署方式，Settings 可能包括：

- **文件存储** — 上传文件（如 CV、avatar、attachments）的存储位置，例如 S3 或 local。Admins 可设置 bucket、region 或 paths。
- **Limits** — 最大文件大小、允许类型或 retention。按政策配置。

## 分步：更改品牌和功能开关

1. 进入 **Admin** → **Settings**。
2. **Branding** — 上传新 logo 并设置 primary color。保存。
3. **功能开关** — 找到某个 flag，例如 "Recognitions"，然后打开或关闭。保存。
4. 刷新应用并确认 logo/colors 和功能可见性，例如 Recognition 菜单出现或消失。
