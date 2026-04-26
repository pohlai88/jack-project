---
title: 成员和邀请
description: >-
  添加和移除成员，生成带 role 的邀请链接，管理成员状态和邀请过期时间。
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/members-invitations.md
  sourceHash: e23b8e807ebca8e8f590e0c022a1bb1a1e94c0e142b775591c9fb57ec8469305
  status: reviewed
---

# 成员和邀请

Admins 管理 **谁在 tenant 中** 以及 **他们如何加入**。你可以直接添加成员、发送带指定 role 的邀请，并控制邀请过期时间和成员状态。

## 添加成员

添加成员主要有两种方式：

1. **Invitation** — 发送邀请链接或 email；对方接受后会以你选择的 role 加入。
2. **Direct add / import** — 你直接创建 membership，例如 bulk import 或 SSO 之后。该成员可能仍需完成 profile setup。

### 发送邀请

1. 进入 **Admin** → **Members**（或 **Invitations**）。
2. 点击 **Invite member** 或 **Create invitation**。
3. **输入 email**，并可选输入姓名。
4. **选择 role** — 选择对方接受邀请后拥有的 role，例如 Member、Manager、1:1er。这会设置初始权限。
5. **设置 expiration**（如果 tenant 支持）— 例如 7 或 30 天。之后链接可能失效，需要重新发送。
6. 生成链接或发送 email。将邀请链接分享给对方；如果已配置 email，对方会通过 email 收到。

> **提示：** 使用与对方工作匹配的 role：大多数人为 “Member”，只有需要相应权限时才使用 “Manager” 或 “1:1er”。

## 邀请链接和 role

- **Invite link** — 唯一 URL；打开并登录或注册后，会使用你选择的 **role(s)** 创建或更新该人在 tenant 中的 membership。
- **Roles** — 来自 tenant 的 roles，包括 Member、Manager、Admin、1:1er、Referente 等系统 role，以及任何 custom role。邀请存储所选 **role ID**；接受后，该 role 会分配到 `tenant_membership_roles`。

一个人加入后可以拥有**多个 role**；你可以之后在 Members 列表中修改。

## 管理成员状态

从 **Members** 列表中，你可以：

- **查看** 所有 tenant 成员、role 和状态（如 active、inactive，如果 tenant 支持）。
- **编辑 roles** — 为成员添加或移除 role。有效 permissions 是所有 role 的并集。
- **Deactivate 或 remove** — 根据 tenant 配置，你可以停用成员（失去访问权限）或将其从 tenant 移除。

role 更改会在下一次 request 生效；成员可能需要 refresh 或重新登录才能看到更新后的菜单和权限。

## 邀请过期

如果启用 **invite expiration**：

- 每个邀请都有 **valid until** 日期。过期后，链接可能显示错误或要求新邀请。
- 如果邀请过期，可以从 Invitations 列表 **resend** 或 **regenerate**。
- 较短过期时间（如 7 天）更安全；较长时间（如 30 天）更方便 onboarding。

## 分步：邀请新团队成员

1. 进入 **Admin** → **Members** → **Invitations**，或使用 **Invite member**。
2. 输入对方 **email** 并选择 **role(s)**，例如 Member。
3. 如需，设置 **expiration**。
4. 点击 **Send** 或 **Generate link**。如果需要手动分享，请复制链接。
5. 对方打开链接、登录或注册并接受。他们现在成为拥有所选 role(s) 的 member。
6. 可选进入 **Members**，找到该成员并添加更多 role，例如 1:1er，或按需调整。

> **提示：** 留意 Invitations 列表中的待处理或已过期邀请，必要时重新发送或延长，避免新成员被阻塞。
