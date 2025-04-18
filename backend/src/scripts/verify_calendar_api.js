const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// 测试令牌 (需要替换为有效的令牌)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzQ0OTk5MzE3LCJleHAiOjE3NDUwODU3MTd9.up03Xd5kI2tzfnKmELuqzNnv3pv0iJZ9mOia5Gv9P-A';

// 当前年月
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1; // JavaScript月份从0开始

// API基础URL
const API_URL = 'http://localhost:8000/api';

// 验证日历API返回
async function verifyCalendarAPI() {
  try {
    console.log('开始验证日历API...');
    
    // 测试月度事件API
    console.log(`\n获取 ${currentYear}年${currentMonth}月 的日历事件:`);
    const monthEventsResponse = await axios.get(
      `${API_URL}/calendar/events/month/${currentYear}/${currentMonth}`,
      {
        headers: { 'x-access-token': TEST_TOKEN }
      }
    );
    
    const monthEvents = monthEventsResponse.data;
    console.log(`找到 ${monthEvents.length} 条月度事件:`);
    
    // 区分普通事件和健康事件
    const regularEvents = monthEvents.filter(event => !event.isHealthEvent);
    const healthEvents = monthEvents.filter(event => event.isHealthEvent);
    
    console.log(`- 普通日历事件: ${regularEvents.length} 条`);
    console.log(`- 健康日历事件: ${healthEvents.length} 条`);
    
    // 显示所有健康日历事件详情
    if (healthEvents.length > 0) {
      console.log('\n健康日历事件详情:');
      healthEvents.forEach((event, index) => {
        console.log(`\n[${index + 1}] ${event.title}`);
        console.log(`  - 开始时间: ${new Date(event.start_time).toLocaleString()}`);
        console.log(`  - 结束时间: ${new Date(event.end_time).toLocaleString()}`);
        console.log(`  - 类别: ${event.category.name}`);
        console.log(`  - 健康指标ID: ${event.health_metric_id}`);
      });
    }
    
    // 测试所有事件API
    console.log('\n\n获取所有日历事件:');
    const allEventsResponse = await axios.get(
      `${API_URL}/calendar/events`,
      {
        headers: { 'x-access-token': TEST_TOKEN }
      }
    );
    
    const allEvents = allEventsResponse.data;
    console.log(`找到 ${allEvents.length} 条事件:`);
    
    // 区分普通事件和健康事件
    const allRegularEvents = allEvents.filter(event => !event.isHealthEvent);
    const allHealthEvents = allEvents.filter(event => event.isHealthEvent);
    
    console.log(`- 普通日历事件: ${allRegularEvents.length} 条`);
    console.log(`- 健康日历事件: ${allHealthEvents.length} 条`);
    
    console.log('\n验证完成! 请刷新前端页面查看健康日历事件是否显示。');
    
  } catch (error) {
    console.error('验证过程中出错:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 执行验证
verifyCalendarAPI();
