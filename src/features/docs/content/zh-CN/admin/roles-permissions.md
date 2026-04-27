---
title: 角色与权限
description: >-
  系统 roles（Member、Manager、Admin、1:1er、Referente）、custom roles、分配 permissions 和 PBAC 模型。
section: admin
order: 7
translation:
  sourceLocale: en
  sourcePath: admin/roles-permissions.md
  sourceHash: 0bb60719f481aebb47995e2a6ec9ca8221a294d4f201c60a0dbf36e9cc6c8f90
  status: reviewed
---

# 角色与权限

Afenda 使用 **permission-based** 模型（PBAC）：访问由 **permissions** 决定，而不是由职位决定。**Roles** 是 permissions 的集合；一个人在每个 tenant 中可以有**多个 role**，有效 permissions 是所有 role permissions 的**并集**。

## 系统角色

这些 role 通常在每个 tenant 中可用：

| Role          | 常见用途                           | 主要 permissions（示例）                                                                                                                         |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Member**    | 大多数用户的默认 role              | profile, self_assess, knowledge, assistant                                                                                                       |
| **Manager**   | 有 direct reports 的人员           | member + team, reports, manager:dashboard, manager:team, manager:assignments, manager:performance_assessments, manager:okrs 等                   |
| **Admin**     | 完整 tenant 配置                   | manager + 所有 admin:_，通常还包括所有 one_on_one:_                                                                                              |
| **1:1er**     | 1:1 facilitators，不一定是 manager | member + one_on_one:dashboard, one_on_one:meetings, one_on_one:feedback, one_on_one:performance_read, one_on_one:projects_read, one_on_one:notes |
| **Referente** | 分配学习内容的主题专家             | member + instructor:assign_learning（可向 tenant 中任何人分配学习）                                                                              |

**Manager** 和 **1:1er** 是**独立的**：1:1 facilitator 不一定是对方 manager。Permissions 定义你能做什么；person relations（manager、one_to_one）定义你和谁相关。

## 自定义角色

如果 tenant 启用了 **custom roles**（feature flag `allowCustomRoles`）：

1. 进入 **Admin** → **Roles & Permissions**。
2. 点击 **Create role** 或 **Add role**。
3. 输入 **name** 和可选 **description**。
4. **分配 permissions** — 选择该 role 应授予的 permissions，例如只包含 one_on_one:meetings 和 one_on_one:notes 的 "Mentor" role。
5. 保存。新 role 会出现在 role 列表中，并可分配给 members 和 invitations。

当 custom roles **disabled** 时，只存在系统 roles；"Create role" 按钮会隐藏，但你仍可编辑现有 roles 的 permissions。

## 给角色分配权限

- 打开 **Admin** → **Roles & Permissions**，并选择一个系统或 custom **role**。
- 你会看到 **permissions** 列表，通常按 profile、manager、one_on_one、admin 等分类。
- **Check** 该 role 应授予的 permissions。保存。
- 拥有此 role 的任何人（单独或与其他 role 一起）都会获得所有 role permissions 的并集。

> **提示：** 优先授予该 role 所需的最小 permissions。之后可以随时增加；避免向大范围群体授予 admin permissions。

## 给成员分配角色

- 进入 **Admin** → **Members** 并打开某个 member。
- **Roles** — 选择一个或多个 role。member 的有效 permissions 是所有所选 roles 的并集。
- 保存。更改会在下一次 request 生效；member 可能需要 refresh 或重新登录才能看到更新后的菜单和访问权限。

## PBAC 模型摘要

| 概念              | 含义                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Permission**    | 单个权限，例如 `manager:dashboard`、`admin:skills`。授权检查使用 permission keys。                                    |
| **Role**          | 命名的 permissions 集合。用于方便和清晰。                                                                             |
| **Member**        | 每个 tenant 可拥有**多个 role**。有效 permissions = 所有 role permissions 的并集。                                    |
| **Authorization** | 始终按 permission 判断："Can this user do X?" → 检查 `hasPermission(tenant, permissionKey)`。不要只按 role 名称判断。 |

Admins 在 Admin → Roles & Permissions 中管理 **roles** 和 **permissions**；他们将 **roles** 分配给 members 和 invitations。系统始终通过数据库中的 **permissions** 解析访问。
