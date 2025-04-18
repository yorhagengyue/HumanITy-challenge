// 脚本用于创建测试用户
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
  console.log('开始创建测试用户...');
  
  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mylife_db'
  });
  
  try {
    // 生成密码哈希
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    // 插入测试用户
    const [result] = await connection.execute(
      'INSERT INTO users (id, username, email, password_hash, full_name, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)',
      [4, 'testuser', 'test@example.com', passwordHash, 'Test User', 'active']
    );
    
    console.log('测试用户创建成功！');
    console.log('用户ID:', result.insertId || 4);
    
    // 添加日历分类
    await connection.execute(
      'INSERT INTO calendar_categories (user_id, name, color) VALUES (?, ?, ?)',
      [4, '学习', '#2196F3']
    );
    
    await connection.execute(
      'INSERT INTO calendar_categories (user_id, name, color) VALUES (?, ?, ?)',
      [4, '健康', '#4CAF50']
    );
    
    console.log('日历分类创建成功！');
    
  } catch (error) {
    console.error('创建测试用户时出错:', error);
  } finally {
    // 关闭数据库连接
    await connection.end();
    console.log('数据库连接已关闭');
  }
}

// 执行创建用户操作
createTestUser();
