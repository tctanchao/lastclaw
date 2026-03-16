/**
 * 技能测试脚本
 */

const XiaohongshuCollector = require('./src/index').default || require('./src/index');
const Collector = require('./src/collector');
const Analyzer = require('./src/analyzer');
const Exporter = require('./src/exporter');

async function runTest() {
  console.log('🧪 开始测试小红书爆款采集技能\n');
  console.log('='.repeat(60));
  
  try {
    // 创建技能实例
    const collector = new Collector({
      searchLimit: 10,
      minLikes: 5000
    });
    const analyzer = new Analyzer({
      minLikes: 5000
    });
    const exporter = new Exporter();
    
    // 测试搜索
    console.log('\n📝 测试 1: 搜索笔记');
    console.log('-'.repeat(60));
    const keyword = '护肤心得';
    console.log(`搜索关键词：${keyword}`);
    
    const notes = await collector.search(keyword);
    console.log(`✅ 找到 ${notes.length} 篇笔记`);
    
    // 显示前 3 篇笔记
    console.log('\n📋 笔记示例:');
    notes.slice(0, 3).forEach((note, i) => {
      console.log(`\n${i + 1}. 《${note.title}》`);
      console.log(`   👍 ${note.likes}  ⭐ ${note.collects}  💬 ${note.comments}`);
      console.log(`   作者：${note.author.nickname}`);
    });
    
    // 测试分析
    console.log('\n\n📊 测试 2: 爆款分析');
    console.log('-'.repeat(60));
    const analysis = analyzer.analyze(notes);
    
    console.log(`总笔记数：${analysis.total}`);
    console.log(`爆款数量：${analysis.hotNotes.length} (点赞 >= ${collector.config.minLikes})`);
    console.log(`平均点赞：${analysis.avgLikes}`);
    console.log(`平均收藏：${analysis.avgCollects}`);
    console.log(`平均评论：${analysis.avgComments}`);
    
    // 显示爆款
    if (analysis.hotNotes.length > 0) {
      console.log('\n🔥 爆款笔记 TOP 3:');
      analysis.hotNotes.slice(0, 3).forEach((note, i) => {
        console.log(`\n${i + 1}. 《${note.title}》`);
        console.log(`   👍 ${note.likes}  ⭐ ${note.collects}  💬 ${note.comments}`);
        console.log(`   互动率：${(note.likes + note.collects + note.comments).toLocaleString()}`);
      });
    }
    
    // 显示关键词分析
    if (analysis.keywordAnalysis.length > 0) {
      console.log('\n🏷️ 高频关键词:');
      analysis.keywordAnalysis.slice(0, 5).forEach((kw, i) => {
        console.log(`   ${i + 1}. ${kw.word} (${kw.count}次)`);
      });
    }
    
    // 测试导出
    console.log('\n\n💾 测试 3: 数据导出');
    console.log('-'.repeat(60));
    const filename = `test_${keyword}_${Date.now()}.csv`;
    const filepath = await exporter.export(notes, filename);
    console.log(`✅ 导出成功：${filepath}`);
    
    // 总结
    console.log('\n' + '='.repeat(60));
    console.log('✅ 所有测试通过！');
    console.log('='.repeat(60));
    
    return {
      success: true,
      notesCount: notes.length,
      hotNotesCount: analysis.hotNotes.length,
      exportFile: filepath
    };
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error.stack);
    return {
      success: false,
      error: error.message
    };
  }
}

// 运行测试
runTest().then(result => {
  console.log('\n测试结果:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
});
