/**
 * 存储模块
 *
 * 负责数据持久化
 */

const path = require('path');
const fs = require('fs').promises;

class Storage {
  constructor(config = {}) {
    this.dataDir = config.dataDir || './data';
    this.accountsFile = path.join(this.dataDir, 'accounts.json');
    this.articlesDir = path.join(this.dataDir, 'articles');
  }

  /**
   * 确保数据目录存在
   * @private
   */
  async _ensureDirectories() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(this.articlesDir, { recursive: true });

      // 初始化账号文件
      try {
        await fs.access(this.accountsFile);
      } catch {
        await fs.writeFile(this.accountsFile, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (error) {
      console.error('创建目录失败:', error.message);
      throw error;
    }
  }

  /**
   * 添加公众号
   * @param {Object} account - 公众号信息
   * @returns {Promise<boolean>} 添加结果
   */
  async addAccount(account) {
    try {
      await this._ensureDirectories();
      const accounts = await this.getAccounts();

      // 检查是否已存在
      if (accounts.some(a => a.id === account.id || a.name === account.name)) {
        console.log('⚠️ 公众号已存在');
        return false;
      }

      accounts.push(account);
      await this._saveAccounts(accounts);

      return true;

    } catch (error) {
      console.error('添加公众号失败:', error.message);
      return false;
    }
  }

  /**
   * 获取所有公众号
   * @returns {Promise<Array>} 公众号列表
   */
  async getAccounts() {
    try {
      const content = await fs.readFile(this.accountsFile, 'utf-8');
      const data = JSON.parse(content || '[]');

      // 兼容旧的对象格式，转换为数组
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return Object.values(data);
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('获取账号列表失败:', error.message);
      return [];
    }
  }

  /**
   * 删除公众号
   * @param {string} accountId - 公众号 ID
   * @returns {Promise<boolean>} 删除结果
   */
  async removeAccount(accountId) {
    try {
      const accounts = await this.getAccounts();
      const filtered = accounts.filter(a => a.id !== accountId && a.name !== accountId);

      await this._saveAccounts(filtered);

      // 删除文章数据
      const articlesFile = path.join(this.articlesDir, `${accountId}.json`);
      try {
        await fs.unlink(articlesFile);
      } catch {
        // 文件不存在，忽略
      }

      return true;

    } catch (error) {
      console.error('删除公众号失败:', error.message);
      return false;
    }
  }

  /**
   * 保存文章
   * @param {string} accountId - 公众号 ID
   * @param {Array} articles - 文章列表
   * @returns {Promise<void>}
   */
  async saveArticles(accountId, articles) {
    try {
      const articlesFile = path.join(this.articlesDir, `${accountId}.json`);
      await fs.writeFile(articlesFile, JSON.stringify(articles, null, 2), 'utf-8');

      console.log(`✅ 文章已保存：${accountId} (${articles.length} 篇）`);

    } catch (error) {
      console.error('保存文章失败:', error.message);
    }
  }

  /**
   * 获取文章
   * @param {string} accountId - 公众号 ID
   * @returns {Promise<Array>} 文章列表
   */
  async getArticles(accountId) {
    try {
      const articlesFile = path.join(this.articlesDir, `${accountId}.json`);

      try {
        const content = await fs.readFile(articlesFile, 'utf-8');
        return JSON.parse(content || '[]');
      } catch {
        // 文件不存在，返回空数组
        return [];
      }

    } catch (error) {
      console.error('获取文章失败:', error.message);
      return [];
    }
  }

  /**
   * 追加新文章
   * @param {string} accountId - 公众号 ID
   * @param {Array} newArticles - 新文章列表
   * @returns {Promise<void>}
   */
  async appendArticles(accountId, newArticles) {
    try {
      const existingArticles = await this.getArticles(accountId);

      // 去重（根据标题）
      const existingTitles = new Set(existingArticles.map(a => a.title));
      const uniqueNew = newArticles.filter(a => !existingTitles.has(a.title));

      if (uniqueNew.length === 0) {
        console.log('✓ 没有新文章');
        return;
      }

      const allArticles = [...existingArticles, ...uniqueNew];
      await this.saveArticles(accountId, allArticles);

      console.log(`✅ 追加 ${uniqueNew.length} 篇新文章`);

    } catch (error) {
      console.error('追加文章失败:', error.message);
    }
  }

  /**
   * 保存账号列表
   * @private
   */
  async _saveAccounts(accounts) {
    await fs.writeFile(this.accountsFile, JSON.stringify(accounts, null, 2), 'utf-8');
  }
}

module.exports = Storage;
