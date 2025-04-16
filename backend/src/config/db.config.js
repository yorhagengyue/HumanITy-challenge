require('dotenv').config();

// MongoDB 配置
const mongoConfig = {
  HOST: process.env.MONGO_HOST || "localhost",
  PORT: process.env.MONGO_PORT || 27017,
  DB: process.env.MONGO_DB || "mylifecompanion",
  // 如果设置为true，将使用内存型MongoDB
  USE_MEMORY_SERVER: process.env.USE_MONGO_MEMORY === "true" || false,
  USER: process.env.MONGO_USER || "",
  PASSWORD: process.env.MONGO_PASSWORD || "",
  // MongoDB连接选项
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};

// MySQL/Sequelize 配置
const sqlConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "mylife_db",
  PORT: process.env.DB_PORT || 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// 导出两种配置
module.exports = {
  ...mongoConfig,
  sqlConfig,
  mongoConfig
}; 