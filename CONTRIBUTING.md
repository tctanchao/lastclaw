# Contributing

欢迎贡献代码到 LastClaw！

## 快速开始

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开发规范

## Commit 消息格式

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 测试相关
chore: 构建/工具变动
```

示例：
```
feat: 添加文章导出功能
fix: 修复定时任务时间解析错误
docs: 更新 README 使用说明
```

## 代码风格

- 使用 2 空格缩进
- 使用 ES6+ 语法
- 函数添加 JSDoc 注释
- 避免使用 `var`，使用 `const` 或 `let`
- 文件名使用 kebab-case（如 `article-monitor.js`）

## 文件结构

```
lastclaw/
├── skills/           # 技能目录
│   ├── skill-name/   # 单个技能
│   │   ├── package.json
│   │   ├── SKILL.md
│   │   ├── src/      # 源代码
│   │   ├── docs/     # 技能文档
│   │   └── config/   # 配置文件
├── docs/             # 项目文档
└── .github/          # GitHub 配置
```

## 技能开发

### 创建新技能

1. 在 `skills/` 下创建新目录
2. 创建 `package.json`：

```json
{
  "name": "my-skill",
  "version": "0.1.0",
  "description": "技能描述",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "keywords": ["openclaw", "skill"],
  "author": "your-name",
  "license": "MIT",
  "dependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
```

3. 创建 `SKILL.md`（参考现有技能）
4. 创建 `src/index.js`：

```javascript
module.exports = {
  name: 'my-skill',
  version: '0.1.0',
  description: '技能描述',

  handlers: {
    async command({ param }) {
      // 处理命令
      return result;
    }
  }
};
```

5. 更新主 README.md 技能列表

## 测试

### 本地测试

```bash
cd skills/my-skill
npm install
node src/index.js
```

### 代码检查

```bash
# 语法检查
node -c src/index.js
```

## Issue 和 PR

### Issue 类型

- **Bug 报告**: 使用 Bug Report 模板
- **功能请求**: 使用 Feature Request 模板

### PR 检查清单

- [ ] 代码符合项目风格
- [ ] 添加了必要的注释
- [ ] 更新了文档
- [ ] Commit 消息符合规范
- [ ] 更新了 CHANGELOG.md（如需要）
- [ ] 没有CI 失败

## 许可证

通过贡献代码，你同意你的贡献将使用 MIT 许可证。

## 联系方式

如有问题，请联系：
- GitHub Issues: https://github.com/tctanchao/lastclaw/issues
- 邮箱: support@lastclaw.com
