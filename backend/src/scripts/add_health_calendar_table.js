// 脚本用于手动创建健康日历事件表
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createHealthCalendarTable() {
  console.log('开始创建健康日历事件表...');
  
  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mylife_db'
  });
  
  try {
    // 健康日历事件表SQL
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS health_calendar_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      category VARCHAR(50) DEFAULT 'other',
      color VARCHAR(20) DEFAULT '#3788d8',
      all_day BOOLEAN DEFAULT FALSE,
      health_metric_id INT,
      metric_value FLOAT,
      recurrence_frequency VARCHAR(20) DEFAULT 'none',
      recurrence_interval INT DEFAULT 1,
      recurrence_end_date DATETIME,
      reminder_time INT,
      reminder_type VARCHAR(20) DEFAULT 'notification',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (health_metric_id) REFERENCES health_metrics(id) ON DELETE SET NULL
    )`;
    
    // 执行SQL
    await connection.execute(createTableSQL);
    console.log('健康日历事件表创建成功！');
    
  } catch (error) {
    console.error('创建表时出错:', error);
  } finally {
    // 关闭数据库连接
    await connection.end();
    console.log('数据库连接已关闭');
  }
}

// 执行创建表操作
createHealthCalendarTable();
