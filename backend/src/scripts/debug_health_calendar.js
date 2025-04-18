const db = require('../models');
const HealthCalendarEvent = db.healthCalendarEvents;

// 调试健康日历事件
async function debugHealthCalendarEvents() {
  try {
    await db.sequelize.authenticate();
    console.log('数据库连接成功');

    // 简单检查模型是否正确定义
    console.log('\n健康日历事件模型检查:');
    console.log('表名:', HealthCalendarEvent.tableName);
    console.log('主键:', Object.keys(HealthCalendarEvent.primaryKeys)[0]);
    console.log('模型属性:');
    const attributes = Object.keys(HealthCalendarEvent.rawAttributes);
    console.log(attributes);

    // 检查数据
    const events = await HealthCalendarEvent.findAll({ limit: 10 });
    console.log(`\n找到 ${events.length} 条健康日历事件:`);
    
    if (events.length > 0) {
      console.log('\n第一条事件详情:');
      const firstEvent = events[0];
      console.log('ID:', firstEvent.id);
      console.log('用户ID:', firstEvent.user_id);
      console.log('标题:', firstEvent.title);
      console.log('开始时间:', firstEvent.start_time);
      console.log('结束时间:', firstEvent.end_time);
      console.log('类别:', firstEvent.category);
      
      // 直接检查4月份的事件
      const april2025Start = new Date('2025-04-01');
      const april2025End = new Date('2025-04-30');
      
      console.log('\n\n检查2025年4月的事件:');
      console.log('开始日期:', april2025Start);
      console.log('结束日期:', april2025End);
      
      // 在特定范围内查询
      const aprilEvents = await db.sequelize.query(
        'SELECT * FROM health_calendar_events WHERE start_time BETWEEN ? AND ?',
        {
          replacements: [april2025Start, april2025End],
          type: db.sequelize.QueryTypes.SELECT
        }
      );
      
      console.log(`找到 ${aprilEvents.length} 条4月事件`);
      if (aprilEvents.length > 0) {
        console.log(aprilEvents.map(e => `${e.title} (${new Date(e.start_time).toLocaleString()})`));
      }
    }
    
    await db.sequelize.close();
    console.log('\n数据库连接已关闭');
    
  } catch (err) {
    console.error('调试过程中出错:', err);
  }
}

// 执行调试
debugHealthCalendarEvents();
