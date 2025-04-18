// 测试日历API返回健康日历事件的脚本
const http = require('http');

// 测试令牌
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzQ0OTk5MzE3LCJleHAiOjE3NDUwODU3MTd9.up03Xd5kI2tzfnKmELuqzNnv3pv0iJZ9mOia5Gv9P-A';

// 当前年月
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1; // JavaScript月份从0开始

// 获取月度日历事件
function getMonthEvents() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/api/calendar/events/month/${currentYear}/${currentMonth}`,
      method: 'GET',
      headers: {
        'x-access-token': TEST_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const events = JSON.parse(data);
            resolve(events);
          } catch (err) {
            reject(new Error(`解析响应失败: ${err.message}`));
          }
        } else {
          reject(new Error(`请求失败，状态码: ${res.statusCode}, 响应: ${data}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`请求出错: ${err.message}`));
    });
    
    req.end();
  });
}

// 测试日历API
async function testCalendarAPI() {
  try {
    console.log('测试月度日历事件API...');
    console.log(`获取 ${currentYear}年${currentMonth}月 的日历事件`);
    
    const events = await getMonthEvents();
    console.log(`API返回 ${events.length} 条事件`);
    
    // 区分普通事件和健康事件
    const regularEvents = events.filter(event => !event.isHealthEvent);
    const healthEvents = events.filter(event => event.isHealthEvent);
    
    console.log(`普通日历事件: ${regularEvents.length} 条`);
    console.log(`健康日历事件: ${healthEvents.length} 条`);
    
    // 显示健康日历事件详情
    if (healthEvents.length > 0) {
      console.log('\n健康日历事件:');
      healthEvents.forEach((event, index) => {
        console.log(`\n事件 ${index + 1}:`);
        console.log(`- 标题: ${event.title}`);
        console.log(`- 开始: ${new Date(event.start_time).toLocaleString()}`);
        console.log(`- 类别: ${event.category.name}`);
      });
      console.log('\n修改成功! 前端应该能够显示这些健康日历事件了。');
    } else {
      console.log('\n未发现健康日历事件，请检查健康指标数据是否创建成功。');
    }
    
  } catch (err) {
    console.error('测试过程中出错:', err.message);
  }
}

// 执行测试
testCalendarAPI();
