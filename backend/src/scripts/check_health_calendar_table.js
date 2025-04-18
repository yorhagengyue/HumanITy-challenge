// 脚本用于检查健康日历事件表结构
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkHealthCalendarTable() {
  console.log('检查health_calendar_events表结构...');
  
  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mylife_db'
  });
  
  try {
    // 获取表结构
    const [columns] = await connection.execute('SHOW COLUMNS FROM health_calendar_events');
    
    console.log('健康日历事件表的列结构:');
    console.table(columns);
    
    // 检查表的索引
    const [indexes] = await connection.execute('SHOW INDEX FROM health_calendar_events');
    
    console.log('健康日历事件表的索引:');
    console.table(indexes);
    
  } catch (error) {
    console.error('查询表结构时出错:', error);
  } finally {
    // 关闭数据库连接
    await connection.end();
    console.log('数据库连接已关闭');
  }
}

// 执行查询
checkHealthCalendarTable();
