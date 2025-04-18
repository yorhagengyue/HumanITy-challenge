const db = require('../models');
const HealthCalendarEvent = db.healthCalendarEvents;

// 检查最近的健康日历事件
async function checkRecentEvents() {
  try {
    // 连接数据库
    await db.sequelize.authenticate();
    console.log('数据库连接已建立');
    
    // 查询最近的健康日历事件
    const events = await HealthCalendarEvent.findAll({
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    
    console.log(`\n找到 ${events.length} 条健康日历事件:`);
    
    events.forEach(event => {
      console.log('\n' + '-'.repeat(50));
      console.log(`ID: ${event.id}`);
      console.log(`用户ID: ${event.user_id}`);
      console.log(`标题: ${event.title}`);
      console.log(`描述: ${event.description}`);
      console.log(`开始时间: ${event.start_time}`);
      console.log(`结束时间: ${event.end_time}`);
      console.log(`类别: ${event.category}`);
      console.log(`全天事件: ${event.all_day}`);
      console.log(`健康指标ID: ${event.health_metric_id}`);
    });
    
    // 检查当前月份(2025年4月)的事件
    const currentMonthStart = new Date('2025-04-01T00:00:00Z');
    const currentMonthEnd = new Date('2025-04-30T23:59:59Z');
    
    console.log('\n\n' + '='.repeat(50));
    console.log(`检查2025年4月的健康日历事件:`);
    
    const currentMonthEvents = await HealthCalendarEvent.findAll({
      where: {
        start_time: {
          [db.Sequelize.Op.between]: [currentMonthStart, currentMonthEnd]
        }
      },
      order: [['start_time', 'ASC']]
    });
    
    console.log(`\n找到 ${currentMonthEvents.length} 条4月份的事件:`);
    
    currentMonthEvents.forEach(event => {
      console.log('\n' + '-'.repeat(50));
      console.log(`ID: ${event.id}`);
      console.log(`用户ID: ${event.user_id}`);
      console.log(`标题: ${event.title}`);
      console.log(`开始时间: ${event.start_time}`);
      console.log(`类别: ${event.category}`);
    });
    
    // 关闭数据库连接
    await db.sequelize.close();
    console.log('\n数据库连接已关闭');
    
  } catch (err) {
    console.error('检查健康日历事件时出错:', err);
  }
}

// 执行检查
checkRecentEvents();
