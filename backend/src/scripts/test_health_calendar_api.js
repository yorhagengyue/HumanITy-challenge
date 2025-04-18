const http = require('http');

// 测试令牌
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzQ0OTk5MzE3LCJleHAiOjE3NDUwODU3MTd9.up03Xd5kI2tzfnKmELuqzNnv3pv0iJZ9mOia5Gv9P-A';

// 当前年月
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1; // JavaScript月份从0开始

// 发送API请求
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
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
            const parsedData = JSON.parse(data);
            resolve(parsedData);
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

// 测试健康日历API
async function testHealthCalendarAPI() {
  try {
    console.log('测试健康日历事件API...');
    
    // 1. 测试获取所有健康日历事件
    console.log('\n测试1: 获取所有健康日历事件');
    const allEvents = await makeRequest('/api/health/calendar/events');
    console.log(`API返回 ${allEvents.length} 条健康日历事件`);
    if (allEvents.length > 0) {
      console.log('示例事件:');
      console.log(`- 标题: ${allEvents[0].title}`);
      console.log(`- 开始时间: ${new Date(allEvents[0].start_time).toLocaleString()}`);
      console.log(`- 类别: ${allEvents[0].category.name}`);
    }
    
    // 2. 测试获取月度健康日历事件
    console.log('\n测试2: 获取月度健康日历事件');
    const monthPath = `/api/health/calendar/events/month/${currentYear}/${currentMonth}`;
    console.log(`请求路径: ${monthPath}`);
    const monthEvents = await makeRequest(monthPath);
    console.log(`API返回 ${monthEvents.length} 条月度健康日历事件`);
    
    if (monthEvents.length > 0) {
      console.log('\n月度健康日历事件:');
      monthEvents.forEach((event, index) => {
        console.log(`\n[${index + 1}] ${event.title}`);
        console.log(`  - 开始时间: ${new Date(event.start_time).toLocaleString()}`);
        console.log(`  - 结束时间: ${new Date(event.end_time).toLocaleString()}`);
        console.log(`  - 类别: ${event.category.name}`);
      });
    }
    
    console.log('\n测试结束');
    console.log('前端集成建议: 使用 /api/health/calendar/events/month/:year/:month 端点获取健康日历事件');
    
  } catch (err) {
    console.error('测试过程中出错:', err.message);
  }
}

// 执行测试
testHealthCalendarAPI();
