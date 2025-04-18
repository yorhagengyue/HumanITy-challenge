const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../config/db.config.js');

// 创建Sequelize实例
const sequelize = new Sequelize(
  dbConfig.sqlConfig.DB, 
  dbConfig.sqlConfig.USER || '', 
  dbConfig.sqlConfig.PASSWORD || '', 
  {
    host: dbConfig.sqlConfig.HOST,
    dialect: dbConfig.sqlConfig.dialect || 'mysql',
    port: dbConfig.sqlConfig.PORT,
    pool: dbConfig.sqlConfig.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 动态加载模型
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file !== 'healthCalendar.model.js' // 排除冗余模型文件
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// 手动导入模型
db.users = require('./user.model.js')(sequelize, Sequelize);
db.userPreferences = require('./userPreference.model.js')(sequelize, Sequelize);
db.taskCategories = require('./taskCategory.model.js')(sequelize, Sequelize);
db.tasks = require('./task.model.js')(sequelize, Sequelize);
db.calendarCategories = require('./calendarCategory.model.js')(sequelize, Sequelize);
db.calendarEvents = require('./calendarEvent.model.js')(sequelize, Sequelize);
db.healthMetrics = require('./healthMetric.model.js')(sequelize, Sequelize);
db.healthCalendarEvents = require('./healthCalendarEvent.model.js')(sequelize, Sequelize);
db.moodLogs = require('./moodLog.model.js')(sequelize, Sequelize);

// 关联模型
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 设置关联关系
db.users.hasMany(db.healthMetrics, { foreignKey: 'user_id' });
db.healthMetrics.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasMany(db.healthCalendarEvents, { foreignKey: 'user_id' });
db.healthCalendarEvents.belongsTo(db.users, { foreignKey: 'user_id' });

db.healthMetrics.hasMany(db.healthCalendarEvents, { foreignKey: 'health_metric_id' });
db.healthCalendarEvents.belongsTo(db.healthMetrics, { foreignKey: 'health_metric_id' });

// 添加日历事件和类别之间的关联关系
db.calendarCategories.hasMany(db.calendarEvents, { foreignKey: 'category_id', as: 'category' });
db.calendarEvents.belongsTo(db.calendarCategories, { foreignKey: 'category_id', as: 'category' });

// 用户与日历事件和类别的关联
db.users.hasMany(db.calendarEvents, { foreignKey: 'user_id' });
db.calendarEvents.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasMany(db.calendarCategories, { foreignKey: 'user_id' });
db.calendarCategories.belongsTo(db.users, { foreignKey: 'user_id' });

module.exports = db;