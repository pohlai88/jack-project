---
title: 欢迎使用 Afenda
description: >-
  平台概览 — 支持 AI 助手、RBAC 和集成能力的多租户 SaaS。核心概念、用户角色和指南快速入口。
section: getting-started
order: 1
translation:
  sourceLocale: en
  sourcePath: getting-started.md
  sourceHash: 3c0b66627c5bea0f3e7df5a05baa432cbb8e9773c0e3ccf03124ec7b898a40fe
  status: reviewed
---

# 欢迎使用 Afenda

Afenda 是一个内置 AI 助手、基于角色的访问控制和集成能力的**多租户 SaaS starter**。它帮助团队协作、管理成员并使用 AI，同时保持正确的租户隔离和权限控制。

本指南介绍平台、核心概念、用户角色以及下一步可以阅读的内容。

---

## 平台能做什么

该模板提供三个基础能力：

- **多租户组织** — 每个 tenant（组织）都有自己的成员、角色、部门和设置。不同 tenant 之间的数据完全隔离。
- **AI 驱动的辅助** — 应用内 AI assistant 可以回答问题、按语义搜索内容并提供建议。可按 tenant 配置。
- **集成和自动化** — Webhooks、同步引擎和外部系统连接，用于构建符合你需求的工作流。

> **提示：** 这是一个**基于 tenant** 的平台。你的组织（tenant）拥有自己的成员、配置和数据。如果你属于多个组织，可以在应用内切换。

---

## 核心概念

| 概念        | 含义                                                         |
| ----------- | ------------------------------------------------------------ |
| **Tenant**  | 你的组织。每个 tenant 都有自己的成员、角色和配置。           |
| **Person**  | tenant 内的成员 — 包含个人资料、部门和关系信息。             |
| **Role**    | 定义权限：你能看到什么、能做什么（member、manager、admin）。 |
| **AI 助手** | 应用内对话式 AI，用于提问、搜索和获取指导。                  |
| **集成**    | 通过 webhooks 和同步引擎连接外部系统。                       |

理解这些概念有助于阅读 Member 和 Admin 指南。

---

## 用户角色

你的体验取决于你在 tenant 中的 **role** 和权限。Role 不等同于职位；它定义你可以看到和执行的操作。

| Role        | 适用对象      | 你可以获得的内容                                   |
| ----------- | ------------- | -------------------------------------------------- |
| **Member**  | 所有人        | 个人资料、dashboard、AI assistant 和共享资源访问。 |
| **Manager** | 管理团队的人  | Member 的全部能力，加上团队可见性和管理能力。      |
| **Admin**   | tenant 管理员 | 完整访问：成员、邀请、角色、权限、设置和集成。     |

---

## 指南快速入口

根据你的角色，从这里开始：

- **第一次使用平台？** → [首次登录](/docs/getting-started/first-login) 和 [导航](/docs/getting-started/navigation)。
- **设置个人资料** → [个人资料设置](/docs/getting-started/profile-setup)。
- **Member** → Member 指南：dashboard、个人资料设置和 AI assistant。
- **Admin** → Admin 指南：成员、角色、设置和集成。

使用**文档侧边栏**或**搜索**跳转到任意主题。

---

## 交互组件

平台使用一致的设计系统。下面是可用按钮变体的实时预览：

```preview
component: ButtonVariants
props: {}
```

---

## 为什么使用这个模板？

该模板旨在作为 SaaS 的稳固基础：

- **从第一天开始支持多租户** — 正确的数据隔离、按 tenant 配置以及可扩展架构。
- **AI-native** — AI assistant 基础设施已准备好支持你的领域用例。
- **正确的权限模型** — 细粒度 RBAC，而不只是检查角色。
- **集成就绪** — Webhook 和同步引擎基础设施可连接外部系统。

如有反馈或问题，请使用 tenant 的常规支持渠道，或联系你的 admin。
