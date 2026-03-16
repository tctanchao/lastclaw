/**
 * 数据采集模块
 * 
 * 负责从小红书采集笔记数据
 */

const axios = require('axios');

class Collector {
  constructor(config = {}) {
    this.config = config;
    this.baseUrl = 'https://www.xiaohongshu.com';
    
    // 模拟请求头
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Referer': this.baseUrl
    };
  }

  /**
   * 搜索笔记
   * @param {string} keyword - 搜索关键词
   * @param {number} limit - 返回数量限制
   * @returns {Promise<Array>} 笔记列表
   */
  async search(keyword, limit = 50) {
    try {
      // TODO: 实现真实的小红书 API 调用
      // 目前返回模拟数据用于测试
      
      console.log(`正在搜索：${keyword} (限制：${limit}条)`);
      
      // 模拟数据 - 实际使用时需要替换为真实 API 调用
      const mockNotes = this._generateMockData(keyword, limit);
      
      return mockNotes;
      
    } catch (error) {
      console.error('搜索失败:', error.message);
      throw new Error(`搜索失败：${error.message}`);
    }
  }

  /**
   * 获取笔记详情
   * @param {string} noteId - 笔记 ID
   * @returns {Promise<Object>} 笔记详情
   */
  async getNoteDetail(noteId) {
    try {
      // TODO: 实现获取笔记详情的 API 调用
      console.log(`获取笔记详情：${noteId}`);
      return { id: noteId, title: '示例笔记', content: '示例内容' };
    } catch (error) {
      console.error('获取详情失败:', error.message);
      throw new Error(`获取详情失败：${error.message}`);
    }
  }

  /**
   * 获取博主信息
   * @param {string} userId - 用户 ID
   * @returns {Promise<Object>} 博主信息
   */
  async getUserInfo(userId) {
    try {
      // TODO: 实现获取用户信息的 API 调用
      console.log(`获取用户信息：${userId}`);
      return { id: userId, nickname: '示例博主', followers: 10000 };
    } catch (error) {
      console.error('获取用户信息失败:', error.message);
      throw new Error(`获取用户信息失败：${error.message}`);
    }
  }

  /**
   * 生成模拟数据（用于测试）
   * @private
   */
  _generateMockData(keyword, limit) {
    const notes = [];
    
    // 根据关键词选择不同的标题模板
    const titleTemplates = this._getTitleTemplates(keyword);
    
    for (let i = 0; i < limit; i++) {
      const likes = Math.floor(Math.random() * 20000) + 500;
      const collects = Math.floor(likes * (0.3 + Math.random() * 0.4));
      const comments = Math.floor(likes * (0.05 + Math.random() * 0.1));
      
      const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
      
      notes.push({
        id: `note_${Date.now()}_${i}`,
        title: this._generateTitle(template, keyword),
        content: this._generateContent(template, keyword),
        likes,
        collects,
        comments,
        author: this._generateAuthor(i),
        url: `https://www.xiaohongshu.com/explore/note_${i}`,
        createdAt: this._generateDate(i),
        images: this._generateImages(i),
        tags: this._generateTags(keyword)
      });
    }

    // 按点赞数倒序
    return notes.sort((a, b) => b.likes - a.likes);
  }

  /**
   * 获取标题模板
   * @private
   */
  _getTitleTemplates(keyword) {
    const templates = {
     护肤: [
        `7 天祛黄 10 大法！亲测有效`,
        `换季护肤误区，这 3 个坑别踩`,
        `敏感肌自救指南，不看后悔`,
        `预算 200 块搞定一套水乳`,
        `油皮干纹怎么办？这 6 个方法亲测`,
        `医美面膜排行榜，第一名居然是它`,
        `早 C 晚 VS 晚 A 醛，区别在這`,
        `护肤黑科技，这些成分要远离`,
        `平价好物推荐，学生党闭眼入`,
        `秋冬护肤重点，做好这 3 点`,
        `抗糖化护肤，30 岁皮肤回春`,
        `新手护肤必买清单，浪费钱不如不买`,
        `网红同款护肤品，平价替代品清单`
      ],
      美妆: [
        `粉底液推荐，这 5 款盲测不踩雷`,
        `新手眼妆教程，3 分钟学会日常妆`,
        `黄黑皮妹必看，这 6 个提亮色`,
        `素颜伪妆教程，自然底妆秘诀`,
        `口红试色报告，今年流行色号大盘点`,
        `平价彩妆好物，学生党闭眼入`,
        `遮瑕膏怎么选？不纠结看这个`,
        `卸妆正确步骤，这 3 个错误 90% 的人都在犯`,
        `美妆工具合集，50 元搞定全套`,
        `平价粉底液，大牌平替品排行榜`
      ],
      美食: [
        `3 分钟快手早餐，搞定一周不重样`,
        `懒人一锅炖，食材准备好就行`,
        `减脂餐推荐，好吃又掉秤`,
        `家常菜合集，10 道菜搞定一周`,
        `平价好物推荐，学生党省钱攻略`,
        `宿舍煮饭神器，电饭锅必备`,
        `夜宵吃什么？这 10 种别错过`,
        `网红同款食材，平价替代品清单`,
        `快手美食教程，3 分钟学会爆款菜`,
        `一人食清单，30 元搞定一周`
      ],
      穿搭: [
        `春季穿搭推荐，显瘦又舒服`,
        `梨形身材怎么穿？显瘦穿搭指南`,
        `平价好物推荐，100 元搞定一套`,
        `小个子穿搭技巧，显高不是梦`,
        `通勤穿搭模板，5 分钟搞定出门装`,
        `约会穿搭建议，让好感度飙升`,
        `配饰推荐清单，平价又好看`,
        `素人穿搭教程，从学生到职场`,
        `冬季穿搭重点，保暖又时尚`
      ],
      科技: [
        `AI 编程助手，提升 10 倍效率`,
        `开源项目推荐，从入门到精通`,
        `程序员副业，这 5 个方向月入 5k+`,
        `低代码平台，小白也能接单`,
        `技术债务管理，避免踩坑`,
        `面试必问 10 题，90% 的人答不上`,
        `职场生存指南，软技能比技术重要`,
        `开源项目源码分析，学习大佬思路`
      ],
      健身: [
        `7 天瘦 5 斤食谱，亲测有效`,
        `帕梅拉饮食法，3 天瘦 3 斤`,
        `有氧运动计划，30 天减 10 斤`,
        `减脂零食推荐，好吃不怕胖`,
        `增肌训练指南，新手友好版`,
        `家庭健身器材，平价好物清单`,
        `跑步不伤膝盖，这 5 个要点`,
        `腹肌训练计划，8 周见效`,
        `无器械健身方案，徒手也能练`
      ],
      default: [
        `${keyword}分享，超好用！`,
        `亲测有效的${keyword}方法`,
        `${keyword}攻略，看这篇就够了`,
        `被问爆的${keyword}来了`,
        `${keyword}天花板，不接受反驳`,
        `后悔没早知道的${keyword}`
      ]
    };
    
    // 查找匹配的模板
    for (const [category, items] of Object.entries(templates)) {
      if (keyword.includes(category)) {
        return items;
      }
    }
    
    return templates.default;
  }

  /**
   * 生成标题
   * @private
   */
  _generateTitle(template, keyword) {
    // 添加数字和表情，让标题更真实
    const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const emojis = ['🔥', '⭐', '✨', '💯', '🎉', '🌟', '💖', '🎊', '💝'];
    
    let title = template;
    
    // 随机添加数字（概率 30%）
    if (Math.random() < 0.3) {
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      title = `${num}、${emoji} ${title}`;
    }
    
    return title;
  }

  /**
   * 生成内容
   * @private
   */
  _generateContent(template, keyword) {
    const contents = [
      `最近发现一个超好用的${keyword}方法，亲测有效真的很推荐！`,
      `详细步骤请看笔记全文，图文并茂特别容易理解~`,
      `这个${keyword}真的太好用了，已经推荐给身边 10+ 个朋友`,
      `价格很友好，学生党也能轻松拥有`,
      `使用感受满分，回购率超高，建议闭眼入！`,
      `注意事项：敏感肌请先在耳后测，建议从低浓度开始`,
      `搭配其他${keyword}使用，效果翻倍！`,
      `坚持使用 1 个月，你会看到明显改善`
    ];
    
    return contents[Math.floor(Math.random() * contents.length)];
  }

  /**
   * 生成作者信息
   * @private
   */
  _generateAuthor(index) {
    const nicknames = [
      '美妆博主小鹿', '护肤达人阿美', '穿搭师 Lisa', '美食博主大胃王',
      '平价好物种草', '学生党最爱', '测评博主小 Q', '种草小机灵',
      '真实测评报告', '性价比挖掘机', '成分党研究所', '平价替代品评测'
    ];
    
    return {
      id: `user_${index}`,
      nickname: nicknames[index % nicknames.length],
      followers: Math.floor(Math.random() * 500000) + 10000
    };
  }

  /**
   * 生成图片链接
   * @private
   */
  _generateImages(index) {
    return [
      `https://example.com/image1_${index}.jpg`,
      `https://example.com/image2_${index}.jpg`,
      `https://example.com/image3_${index}.jpg`
    ];
  }

  /**
   * 生成标签
   * @private
   */
  _generateTags(keyword) {
    const tagSets = {
      护肤: ['护肤', '敏感肌', '祛黄', '美白', '抗老', '平价'],
      美妆: ['底妆', '粉底', '口红', '遮瑕', '眼影', '眼妆'],
      美食: ['美食', '食谱', '家常菜', '快手菜', '减脂餐', '快手'],
      穿搭: ['穿搭', '显瘦', '小个子', '通勤', '约会', '梨形'],
      科技: ['AI', '编程', '开源', '效率', '职场', '面试'],
      健身: ['健身', '减脂', '增肌', '有氧', 'run', '腹肌'],
      default: [keyword, '推荐', '分享', '好用', '亲测', '测评']
    };
    
    // 查找匹配的标签集
    for (const [category, tags] of Object.entries(tagSets)) {
      if (keyword.includes(category)) {
        // 随机返回 3-5 个标签
        const count = Math.floor(Math.random() * 3) + 3;
        return tags.slice(0, Math.min(count, tags.length));
      }
    }
    
    return tagSets.default.slice(0, 3);
  }

  /**
   * 生成发布时间
   * @private
   */
  _generateDate(index) {
    const daysAgo = Math.floor(Math.random() * 60);
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  }
}

module.exports = Collector;
