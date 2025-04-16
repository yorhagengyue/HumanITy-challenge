-- 创建数据库
CREATE DATABASE IF NOT EXISTS mylife_companion_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE mylife_companion_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- 创建用户偏好设置表
CREATE TABLE IF NOT EXISTS user_preferences (
  preference_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  theme_mode ENUM('light', 'dark', 'system') DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'en',
  notification_settings JSON,
  privacy_settings JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建任务分类表
CREATE TABLE IF NOT EXISTS task_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#2196f3',
  icon VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'archived') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  category_id INT,
  due_date DATETIME NULL,
  reminder_time DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES task_categories(category_id) ON DELETE SET NULL
);

-- 创建日历事件分类表
CREATE TABLE IF NOT EXISTS calendar_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#4caf50',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建日历事件表
CREATE TABLE IF NOT EXISTS calendar_events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  category_id INT,
  recurrence_rule VARCHAR(255),
  reminder_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES calendar_categories(category_id) ON DELETE SET NULL
);

-- 创建健康指标数据表
CREATE TABLE IF NOT EXISTS health_metrics (
  metric_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  metric_type ENUM('sleep', 'exercise', 'screen_time', 'water', 'weight', 'other') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  recorded_at DATETIME NOT NULL,
  notes TEXT,
  source VARCHAR(50) DEFAULT 'manual',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建情绪日志表
CREATE TABLE IF NOT EXISTS mood_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood_score INT NOT NULL,
  energy_level INT,
  notes TEXT,
  factors JSON,
  recorded_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建情绪支持对话表
CREATE TABLE IF NOT EXISTS support_chats (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  is_user_message BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  related_resources JSON,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建学习目标表
CREATE TABLE IF NOT EXISTS learning_goals (
  goal_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  target_date DATE,
  progress INT DEFAULT 0,
  status ENUM('active', 'completed', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建通知表
CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  related_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 创建默认数据
-- 默认用户
INSERT INTO users (username, email, password_hash, full_name) 
VALUES ('demo_user', 'demo@example.com', '$2b$10$rNCLvACAKgom92c/3GX1xeGRUEzDnk2vXxcz.egJG8Wy2HJCdHVyu', 'Demo User');

-- 默认任务分类
INSERT INTO task_categories (user_id, name, color, icon)
VALUES 
(1, '学校', '#2196f3', 'school'),
(1, '工作', '#f44336', 'work'),
(1, '个人', '#4caf50', 'person'),
(1, '健康', '#ff9800', 'fitness_center');

-- 默认日历分类
INSERT INTO calendar_categories (user_id, name, color)
VALUES 
(1, '学习', '#2196f3'),
(1, '考试', '#f44336'),
(1, '约会', '#4caf50'),
(1, '健身', '#ff9800');

-- 默认任务
INSERT INTO tasks (user_id, title, description, status, priority, category_id, due_date)
VALUES 
(1, '完成数学作业', '完成微积分第3章习题', 'pending', 'high', 1, DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY)),
(1, '准备英语演讲', '准备下周英语课的5分钟演讲', 'pending', 'medium', 1, DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY)),
(1, '学习编程', '学习React基础知识', 'in_progress', 'medium', 3, DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY));

-- 默认日历事件
INSERT INTO calendar_events (user_id, title, description, location, start_time, end_time, category_id)
VALUES 
(1, '数学期中考试', '微积分期中考试', '主教学楼204', DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), 2),
(1, '学习小组会议', '讨论物理作业', '图书馆3楼', DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), 1);

-- 默认健康数据
INSERT INTO health_metrics (user_id, metric_type, value, unit, recorded_at)
VALUES 
(1, 'sleep', 7.5, 'hours', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)),
(1, 'exercise', 45, 'minutes', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)),
(1, 'screen_time', 4.5, 'hours', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY));

-- 默认情绪记录
INSERT INTO mood_logs (user_id, mood_score, energy_level, notes, recorded_at)
VALUES 
(1, 85, 70, '今天感觉不错，完成了计划中的大部分任务', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)),
(1, 90, 80, '今天非常有精力，顺利完成了所有计划', CURRENT_DATE());

-- 默认学习目标
INSERT INTO learning_goals (user_id, title, description, category, target_date, progress)
VALUES 
(1, '学习React', '掌握React基础知识并创建一个小项目', '编程', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 20),
(1, '准备英语考试', '提高英语水平，准备下个月的英语等级考试', '语言', DATE_ADD(CURRENT_DATE(), INTERVAL 25 DAY), 35); 