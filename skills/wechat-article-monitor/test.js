/**
 * 公众号监控技能测试脚本
 */

const Monitor = require('./src/monitor');
const Notifier = require('./src/notifier');
const Storage = require('./src/storage');

async function runTest() {
  console.log('🧪 开始测试公众号文章监控技能\n');
  console.log('='.repeat(60));
  
  try {
    // 创建实例
    const monitor = new Monitor({
      maxArticles: 5
    });
    const notifier = new Notifier({
      notifyEnabled: true
    });
    const storage = new Storage({
      dataDir: './data'
    });
    
    // 测试 1：获取公众号信息
    console.log('\n📝 测试 1: 获取公众号信息');
    console.log('-'.repeat(60));
    
    const accountInfo = await monitor.getAccountInfo('36氪');
    console.log('\n✅ 公众号信息:');
    console.log(`   名称: ${accountInfo.name}`);
    console.log(`   ID: ${accountInfo.id}`);
    console.log(`   描述: ${accountInfo.description}`);
    
    // 测试 2：获取最新文章
    console.log('\n\n📝 测试 2: 获取最新文章');
    console.log('-'.repeat(60));
    
    const articles = await monitor.fetchLatestArticles(accountInfo.id, 5);
    console.log(`\n✅ 获取到 ${articles.length} 篇文章`);
    
    if (articles.length > 0) {
      console.log('\n📋 最新文章:');
      articles.slice(0, 3).forEach((article, i) => {
        console.log(`\n${i + 1}. 《${article.title}》`);
        console.log(`   📅 ${article.publishTime}`);
        console.log(`   👁 ${article.readCount || 0} 阅读`);
        console.log(`   👍 ${article.likeCount || 0} 点赞`);
        console.log(`   🔗 ${article.url}`);
      });
    }
    
    // 测试 3：保存文章
    console.log('\n\n📝 测试 3: 保存文章到本地');
    console.log('-'.repeat(60));
    
    await storage.saveArticles(accountInfo.id, articles);
    console.log('\n✅ 文章已保存');
    
    // 测试 4：读取文章
    console.log('\n\n📝 测试 4: 从本地读取文章');
    console.log('-'.repeat(60));
    
    const savedArticles = await storage.getArticles(accountInfo.id);
    console.log(`\n✅ 读取到 ${savedArticles.length} 篇文章`);
    
    // 测试 5：发送通知
    console.log('\n\n📝 测试 5: 发送通知');
    console.log('-'.repeat(60));
    
    await notifier.sendNotification(accountInfo, articles.slice(0, 2));
    
    // 测试 6：添加公众号到列表
    console.log('\n\n📝 测试 6: 添加公众号到监控列表');
    console.log('-'.repeat(60));
    
    await storage.addAccount({
      name: accountInfo.name,
      id: accountInfo.id,
      addedAt: new Date().toISOString()
    });
    
    const accounts = await storage.getAccounts();
    console.log(`\n✅ 监控列表中有 ${accounts.length} 个公众号`);
    
    if (accounts.length > 0) {
      console.log('\n📋 公众号列表:');
      accounts.forEach((account, i) => {
        console.log(`\n${i + 1}. ${account.name}`);
        console.log(`   ID: ${account.id}`);
        console.log(`   添加时间: ${account.addedAt}`);
      });
    }
    
    // 总结
    console.log('\n' + '='.repeat(60));
    console.log('✅ 所有测试通过！');
    console.log('='.repeat(60));
    
    return {
      success: true,
      accountsCount: accounts.length,
      articlesCount: articles.length
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
