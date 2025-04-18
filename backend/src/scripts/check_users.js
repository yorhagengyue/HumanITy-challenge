// 脚本用于检查数据库中的用户
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  console.log('检查users表...');
  
  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mylife_db'
  });
  
  try {
    // 查询users表
    const [rows] = await connection.execute('SELECT * FROM users');
    
    console.log('当前users表中的用户:');
    console.table(rows);
    
    // 同时检查health_metrics表中有哪些user_id
    const [healthMetrics] = await connection.execute('SELECT DISTINCT user_id FROM health_metrics');
    
    console.log('health_metrics表中引用的user_id:');
    console.table(healthMetrics);
    
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    // 关闭数据库连接
    await connection.end();
    console.log('数据库连接已关闭');
  }
}

// 执行查询
checkUsers();
