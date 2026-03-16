/**
 * 数据分析模块
 * 
 * 分析笔记数据，识别爆款内容
 */

class Analyzer {
  constructor(config = {}) {
    this.config = config;
    this.minLikes = config.minLikes || 1000;
  }

  /**
   * 分析笔记列表
   * @param {Array} notes - 笔记列表
   * @returns {Object} 分析结果
   */
  analyze(notes) {
    if (!notes || notes.length === 0) {
      return {
        total: 0,
        hotNotes: [],
        avgLikes: 0,
        avgCollects: 0,
        avgComments: 0,
        topAuthors: [],
        keywordAnalysis: {}
      };
    }

    // 爆款笔记（点赞 > 阈值）
    const hotNotes = notes.filter(note => note.likes >= this.minLikes);

    // 平均数据
    const avgLikes = this._average(notes.map(n => n.likes));
    const avgCollects = this._average(notes.map(n => n.collects));
    const avgComments = this._average(notes.map(n => n.comments));

    // 热门作者
    const topAuthors = this._getTopAuthors(notes, 10);

    // 关键词分析
    const keywordAnalysis = this._analyzeKeywords(notes);

    return {
      total: notes.length,
      hotNotes: this._sortByEngagement(hotNotes),
      avgLikes: Math.round(avgLikes),
      avgCollects: Math.round(avgCollects),
      avgComments: Math.round(avgComments),
      topAuthors,
      keywordAnalysis,
      engagementRate: this._calculateEngagementRate(notes)
    };
  }

  /**
   * 按互动率排序
   * @private
   */
  _sortByEngagement(notes) {
    return notes.sort((a, b) => {
      const scoreA = a.likes + a.collects * 0.5 + a.comments * 0.3;
      const scoreB = b.likes + b.collects * 0.5 + b.comments * 0.3;
      return scoreB - scoreA;
    });
  }

  /**
   * 获取热门作者
   * @private
   */
  _getTopAuthors(notes, limit = 10) {
    const authorMap = new Map();

    notes.forEach(note => {
      const authorId = note.author?.id || 'unknown';
      if (!authorMap.has(authorId)) {
        authorMap.set(authorId, {
          id: authorId,
          nickname: note.author?.nickname || '未知',
          notes: [],
          totalLikes: 0
        });
      }
      const author = authorMap.get(authorId);
      author.notes.push(note);
      author.totalLikes += note.likes;
    });

    return Array.from(authorMap.values())
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, limit);
  }

  /**
   * 关键词分析
   * @private
   */
  _analyzeKeywords(notes) {
    const titleKeywords = {};
    
    notes.forEach(note => {
      const title = note.title || '';
      // 简单分词（实际应该用更专业的分词库）
      const words = title.split(/[,\s,.]+/).filter(w => w.length > 1);
      
      words.forEach(word => {
        titleKeywords[word] = (titleKeywords[word] || 0) + 1;
      });
    });

    // 按频率排序
    return Object.entries(titleKeywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * 计算互动率
   * @private
   */
  _calculateEngagementRate(notes) {
    if (notes.length === 0) return 0;
    
    const totalEngagement = notes.reduce((sum, note) => {
      return sum + note.likes + note.collects + note.comments;
    }, 0);
    
    return (totalEngagement / notes.length).toFixed(2);
  }

  /**
   * 计算平均值
   * @private
   */
  _average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  /**
   * 生成分析报告
   * @param {Object} analysis - 分析结果
   * @returns {string} 报告文本
   */
  generateReport(analysis) {
    const lines = [
      '📊 小红书爆款分析报告',
      '='.repeat(50),
      '',
      `📈 数据概览`,
      `   总笔记数：${analysis.total}`,
      `   爆款数量：${analysis.hotNotes.length}`,
      `   平均点赞：${analysis.avgLikes}`,
      `   平均收藏：${analysis.avgCollects}`,
      `   平均评论：${analysis.avgComments}`,
      `   互动率：${analysis.engagementRate}`,
      '',
      `🔥 TOP 3 爆款笔记`,
      ...analysis.hotNotes.slice(0, 3).map((note, i) => 
        `   ${i + 1}. 《${note.title}》 - 👍${note.likes} ⭐${note.collects} 💬${note.comments}`
      ),
      '',
      `👤 TOP 3 热门作者`,
      ...analysis.topAuthors.slice(0, 3).map((author, i) => 
        `   ${i + 1}. ${author.nickname} - 总点赞${author.totalLikes}`
      ),
      '',
      `🏷️ 高频关键词`,
      ...analysis.keywordAnalysis.slice(0, 5).map((kw, i) => 
        `   ${i + 1}. ${kw.word} (${kw.count}次)`
      ),
      '',
      '='.repeat(50)
    ];

    return lines.join('\n');
  }
}

module.exports = Analyzer;
