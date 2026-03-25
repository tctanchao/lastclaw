# LastClaw 🔥

> ⚠️ **技术演示版本：所有技能均为模拟数据，无法实际采集真实数据。仅用于展示 OpenClaw 技能开发框架。**

OpenClaw 技能开发与变现项目

[![CI](https://github.com/tctanchao/lastclaw/workflows/CI/badge.svg)](https://github.com/tctanchao/lastclaw/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.0--demo-blue)](https://github.com/tctanchao/lastclaw/releases)

低成本启动，通过开发高质量的 OpenClaw 技能实现变现。

## 📦 技能列表

| 技能 | 状态 | 定价 | 说明 |
|------|------|------|------|
| [公众号文章监控](./skills/wechat-article-monitor/) | ✅ 演示版 | - | 监控公众号更新，实时推送通知（模拟数据）|
| [小红书爆款采集](./skills/xiaohongshu-collector/) | ✅ 演示版 | - | 采集笔记数据，分析爆款内容（模拟数据）|
| 智能邮件分类 | ⏳ 计划中 | ¥49/月 | 自动分类邮件，识别重要邮件 |

## 🚀 快速开始

### 安装技能

```bash
# 克隆仓库
git clone https://github.com/tctanchao/lastclaw.git
cd lastclaw

# 安装技能（以小红书采集为例）
openclaw skill install ./skills/xiaohongshu-collector
```

### 开发新技能

```bash
# 创建技能模板
openclaw skill create my-new-skill

# 测试技能
openclaw skill test ./skills/my-new-skill
```

## 📖 文档

- [开发指南](./docs/开发指南.md)
- [使用教程](./docs/使用教程.md)
- [发布流程](./docs/发布流程.md)

## 💰 变现模式

- **单技能订阅**: ¥29-49/月
- **全技能包**: ¥99/月（节省 60%）
- **企业定制**: ¥5000-20000/项目

## 📅 开发计划

| 阶段 | 时间 | 目标 |
|------|------|------|
| Phase 1 | 第 1 周 | 环境搭建 + 第一个技能 MVP |
| Phase 2 | 第 2 周 | 发布 ClawHub + 获取反馈 |
| Phase 3 | 第 3-4 周 | 迭代优化 + 开始变现 |
| Phase 4 | 第 2-3 月 | 扩展技能矩阵 |

## 🤝 贡献

欢迎提交 Issue 和 PR！详见 [贡献指南](./CONTRIBUTING.md)

## 📄 许可证

[MIT License](./LICENSE)

---

**状态说明**: 🚧 开发中 | ✅ 演示版（模拟数据）| ⏳ 计划中
