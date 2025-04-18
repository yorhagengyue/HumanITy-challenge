const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import SQL database connection
const db = require('./models');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use('/static/images/avatar', express.static(path.join(__dirname, '../uploads/avatars')));

// API Health Check Route
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!'
  });
});

// Start server function
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
};

// Register routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/task.routes')(app);
require('./routes/calendar.routes')(app);
require('./routes/health.routes')(app);

// 添加其他路由
try {
  if (fs.existsSync(path.join(__dirname, 'routes/healthCalendar.routes.js'))) {
    require('./routes/healthCalendar.routes')(app);
  }
  if (fs.existsSync(path.join(__dirname, 'routes/healthMetric.routes.js'))) {
    require('./routes/healthMetric.routes')(app);
  }
} catch (err) {
  console.error('Error loading additional routes:', err);
}

// TODO: 随着开发进度添加更多路由
// require('./routes/mood.routes')(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Choose whether to sync SQL database before starting based on environment variable
if (process.env.SYNC_DB === 'true') {
  // Sync SQL database and start server
  db.sequelize.sync({ force: false }).then(() => { // 改回force:false避免重复删除表
    console.log("SQL database synchronized");
    startServer();
  }).catch(err => {
    console.error("SQL database synchronization failed:", err.message);
    startServer(); // Even if SQL database sync fails, start server
  });
} else {
  // Start server directly without syncing SQL database
  startServer();
} 