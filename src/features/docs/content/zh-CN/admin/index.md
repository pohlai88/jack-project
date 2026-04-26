---
title: Admin 指南概览
description: 'Admin 职责、dashboard 和 admin permissions。'
section: admin
order: 1
translation:
  sourceLocale: en
  sourcePath: admin/index.md
  sourceHash: aaede5bb4288e92321874f98c507c2f1a574719b749ae94f1c772c13e83214a1
  status: reviewed
---

# Admin 指南概览

**Admins** 为组织配置平台：成员、角色、设置、集成等。本指南说明 admin 能做什么以及如何访问 Admin 区域。

## Admin 职责

| 区域                      | Admin 做什么                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| **Members & Invitations** | 添加和移除成员，生成带 role 的邀请链接，管理成员状态                   |
| **Roles & Permissions**   | 管理系统和自定义 role；分配 permissions；配置 PBAC                     |
| **Settings**              | Feature flags、branding（颜色、typography）、AI provider 配置、storage |
| **Integrations**          | 配置 Webhooks、外部系统 sync、OAuth 和 data mapping                    |

## Admin Dashboard

**Admin Dashboard** 是打开 Admin 区域时的首页。它通常显示：

- **Tenant overview** — 名称、成员数量、关键配置摘要
- 到 Members、Settings 和其他 admin 区域的**快速链接**
- **近期活动或提醒** — 例如待处理邀请或需要关注的事项

每次在 Admin 中工作时，可把它作为起点。

## Admin 权限

访问 admin 功能基于 **permissions**（PBAC）。Admins 拥有如下权限：

| Permission category     | 示例                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| **Dashboard**           | `admin:dashboard` — 查看 admin 区域                              |
| **Members & invites**   | `admin:members`, `admin:invites` — 管理成员和邀请                |
| **System**              | `admin:roles` — Roles & permissions；`admin:settings` — Settings |
| **Integrations & data** | Integrations 和 webhooks 配置                                    |

你只会看到拥有对应 permission 的菜单项和页面。如果看不到某项，请让 senior admin 分配正确 role 或 permission。

## 访问 Admin 区域

1. 登录并打开主导航。
2. 进入 **Admin**（或 tenant 的等效标签）。
3. 你会进入 Admin Dashboard。使用 sidebar 打开 Members、Settings 和其他区域。

只有拥有至少一个 admin permission（例如 `admin:dashboard`）的用户才能看到 Admin 区域。

## 快速链接

- [Members & Invitations](/docs/zh-CN/admin/members-invitations)
- [Roles & Permissions](/docs/zh-CN/admin/roles-permissions)
- [Settings](/docs/zh-CN/admin/settings)
- [Integrations](/docs/zh-CN/admin/integrations)

> **提示：** 从 Members & Invitations 和 Settings 开始，确保 tenant 和人员设置正确。
