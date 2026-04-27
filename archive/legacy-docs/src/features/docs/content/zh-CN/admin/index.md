---
title: Admin 指南概览
description: 'Admin 职责、dashboard 和 admin permissions。'
section: admin
order: 1
translation:
  sourceLocale: en
  sourcePath: admin/index.md
  sourceHash: e1bb454f189f18e6c36ce9e55834c897f228d94eae9953fcd6a02b62702ce510
  status: reviewed
---

# Admin 指南概览

**Admins** 为组织配置平台：成员、角色、设置、集成等。本指南说明 admin 能做什么以及如何访问 Admin 区域。

## Admin 职责

| 区域                      | Admin 做什么                                         |
| ------------------------- | ---------------------------------------------------- |
| **Members & Invitations** | 添加和移除成员，生成带 role 的邀请链接，管理成员状态 |
| **角色与权限**            | 管理系统和自定义角色；分配权限；配置 PBAC            |
| **设置**                  | 功能开关、品牌（颜色、排版）、AI 提供商配置、存储    |
| **集成**                  | 配置 Webhooks、外部系统同步、OAuth 和数据映射        |

## 管理员仪表盘

**管理员仪表盘** 是打开 Admin 区域时的首页。它通常显示：

- **Tenant overview** — 名称、成员数量、关键配置摘要
- 到成员、设置和其他管理员区域的**快速链接**
- **近期活动或提醒** — 例如待处理邀请或需要关注的事项

每次在 Admin 中工作时，可把它作为起点。

## Admin 权限

访问 admin 功能基于 **permissions**（PBAC）。Admins 拥有如下权限：

| Permission category   | 示例                                                |
| --------------------- | --------------------------------------------------- |
| **仪表盘**            | `admin:dashboard` — 查看管理员区域                  |
| **Members & invites** | `admin:members`, `admin:invites` — 管理成员和邀请   |
| **系统**              | `admin:roles` — 角色与权限；`admin:settings` — 设置 |
| **集成和数据**        | 集成和 webhooks 配置                                |

你只会看到拥有对应 permission 的菜单项和页面。如果看不到某项，请让 senior admin 分配正确 role 或 permission。

## 访问 Admin 区域

1. 登录并打开主导航。
2. 进入 **Admin**（或 tenant 的等效标签）。
3. 你会进入管理员仪表盘。使用侧边栏打开成员、设置和其他区域。

只有拥有至少一个 admin permission（例如 `admin:dashboard`）的用户才能看到 Admin 区域。

## 快速链接

- [成员与邀请](/docs/admin/members-invitations)
- [角色与权限](/docs/admin/roles-permissions)
- [设置](/docs/admin/settings)
- [集成](/docs/admin/integrations)

> **提示：** 从成员与邀请和设置开始，确保 tenant 和人员设置正确。
