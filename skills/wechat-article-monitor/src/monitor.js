/**
 * 公众号监控模块
 *
 * 负责获取公众号信息和文章数据
 */

const axios = require('axios');

class Monitor {
  constructor(config = {}) {
    this.config = {
      apiBase: 'https://api.weixin.qq.com/cgi-bin',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...config
    };
  }

  /**
   * 获取公众号信息
   * @param {string} name - 公众号名称
   * @returns {Promise<Object>} 公众号信息
   */
  async getAccountInfo(name) {
    try {
      // TODO: 实现真实的微信 API 调用
      // 目前返回模拟数据

      console.log(`正在获取公众号信息：${name}`);

      // 模拟公众号信息
      const mockAccounts = {
        '36氪': {
          id: '36kr',
          name: '36氪',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '关注科技、创业、投资领域'
        },
        '极客时间': {
          id: 'geektime',
          name: '极客时间',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '科技媒体，提供有价值的科技资讯'
        },
        '虎嗅网': {
          id: 'huxiu',
          name: '虎嗅网',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '聚合新闻与商业资讯'
        },
        '差评': {
          id: 'chaoping',
          name: '差评',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '消费决策与社区驱动的新媒体平台'
        },
        '舴范儿': {
          id: 'shifan',
          name: '舴范儿',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '生活方式类内容品牌，主打平价优质商品'
        },
        '清博数据': {
          id: 'qingblogb',
          name: '清博数据',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '聚合优质博客内容，提供深度的数据分析'
        },
        '晚点': {
          id: 'wanbaodian',
          name: '晚点',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '面向年轻人的文化内容平台'
        },
        '新榜': {
          id: 'xinbang',
          name: '新榜',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '新媒体数据平台，提供各类榜单数据'
        },
        '新讯': {
          id: 'xink',
          name: '新讯',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '科技与商业领域的新媒体'
        },
        '澎湃': {
          id: 'thepaper',
          name: '澎湃',
          avatar: 'https://mmbiz.qpic.cn/mmbiz/xxx/xxx.jpg',
          description: '原澎湃新闻、思想者、优质内容平台'
        }
      };

      // 如果是已知的模拟账号，返回模拟信息
      const accountInfo = mockAccounts[name];

      if (accountInfo) {
        console.log(`✅ 找到公众号：${name}`);
        return accountInfo;
      }

      // 未知账号，返回通用信息
      console.log(`⚠️ 公众号不在模拟列表中，返回默认信息`);
      return {
        id: this._generateId(name),
        name,
        avatar: '',
        description: `公众号：${name}`
      };

    } catch (error) {
      console.error('获取公众号信息失败:', error.message);
      throw new Error(`获取公众号信息失败：${error.message}`);
    }
  }

  /**
   * 获取最新文章
   * @param {string} accountId - 公众号 ID
   * @param {number} limit - 文章数量限制
   * @returns {Promise<Array>} 文章列表
   */
  async fetchLatestArticles(accountId, limit = 10) {
    try {
      console.log(`正在获取最新文章...`);

      // TODO: 实现真实的微信 API 调用
      // 目前返回模拟数据

      const articles = this._generateMockArticles(accountId, limit);

      console.log(`✅ 获取到 ${articles.length} 篇文章`);

      return articles;

    } catch (error) {
      console.error('获取文章失败:', error.message);
      throw new Error(`获取文章失败：${error.message}`);
    }
  }

  /**
   * 搜索公众号
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Array>} 公众号列表
   */
  async searchAccounts(keyword) {
    try {
      console.log(`正在搜索公众号：${keyword}`);

      // TODO: 实现真实的微信 API 搜索
      // 目前返回模拟数据

      const results = [
        {
          id: this._generateId(keyword),
          name: `${keyword}科技`,
          avatar: '',
          description: `关于${keyword}的科技资讯`
        }
      ];

      console.log(`✅ 找到 ${results.length} 个公众号`);

      return results;

    } catch (error) {
      console.error('搜索公众号失败:', error.message);
      throw new Error(`搜索公众号失败：${error.message}`);
    }
  }

  /**
   * 生成模拟文章数据
   * @private
   */
  _generateMockArticles(accountId, limit) {
    const titles = [
      'AI 时代，程序员如何保持竞争力？',
      '2026 年科技行业趋势预测',
      '开源大模型选型指南',
      '为什么 90% 的程序员都选择这个框架',
      'JavaScript 性能优化 10 个技巧',
      '微服务架构设计最佳实践',
      '云计算成本优化策略',
      '前端开发必备工具 2026',
      '技术债务如何有效管理',
      '自动化测试完全指南'
    ];

    const articles = [];

    for (let i = 0; i < limit; i++) {
      const titleIndex = Math.floor(Math.random() * titles.length);
      const hoursAgo = Math.floor(Math.random() * 72); // 0-72 小时前

      articles.push({
        id: `${accountId}_art_${Date.now()}_${i}`,
        title: titles[titleIndex],
        author: '技术编辑',
        publishTime: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toLocaleString('zh-CN'),
        readCount: Math.floor(Math.random() * 50000) + 1000,
        likeCount: Math.floor(Math.random() * 2000) + 100,
        url: `https://mp.weixin.qq.com/s/${accountId}_${i}`,
        content: `这是一篇关于${titles[titleIndex]}的详细内容...`,
        tags: ['科技', '技术', 'AI']
      });
    }

    // 按发布时间倒序
    return articles.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
  }

  /**
   * 生成 ID
   * @private
   */
  _generateId(name) {
    return name.replace(/\s+/g, '-').toLowerCase();
  }
}

module.exports = Monitor;
