# 更新日志

所有重要变更都记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2026-03-16

### 新增
- 公众号文章监控技能
  - 添加公众号功能
  - 文章采集功能
  - 实时监控功能
  - 数据导出功能（Markdown/CSV）
- 小红书爆款采集技能
  - 关键词搜索功能
  - 数据采集功能
  - 爆款识别功能
  - 数据分析功能

### 技术改进
- 统一异步代码风格（使用 `fs.promises` 和 `node-cron`）
- 修复重复代码问题
- 移除未使用的依赖

### 文档
- 添加 README
- 添加开发指南
- 添加贡献指南
- 添加 LICENSE

---

## [未来计划]

### 计划中
- 智能邮件分类技能
- 集成真实 API（微信、小红书）
- 添加单元测试
- 添加 GitHub Actions CI
- 添加 TypeScript 类型定义
