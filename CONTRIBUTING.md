# 贡献指南

感谢你对 LastClaw 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 先检查 [Issues](https://github.com/tctanchao/lastclaw/issues) 中是否已有类似问题
2. 如果没有，创建新的 Issue，使用合适的模板
3. 提供详细的描述和复现步骤

### 提交代码

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开发规范

### 代码风格

- 使用 2 空格缩进
- 使用 ES6+ 语法
- 函数添加 JSDoc 注释
- 避免使用 `var`，使用 `const` 或 `let`

### Commit 消息格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/tctanchao/lastclaw.git
cd lastclaw

# 安装依赖（如果有）
npm install

# 运行测试（如果有）
npm test
```

## 技能开发

如果你想开发新的技能：

1. 在 `skills/` 目录下创建新的技能目录
2. 创建 `package.json`、`SKILL.md`、`src/index.js`
3. 参考 `wechat-article-monitor` 或 `xiaohongshu-collector` 的结构
4. 在 `README.md` 中添加你的技能

## 许可证

通过贡献代码，你同意你的贡献将使用 MIT 许可证。
