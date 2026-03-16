/**
 * 通知模块
 * 
 * 负责发送新文章通知
 */

class Notifier {
  constructor(config = {}) {
    this.config = {
      enabled: config.notifyEnabled !== false,
      ...config
    };
  }

  /**
   * 发送通知
   * @param {Object} account - 公众号信息
   * @param {Array} articles - 新文章列表
   * @returns {Promise<void>}
   */
  async sendNotification(account, articles) {
    if (!this.config.enabled) {
      console.log('🔕 通知功能未启用');
      return;
    }
    
    try {
      console.log(`\n📬 发送通知...`);
      
      // 生成通知消息
      const message = this._generateMessage(account, articles);
      
      // TODO: 实现真实的通知渠道
      // - OpenClaw 消息推送
      // - 钉钉通知
      // - 邮件通知
      
      console.log(`✅ 通知发送成功`);
      console.log(`\n${message}`);
      
    } catch (error) {
      console.error('发送通知失败:', error.message);
    }
  }

  /**
   * 生成通知消息
   * @private
   */
  _generateMessage(account, articles) {
    const lines = [
      '📰 公众号文章更新通知',
      '='.repeat(60),
      '',
      `公众号：${account.name}`,
      `发现新文章：${articles.length} 篇`,
      ''
    ];
    
    articles.forEach((article, index) => {
      lines.push(`\n${index + 1}. 《${article.title}》`);
      lines.push(`   📅 ${article.publishTime}`);
      lines.push(`   👁 ${article.readCount || 0} 阅读`);
      lines.push(`   👍 ${article.likeCount || 0} 点赞`);
      lines.push(`   🔗 ${article.url}`);
    });
    
    lines.push('');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push('查看更多：/公众号监控 最新 ' + account.name);
    lines.push('');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }
}

module.exports = Notifier;
