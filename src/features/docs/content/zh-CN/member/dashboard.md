---
title: Dashboard
description: '面向 member 的统计卡片、快速操作和活动摘要。'
section: member
order: 2
translation:
  sourceLocale: en
  sourcePath: member/dashboard.md
  sourceHash: fe612192563f7cb90cc88ff67f8574ee9e50d4b7a62559a7c79408e21e5ff72e
  status: reviewed
---

# Dashboard

Dashboard 是你的主要入口。它显示关键统计、快速操作和近期活动，帮助你掌握重要事项。

## 统计卡片

在 Dashboard 顶部，你会看到显示 tenant 相关关键指标的摘要卡片。这些卡片提供你的活动和待处理事项的快速概览。

> **提示：** 点击卡片可跳转到相关部分。

统计卡片示例如下：

```preview
component: StatCard
props: { "value": 12, "label": "Team members" }
```

## 快速操作

快速操作让你无需离开 Dashboard 即可开始常见任务：

- 查看团队成员
- 打开 **AI Assistant** 提问
- 如果你有权限，进入 admin settings

使用这些入口可以快速访问最常见的工作流。

## Activity feed

Activity feed 显示与你相关的近期事件，例如：

- 新成员加入 tenant
- 配置更改
- 系统通知

滚动可查看更多。用它了解变更和需要跟进的事项。

### 更好地使用 Dashboard

1. **查看统计** — 快速浏览关键指标，了解当前状态。
2. **使用快速操作** — 无需菜单导航即可进入常用任务。
3. **查看 feed** — 浏览近期活动，发现需要关注的内容。

> **提示：** 定期查看 Dashboard，了解 tenant 活动。
