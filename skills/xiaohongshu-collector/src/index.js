/**
 * 小红书爆款采集 - 主入口
 * 
 * @module xiaohongshu-collector
 */

const Collector = require('./collector');
const Analyzer = require('./analyzer');
const Exporter = require('./exporter');

class XiaohongshuCollector {
  constructor(config = {}) {
    this.config = {
      searchLimit: config.searchLimit || 50,
      minLikes: config.minLikes || 1000,
      exportFormat: config.exportFormat || 'excel',
      ...config
    };
    
    this.collector = new Collector(this.config);
    this.analyzer = new Analyzer(this.config);
    this.exporter = new Exporter(this.config);
  }

  /**
   * 搜索笔记
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Array>} 笔记列表
   */
  async search(keyword) {
    console.log(`🔍 搜索关键词：${keyword}`);
    const notes = await this.collector.search(keyword, this.config.searchLimit);
    console.log(`✅ 找到 ${notes.length} 篇笔记`);
    return notes;
  }

  /**
   * 分析爆款
   * @param {Array} notes - 笔记列表
   * @returns {Object} 分析结果
   */
  analyze(notes) {
    console.log('📊 分析爆款内容...');
    const result = this.analyzer.analyze(notes);
    console.log(`✅ 识别出 ${result.hotNotes.length} 篇爆款笔记`);
    return result;
  }

  /**
   * 导出数据
   * @param {Array} notes - 笔记列表
   * @param {string} filename - 导出文件名
   * @returns {Promise<string>} 文件路径
   */
  async export(notes, filename = 'xiaohongshu_data.xlsx') {
    console.log(`💾 导出数据到：${filename}`);
    const filepath = await this.exporter.export(notes, filename);
    console.log(`✅ 导出成功：${filepath}`);
    return filepath;
  }

  /**
   * 完整流程：搜索 -> 分析 -> 导出
   * @param {string} keyword - 搜索关键词
   * @param {string} filename - 导出文件名
   * @returns {Promise<Object>} 完整结果
   */
  async run(keyword, filename) {
    console.log('🚀 开始采集流程...\n');
    
    // 搜索
    const notes = await this.search(keyword);
    
    // 分析
    const analysis = this.analyze(notes);
    
    // 导出
    const filepath = await this.export(notes, filename);
    
    console.log('\n✅ 采集完成！');
    console.log(`📁 文件位置：${filepath}`);
    console.log(`🔥 爆款数量：${analysis.hotNotes.length}`);
    
    return {
      notes,
      analysis,
      filepath
    };
  }
}

// OpenClaw 技能入口
module.exports = {
  name: 'xiaohongshu-collector',
  version: '0.1.0',
  description: '小红书爆款采集',
  
  handlers: {
    async search({ keyword }) {
      const collector = new XiaohongshuCollector();
      return await collector.search(keyword);
    },
    
    async analyze({ keyword }) {
      const collector = new XiaohongshuCollector();
      const notes = await collector.search(keyword);
      return collector.analyze(notes);
    },
    
    async run({ keyword, filename }) {
      const collector = new XiaohongshuCollector();
      return await collector.run(keyword, filename || `${keyword}_笔记.xlsx`);
    }
  }
};
