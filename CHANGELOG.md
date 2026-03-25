# 更新日志

所有重要变更都记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2026-03-25 (演示版本)

### 新增
- 公众号文章监控技能（演示版）
  - 添加公众号功能
  - 文章采集功能（模拟数据）
  - 实时监控功能
  - 数据导出功能（Markdown/CSV）
  - 定时检查功能
- 小红书爆款采集技能（演示版）
  - 关键词搜索功能
  - 数据采集功能（模拟数据）
  - 爆款识别功能
  - 数据分析功能

### 改进
- 统一异步代码风格（使用 `fs.prom` 和 `node-cron`）
- 修复 Monitor.js 中的重复代码
- 修复定时任务表达式，改用 node-cron
- 清理未使用的依赖包

### 文档
- 添加 README.md（含状态徽章）
- 添加 CONTRIBUTING.md 贡献指南
- 添加 SECURITY.md 安全策略
- 添加 CHANGELOG.md 更新日志
- 添加 LICENSE（MIT）
- 添加 .editorconfig 统一编辑器配置
- 添加 .nvmrc 指定 Node 版本

### GitHub 配置
- 添加 GitHub Actions CI workflow
- 添加 Issue 模板（Bug 报告、功能请求）
- 添加 Pull Request 模板
- 添加 CODEOWNERS 文件
- 优化 .gitignore 配置

### 技术债务
- ⚠️ 当前为演示版本，所有数据为模拟数据
- ⚠️ 需要集成真实 API 才能实际使用

---

## [未来计划]

### 计划中
- 智能邮件分类技能
- 集成真实 API（微信、小红书）
- 添加单元测试和测试覆盖率
- 添加 TypeScript 类型定义
- 实现真正的数据导出（Excel 格式）
