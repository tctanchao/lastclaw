/**
 * 公众号文章文章监控 - 主入口
 *
 * @module wechat-article-monitor
 */

const cron = require('node-cron');
const Monitor = require('./monitor');
const Notifier = require('./notifier');
const Storage = require('./storage');

class WeChatArticleMonitor {
  constructor(config = {}) {
    this.config = {
      checkInterval: config.checkInterval || 3600, // 1 小时
      notifyEnabled: config.notifyEnabled !== false,
      maxArticles: config.maxArticles || 10,
      apiKey: config.apiKey,
      ...config
    };

    this.monitor = new Monitor(this.config);
    this.notifier = new Notifier(this.config);
    this.storage = new Storage(this.config);

    this.scheduledJobs = new Map();
  }

  /**
   * 添加公众号
   * @param {string} name - 公众号名称
   * @param {string} id - 公众号 ID（可选）
   * @returns {Promise<Object>} 添加结果
   */
  async addAccount(name, id = null) {
    console.log(`📰 添加公众号：${name}`);

    try {
      // 获取公众号信息
      const accountInfo = await this.monitor.getAccountInfo(name);

      // 保存到存储
      await this.storage.addAccount({
        name,
        id: accountInfo.id || id || name,
        addedAt: new Date().toISOString()
      });

      // 立即获取一次最新文章
      const articles = await this.monitor.fetchLatestArticles(accountInfo.id || id || name, this.config.maxArticles);

      await this.storage.saveArticles(accountInfo.id || id || name, articles);

      console.log(`✅ 公众号添加成功，获取 ${articles.length} 篇文章`);

      return {
        success: true,
        account: accountInfo,
        articles
      };

    } catch (error) {
      console.error(`❌ 添加公众号失败：${error.message}`);
      throw new Error(`添加公众号失败：${error.message}`);
    }
  }

  /**
   * 查看最新文章
   * @param {string} accountName - 公众号名称
   * @returns {Promise<Array>} 文章列表
   */
  async getLatestArticles(accountName) {
    try {
      const articles = await this.storage.getArticles(accountName);
      return articles;
    } catch (error) {
      console.error(`获取文章失败：${error.message}`);
      return [];
    }
  }

  /**
   * 列出所有监控的公众号
   * @returns {Promise<Array>} 公众号列表
   */
  async listAccounts() {
    return await this.storage.getAccounts();
  }

  /**
   * 删除公众号
   * @param {string} accountName - 公众号名称
   * @returns {Promise<boolean>} 删除结果
   */
  async removeAccount(accountName) {
    console.log(`🗑️ 删除公众号：${accountName}`);

    // 停止定时任务
    if (this.scheduledJobs.has(accountName)) {
      const job = this.scheduledJobs.get(accountName);
      job.stop();
      this.scheduledJobs.delete(accountName);
    }

    // 删除存储
    const result = await this.storage.removeAccount(accountName);

    if (result) {
      console.log('✅ 删除成功');
    } else {
      console.log('❌ 删除失败');
    }

    return result;
  }

  /**
   * 启动实时监控
   * @returns {Promise<void>}
   */
  async startMonitoring() {
    console.log('🚀 启动实时监控...\n');

    const accounts = await this.storage.getAccounts();

    if (accounts.length === 0) {
      console.log('⚠️ 还没有添加公众号');
      console.log('提示：使用 /公众号监控 添加 [公众号名称] 来添加');
      return;
    }

    console.log(`📋 监控 ${accounts.length} 个公众号`);

    for (const account of accounts) {
      await this._startMonitoringAccount(account);
    }

    console.log('\n✅ 实时监控已启动！');
    console.log(`检查间隔：${this.config.checkInterval / 60} 分钟\n`);
  }

  /**
   * 启动单个公众号的监控
   * @private
   */
  async _startMonitoringAccount(account) {
    console.log(`\n📰 ${account.name} - 开始监控`);

    // 查看已有文章
    const existingArticles = await this.storage.getArticles(account.id);
    const existingTitles = new Set(existingArticles.map(a => a.title));

    // 定时检查函数
    const checkFunction = async () => {
      try {
        // 获取最新文章
        const newArticles = await this.monitor.fetchLatestArticles(account.id, this.config.maxArticles);

        // 过滤出新文章
        const freshArticles = newArticles.filter(article => !existingTitles.has(article.title));

        if (freshArticles.length > 0) {
          console.log(`\n🔔 发现 ${freshArticles.length} 篇新文章：${account.name}`);

          for (const article of freshArticles) {
            console.log(`   - 《${article.title}》`);
            console.log(`     📅 ${article.publishTime}`);
            console.log(`     🔗 ${article.url}`);
          }

          // 保存新文章
          await this.storage.saveArticles(account.id, [...newArticles]);

          // 发送通知
          if (this.config.notifyEnabled) {
            await this.notifier.sendNotification(account, freshArticles);
          }

          // 更新已有标题集合
          for (const article of freshArticles) {
            existingTitles.add(article.title);
          }
        } else {
          console.log(`✓ ${account.name} - 暂无新文章 (${new Date().().toLocaleTimeString()})`);
        }
      } catch (error) {
        console.error(`❌ 检查失败：${error.message}`);
      }
    };

    // 立即检查一次
    await checkFunction();

    // 使用 node-cron 设置定时任务
    // checkInterval 是秒数，转换为分钟
    const minutes = Math.floor(this.config.checkInterval / 60);
    // 每N分钟执行一次：*/N * * * *
    const cronExpression = `*/${minutes} * * * *`;

    const job = cron.schedule(cronExpression, checkFunction);
    job.start();

    this.scheduledJobs.set(account.id, job);
  }

  /**
   * 停止监控
   * @returns {Promise<void>}
   */
  async stopMonitoring() {
    console.log('⏹ 停止监控...\n');

    for (const [accountId, job] of this.scheduledJobs) {
      job.stop();
      console.log(`✓ 已停止：${accountId}`);
    }

    this.scheduledJobs.clear();
    console.log('✅ 所有监控已停止');
  }

  /**
   * 导出文章数据
   * @param {string} accountName - 公众号名称
   * @param {string} format - 导出格式 (excel/markdown)
   * @returns {Promise<string>} 文件路径
   */
  async exportArticles(accountName, format = 'markdown') {
    try {
      const articles = await this.storage.getArticles(accountName);

      if (articles.length === 0) {
        console.log('⚠️ 没有可导出的文章');
        return null;
      }

      const path = require('path');
      const fs = require('fs').promises;

      const exportDir = './exports';
      await fs.mkdir(exportDir, { recursive: true });

      const filename = `${accountName}_articles.${format === 'markdown' ? 'md' : 'csv'}`;
      const filepath = path.join(exportDir, filename);

      if (format === 'markdown') {
        const content = this._generateMarkdown(articles, accountName);
        await fs.writeFile(filepath, content, 'utf-8');
      } else {
        const content = this._generateCSV(articles);
        await fs.writeFile(filepath, content, 'utf-8');
      }

      console.log(`✅ 导出成功：${filepath}`);
      console.log(`   文章数：${articles.length}`);

      return filepath;

    } catch (error) {
      console.error(`导出失败：${error.message}`);
      throw new Error(`导出失败：${error.message}`);
    }
  }

  /**
   * 生成 Markdown 格式
   * @private
   */
  _generateMarkdown(articles, accountName) {
    const lines = [
      `# ${accountName} 文章汇总`,
      '',
      `生成时间：${new Date().toLocaleString('zh-CN')}`,
      `文章数量：${articles.length}`,
      '',
      '---',
      ''
    ];

    articles.forEach((article, index) => {
      lines.push(`## ${index + 1}. ${article.title}`);
      lines.push('');
      lines.push(`**发布时间**: ${article.publishTime}`);
      lines.push(`**阅读数**: ${article.readCount || '未知'}`);
      lines.push(`**点赞数**: ${article.likeCount || '未知'}`);
      lines.push('');
      lines.push(article.content?.substring(0, 500) || '暂无内容');
      lines.push('');
      lines.push(`[阅读原文](${article.url})`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * 生成 CSV 格式
   * @private
   */
  _generateCSV(articles) {
    const headers = ['标题', '发布时间', '阅读数', '点赞数', '链接', '摘要'];

    const rows = articles.map(article => [
        this._escapeCSV(article.title),
        article.publishTime,
        article.readCount || '',
        article.likeCount || '',
        article.url,
        this._escapeCSV(article.content?.substring(0, 200) || '')
      ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  /**
   * 转义 CSV 特殊字符
   * @private
   */
  _escapeCSV(text) {
    if (!text) return '';
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }
}

// OpenClaw 技能入口
module.exports = {
  name: 'wechat-article-monitor',
  version: '0.1.0',
  description: '公众号文章监控',

  handlers: {
    async add({ name, id }) {
      const monitor = new WeChatArticleMonitor();
      return await monitor.addAccount(name, id);
    },

    async latest({ name }) {
      const monitor = new WeChatArticleMonitor();
      return await monitor.getLatestArticles(name);
    },

    async list() {
      const monitor = new WeChatArticleMonitor();
      return await monitor.listAccounts();
    },

    async remove({ name }) {
      const monitor = new WeChatArticleMonitor();
      return await monitor.removeAccount(name);
    },

    async start() {
      const monitor = new WeChatArticleMonitor();
      await monitor.startMonitoring();
    },

    async stop() {
      const monitor = new WeChatArticleMonitor();
      await monitor.stopMonitoring();
    },

    async export({ name, format }) {
      const monitor = new WeChatArticleMonitor();
      return await monitor.exportArticles(name, format);
    }
  }
};
