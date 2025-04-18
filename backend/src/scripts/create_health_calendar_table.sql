-- 使用正确的数据库
USE mylife_db;

-- 创建健康日历事件表
CREATE TABLE IF NOT EXISTS health_calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  category ENUM('medication', 'appointment', 'exercise', 'diet', 'measurement', 'other', 'sleep', 'weight', 'bloodPressure', 'heartRate', 'water') DEFAULT 'other',
  color VARCHAR(20) DEFAULT '#3788d8',
  all_day BOOLEAN DEFAULT FALSE,
  health_metric_id INT,
  metric_value FLOAT,
  recurrence_frequency ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
  recurrence_interval INT DEFAULT 1,
  recurrence_end_date DATETIME,
  reminder_time INT,
  reminder_type ENUM('notification', 'email', 'sms') DEFAULT 'notification',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (health_metric_id) REFERENCES health_metrics(id) ON DELETE SET NULL,
  INDEX user_start_idx (user_id, start_time),
  INDEX user_category_idx (user_id, category),
  INDEX metric_idx (health_metric_id)
);
