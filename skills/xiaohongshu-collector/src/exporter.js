/**
 * 数据导出模块
 * 
 * 将采集的数据导出为 Excel/CSV 格式
 */

const path = require('path');
const fs = require('fs');

class Exporter {
  constructor(config = {}) {
    this.config = config;
    this.exportFormat = config.exportFormat || 'excel';
    this.outputDir = config.outputDir || './exports';
    
    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 导出数据
   * @param {Array} notes - 笔记列表
   * @param {string} filename - 文件名
   * @returns {Promise<string>} 文件路径
   */
  async export(notes, filename = 'xiaohongshu_data.xlsx') {
    const format = path.extname(filename).toLowerCase();
    
    if (format === '.csv') {
      return this._exportCSV(notes, filename);
    } else {
      return this._exportExcel(notes, filename);
    }
  }

  /**
   * 导出为 Excel
   * @private
   */
  async _exportExcel(notes, filename) {
    try {
      // 简化版 Excel 导出（实际使用时需要安装 exceljs 库）
      const filepath = path.join(this.outputDir, filename);
      
      // 生成 CSV 内容作为替代
      const csvContent = this._generateCSV(notes);
      fs.writeFileSync(filepath.replace('.xlsx', '.csv'), csvContent);
      
      // 如果有 exceljs，可以生成真正的 Excel 文件
      try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('笔记数据');
        
        // 添加表头
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 25 },
          { header: '标题', key: 'title', width: 50 },
          { header: '内容', key: 'content', width: 100 },
          { header: '点赞', key: 'likes', width: 10 },
          { header: '收藏', key: 'collects', width: 10 },
          { header: '评论', key: 'comments', width: 10 },
          { header: '作者', key: 'author', width: 20 },
          { header: '创建时间', key: 'createdAt', width: 20 },
          { header: '链接', key: 'url', width: 50 }
        ];
        
        // 添加数据
        notes.forEach(note => {
          worksheet.addRow({
            id: note.id,
            title: note.title,
            content: note.content?.substring(0, 100) || '',
            likes: note.likes,
            collects: note.collects,
            comments: note.comments,
            author: note.author?.nickname || '',
            createdAt: note.createdAt,
            url: note.url
          });
        });
        
        await workbook.xlsx.writeFile(filepath);
        console.log('✅ Excel 文件生成成功');
        
      } catch (excelError) {
        console.log('⚠️ exceljs 未安装，已导出为 CSV 格式');
      }
      
      return filepath;
      
    } catch (error) {
      console.error('导出失败:', error.message);
      throw new Error(`导出失败：${error.message}`);
    }
  }

  /**
   * 导出为 CSV
   * @private
   */
  _exportCSV(notes, filename) {
    try {
      const filepath = path.join(this.outputDir, filename);
      const csvContent = this._generateCSV(notes);
      fs.writeFileSync(filepath, csvContent, 'utf-8');
      return filepath;
    } catch (error) {
      console.error('CSV 导出失败:', error.message);
      throw new Error(`CSV 导出失败：${error.message}`);
    }
  }

  /**
   * 生成 CSV 内容
   * @private
   */
  _generateCSV(notes) {
    const headers = ['ID', '标题', '内容', '点赞', '收藏', '评论', '作者', '创建时间', '链接'];
    
    const rows = notes.map(note => [
      note.id,
      this._escapeCSV(note.title),
      this._escapeCSV(note.content?.substring(0, 200) || ''),
      note.likes,
      note.collects,
      note.comments,
      this._escapeCSV(note.author?.nickname || ''),
      note.createdAt,
      note.url
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
    // 如果包含逗号、引号或换行，用引号包裹
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  /**
   * 导出分析报告
   * @param {Object} analysis - 分析结果
   * @param {string} filename - 文件名
   * @returns {string} 文件路径
   */
  exportReport(analysis, filename = 'analysis_report.txt') {
    try {
      const Analyzer = require('./analyzer');
      const analyzer = new Analyzer();
      const report = analyzer.generateReport(analysis);
      
      const filepath = path.join(this.outputDir, filename);
      fs.writeFileSync(filepath, report, 'utf-8');
      
      return filepath;
    } catch (error) {
      console.error('报告导出失败:', error.message);
      throw new Error(`报告导出失败：${error.message}`);
    }
  }
}

module.exports = Exporter;
