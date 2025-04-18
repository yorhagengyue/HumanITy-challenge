// 脚本用于检查健康日历事件表的category字段定义
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCategoryEnum() {
  console.log('检查health_calendar_events表的category字段...');
  
  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mylife_db'
  });
  
  try {
    // 获取表结构中category字段的详细信息
    const [columns] = await connection.execute("SHOW COLUMNS FROM health_calendar_events WHERE Field = 'category'");
    
    console.log('Category字段定义:');
    console.log(columns[0]);
    
    // 从INFORMATION_SCHEMA中获取更多信息
    const [details] = await connection.execute(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'mylife_db'}' 
      AND TABLE_NAME = 'health_calendar_events' 
      AND COLUMN_NAME = 'category'
    `);
    
    console.log('\n详细信息:');
    console.log(details[0]);
    
  } catch (error) {
    console.error('查询字段定义时出错:', error);
  } finally {
    // 关闭数据库连接
    await connection.end();
    console.log('数据库连接已关闭');
  }
}

// 执行查询
checkCategoryEnum();
