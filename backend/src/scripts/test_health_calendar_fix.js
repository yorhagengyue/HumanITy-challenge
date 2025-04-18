const db = require('../models');
const HealthMetric = db.healthMetrics;
const HealthCalendarEvent = db.healthCalendarEvents;

// 用于测试的用户ID（根据您的数据库调整）
const TEST_USER_ID = 4;

// 测试创建健康指标和相应的日历事件
async function testCreateHealthWithCalendar() {
  try {
    await db.sequelize.authenticate();
    console.log('数据库连接已建立');
    
    // 测试不同类型的健康指标
    const testTypes = [
      { type: 'sleep', value: 8, unit: '小时', notes: '测试睡眠记录' },
      { type: 'weight', value: 70, unit: 'kg', notes: '测试体重记录' },
      { type: 'exercise', value: 45, unit: '分钟', notes: '测试运动记录' },
      { type: 'water', value: 1500, unit: 'ml', notes: '测试饮水记录' }
    ];
    
    for (const test of testTypes) {
      console.log(`\n测试创建健康指标: ${test.type}`);
      
      // 先创建健康指标
      const metric = await HealthMetric.create({
        user_id: TEST_USER_ID,
        type: test.type,
        value: test.value,
        unit: test.unit || '',
        notes: test.notes || ''
      });
      
      console.log(`健康指标创建成功: ${test.type}, ID: ${metric.id}`);
      
      // 设置日历事件标题
      let title = `${test.type}记录: ${test.value}${test.unit}`;
      
      // 创建健康日历事件
      const now = new Date();
      const eventEnd = new Date(now.getTime() + 30 * 60000); // 默认事件持续30分钟
      
      try {
        // 直接使用健康类型作为类别（依赖模型钩子进行自动转换）
        const event = await HealthCalendarEvent.create({
          user_id: TEST_USER_ID,
          title,
          description: test.notes || `${test.type}记录`,
          start_time: now,
          end_time: eventEnd,
          all_day: false,
          category: test.type, // 直接使用健康类型作为类别
          color: '#3788d8',
          health_metric_id: metric.id,
          metric_value: test.value,
          recurrence_frequency: 'none',
          recurrence_interval: 1,
          reminder_type: 'notification'
        });
        
        console.log(`健康日历事件创建成功: ID: ${event.id}, 类别: ${event.category}`);
      } catch (calendarErr) {
        console.error(`创建健康日历事件失败 (${test.type}):`, calendarErr);
      }
    }
    
    // 查询创建的日历事件进行验证
    const events = await HealthCalendarEvent.findAll({
      where: { user_id: TEST_USER_ID },
      order: [['created_at', 'DESC']],
      limit: 10
    });
    
    console.log('\n最近创建的健康日历事件:');
    events.forEach(event => {
      console.log(`ID: ${event.id}, 标题: ${event.title}, 类别: ${event.category}, 指标ID: ${event.health_metric_id}`);
    });
    
    await db.sequelize.close();
    console.log('\n数据库连接已关闭');
    
  } catch (err) {
    console.error('测试过程中发生错误:', err);
  }
}

// 执行测试
testCreateHealthWithCalendar();
