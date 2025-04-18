const db = require('../models');
const HealthMetric = db.healthMetrics;
const HealthCalendarEvent = db.healthCalendarEvents; 
const { Op } = db.Sequelize;
const User = require('../models/user.model');

// Get all health metrics for a user
exports.findAll = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const metrics = await HealthMetric.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      total: metrics.count,
      metrics: metrics.rows,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(metrics.count / limit)
    });
  } catch (err) {
    console.error('Error getting health metrics:', err);
    res.status(500).json({ message: 'Failed to get health metrics' });
  }
};

// Get metrics by type
exports.findByType = async (req, res) => {
  try {
    const userId = req.userId;
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const metrics = await HealthMetric.findAndCountAll({
      where: { 
        user_id: userId,
        type
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      total: metrics.count,
      metrics: metrics.rows,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(metrics.count / limit)
    });
  } catch (err) {
    console.error(`Error getting ${req.params.type} metrics:`, err);
    res.status(500).json({ message: `Failed to get ${req.params.type} metrics` });
  }
};

// Get health metric by ID
exports.findOne = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const metric = await HealthMetric.findOne({
      where: { 
        id,
        user_id: userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: 'Health metric not found' });
    }
    
    res.status(200).json(metric);
  } catch (err) {
    console.error('Error getting health metric:', err);
    res.status(500).json({ message: 'Failed to get health metric' });
  }
};

// Create a new health metric
exports.create = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, value, unit, notes } = req.body;
    
    if (!type || value === undefined) {
      return res.status(400).json({ message: 'Type and value are required' });
    }
    
    const metric = await HealthMetric.create({
      user_id: userId,
      type,
      value,
      unit: unit || '',
      notes: notes || ''
    });
    
    let title = '健康记录';
    let category = 'other'; // 默认为other
    
    // 映射健康类型到允许的类别
    switch (type) {
      case 'weight':
      case 'height':
      case 'bloodPressure':
      case 'heartRate':
      case 'bloodSugar':
        category = 'measurement'; // 各种测量类型都映射到measurement
        break;
      case 'sleep':
        category = 'other'; // 睡眠记录映射到other
        break;
      case 'exercise':
        category = 'exercise'; // 运动记录直接映射到exercise
        break;
      case 'water':
      case 'diet':
        category = 'diet'; // 饮食相关记录映射到diet
        break;
      case 'medication':
        category = 'medication'; // 药物记录直接映射到medication
        break;
      default:
        category = 'other'; // 其他类型默认映射到other
    }
    
    // 根据不同健康指标类型设置不同的事件标题
    switch (type) {
      case 'weight':
        title = `体重记录: ${value}${unit || 'kg'}`;
        break;
      case 'sleep':
        title = `睡眠记录: ${value}${unit || '小时'}`;
        break;
      case 'exercise':
        title = `运动记录: ${value}${unit || '分钟'}`;
        break;
      case 'water':
        title = `饮水记录: ${value}${unit || '毫升'}`;
        break;
      case 'bloodPressure':
        title = `血压记录: ${value}${unit || 'mmHg'}`;
        break;
      case 'heartRate':
        title = `心率记录: ${value}${unit || 'bpm'}`;
        break;
      default:
        title = `${type}记录: ${value}${unit || ''}`;
    }
    
    // 创建健康日历事件
    const now = new Date();
    const eventEnd = new Date(now.getTime() + 30 * 60000); // 默认事件持续30分钟
    
    try {
      await HealthCalendarEvent.create({
        user_id: userId,
        title,
        description: notes || `${type}记录`,
        start_time: now,
        end_time: eventEnd,
        all_day: false,
        category: category, // 使用映射后的category值
        color: '#3788d8',
        health_metric_id: metric.id,
        metric_value: value,
        recurrence_frequency: 'none',
        recurrence_interval: 1,
        reminder_type: 'notification'
      });
      console.log('健康日历事件创建成功');
    } catch (calendarErr) {
      console.error('创建健康日历事件失败:', calendarErr);
      // 即使日历事件创建失败，也不影响健康指标的保存
    }
    
    res.status(201).json({
      message: 'Health metric recorded successfully',
      metric
    });
  } catch (err) {
    console.error('Error creating health metric:', err);
    res.status(500).json({ message: 'Failed to create health metric' });
  }
};

// Update a health metric
exports.update = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { value, unit, notes } = req.body;
    
    const metric = await HealthMetric.findOne({
      where: { 
        id,
        user_id: userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: 'Health metric not found' });
    }
    
    const updatedMetric = await metric.update({
      value: value !== undefined ? value : metric.value,
      unit: unit !== undefined ? unit : metric.unit,
      notes: notes !== undefined ? notes : metric.notes
    });
    
    res.status(200).json({
      message: 'Health metric updated successfully',
      metric: updatedMetric
    });
  } catch (err) {
    console.error('Error updating health metric:', err);
    res.status(500).json({ message: 'Failed to update health metric' });
  }
};

// Delete a health metric
exports.delete = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const metric = await HealthMetric.findOne({
      where: { 
        id,
        user_id: userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: 'Health metric not found' });
    }
    
    await metric.destroy();
    
    res.status(200).json({
      message: 'Health metric deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting health metric:', err);
    res.status(500).json({ message: 'Failed to delete health metric' });
  }
};

// Get health summary
exports.getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const latestMetrics = await HealthMetric.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: lastWeek
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    const latestMetricsMap = {};
    latestMetrics.forEach(metric => {
      if (!latestMetricsMap[metric.type] || 
          new Date(metric.createdAt) > new Date(latestMetricsMap[metric.type].createdAt)) {
        latestMetricsMap[metric.type] = metric;
      }
    });
    
    const averages = await HealthMetric.findAll({
      attributes: [
        'type',
        [db.sequelize.fn('AVG', db.sequelize.col('value')), 'average']
      ],
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: lastWeek
        }
      },
      group: ['type']
    });
    
    const summary = {
      latest: Object.values(latestMetricsMap).reduce((acc, metric) => {
        acc[metric.type] = {
          value: metric.value,
          unit: metric.unit,
          timestamp: metric.createdAt
        };
        return acc;
      }, {}),
      averages: averages.reduce((acc, avg) => {
        acc[avg.type] = {
          value: parseFloat(avg.getDataValue('average')).toFixed(1),
          unit: latestMetricsMap[avg.type]?.unit || ''
        };
        return acc;
      }, {})
    };
    
    res.status(200).json(summary);
  } catch (err) {
    console.error('Error getting health summary:', err);
    res.status(500).json({ message: 'Failed to get health metrics summary' });
  }
};

// Get a summary of health metrics for the current user
exports.getHealthSummary = async (req, res) => {
  try {
    const userId = req.userId;
    
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const weeklyMetrics = await HealthMetric.aggregate([
      { 
        $match: { 
          userId: userId, 
          date: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          average: { $avg: "$value" },
          unit: { $first: "$unit" }
        }
      }
    ]);
    
    const monthlyMetrics = await HealthMetric.aggregate([
      { 
        $match: { 
          userId: userId, 
          date: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          average: { $avg: "$value" },
          unit: { $first: "$unit" }
        }
      }
    ]);
    
    const latestMetrics = await HealthMetric.aggregate([
      { 
        $match: { 
          userId: userId
        } 
      },
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: "$type",
          latestEntry: { $first: "$$ROOT" }
        }
      }
    ]);
    
    const summary = {
      weekly: weeklyMetrics.reduce((acc, metric) => {
        acc[metric._id] = {
          count: metric.count,
          average: parseFloat(metric.average.toFixed(2)),
          unit: metric.unit
        };
        return acc;
      }, {}),
      monthly: monthlyMetrics.reduce((acc, metric) => {
        acc[metric._id] = {
          count: metric.count,
          average: parseFloat(metric.average.toFixed(2)),
          unit: metric.unit
        };
        return acc;
      }, {}),
      latest: latestMetrics.reduce((acc, item) => {
        const { latestEntry } = item;
        acc[latestEntry.type] = {
          value: latestEntry.value,
          unit: latestEntry.unit,
          date: latestEntry.date
        };
        return acc;
      }, {})
    };
    
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving health summary." });
  }
};

// Create a new health metric entry
exports.createHealthMetric = async (req, res) => {
  try {
    if (!req.body.type || !req.body.value || !req.body.unit) {
      return res.status(400).json({ message: "Type, value, and unit are required fields." });
    }

    const healthMetric = new HealthMetric({
      userId: req.userId,
      type: req.body.type,
      value: req.body.value,
      unit: req.body.unit,
      date: req.body.date || new Date(),
      notes: req.body.notes || ""
    });

    const savedMetric = await healthMetric.save();
    res.status(201).json(savedMetric);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating health metric." });
  }
};

// Retrieve all health metrics for the current user
exports.getAllHealthMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    
    const query = { userId };
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const healthMetrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await HealthMetric.countDocuments(query);
    
    res.status(200).json({
      data: healthMetrics,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving health metrics." });
  }
};

// Get health metrics by type
exports.getHealthMetricsByType = async (req, res) => {
  try {
    const userId = req.userId;
    const type = req.params.type;
    
    const validTypes = ['sleep', 'exercise', 'screenTime', 'studyTime', 'water', 'steps', 'weight', 'heartRate', 'mood'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid metric type." });
    }
    
    const query = { userId, type };
    
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const healthMetrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await HealthMetric.countDocuments(query);
    
    res.status(200).json({
      data: healthMetrics,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving health metrics." });
  }
};

// Find a single health metric with an id
exports.getHealthMetricById = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const healthMetric = await HealthMetric.findOne({ _id: id, userId });
    
    if (!healthMetric) {
      return res.status(404).json({ message: "Health metric not found." });
    }
    
    res.status(200).json(healthMetric);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving health metric." });
  }
};

// Update a health metric
exports.updateHealthMetric = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Data to update cannot be empty." });
    }

    const userId = req.userId;
    const id = req.params.id;

    const existingMetric = await HealthMetric.findOne({ _id: id, userId });
    
    if (!existingMetric) {
      return res.status(404).json({ message: "Health metric not found." });
    }
    
    const updatedMetric = await HealthMetric.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedMetric);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating health metric." });
  }
};

// Delete a health metric
exports.deleteHealthMetric = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const existingMetric = await HealthMetric.findOne({ _id: id, userId });
    
    if (!existingMetric) {
      return res.status(404).json({ message: "Health metric not found." });
    }
    
    await HealthMetric.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Health metric deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting health metric." });
  }
};

// Get all health metrics for the current user
exports.getAllMetrics = async (req, res) => {
  try {
    const metrics = await HealthMetric.findAll({
      where: { user_id: req.userId }
    });
    
    return res.status(200).json(metrics);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get health metrics by type
exports.getMetricsByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    const metrics = await HealthMetric.findAll({
      where: { 
        user_id: req.userId,
        type: type
      },
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(metrics);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Add new health metric
exports.addMetric = async (req, res) => {
  const { type, value, unit, date, notes } = req.body;
  
  if (!type || !value || !unit) {
    return res.status(400).json({ 
      message: "Type, value, and unit are required fields!"
    });
  }
  
  try {
    const newMetric = await HealthMetric.create({
      user_id: req.userId,
      type,
      value,
      unit,
      date: date || new Date(),
      notes: notes || ""
    });
    
    return res.status(201).json(newMetric);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update health metric
exports.updateMetric = async (req, res) => {
  const id = req.params.id;
  const { type, value, unit, date, notes } = req.body;
  
  try {
    const metric = await HealthMetric.findOne({
      where: { 
        id: id,
        user_id: req.userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found!" });
    }
    
    await metric.update({
      type: type || metric.type,
      value: value || metric.value,
      unit: unit || metric.unit,
      date: date || metric.date,
      notes: notes !== undefined ? notes : metric.notes
    });
    
    return res.status(200).json(metric);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete health metric
exports.deleteMetric = async (req, res) => {
  const id = req.params.id;
  
  try {
    const metric = await HealthMetric.findOne({
      where: { 
        id: id,
        user_id: req.userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found!" });
    }
    
    await metric.destroy();
    
    return res.status(200).json({ message: "Health metric deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 获取用户的所有健康日历事件
exports.getCalendarEvents = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 查询健康日历事件
    const events = await HealthCalendarEvent.findAll({
      where: { user_id: userId },
      order: [['start_time', 'ASC']]
    });
    
    // 格式化事件为前端期望的格式
    const formattedEvents = events.map(event => ({
      id: `health_${event.id}`,
      user_id: event.user_id,
      title: event.title,
      description: event.description, 
      start_time: event.start_time,
      end_time: event.end_time,
      all_day: event.all_day,
      // 提供一个与普通日历事件兼容的类别结构
      category: {
        id: 0,
        name: event.category,
        color: event.color || '#3788d8'
      },
      health_metric_id: event.health_metric_id,
      isHealthEvent: true // 标识为健康事件
    }));
    
    res.status(200).json(formattedEvents);
  } catch (err) {
    console.error('Error fetching health calendar events:', err);
    res.status(500).json({ message: 'Failed to fetch health calendar events' });
  }
};

// 获取特定月份的健康日历事件
exports.getMonthCalendarEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month } = req.params;
    
    // 验证年月参数
    if (!year || !month || isNaN(Number(year)) || isNaN(Number(month))) {
      return res.status(400).json({ message: 'Invalid year or month parameters' });
    }
    
    // 设置月份的开始和结束日期
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    
    console.log(`查询健康日历范围: ${startDate.toISOString()} 到 ${endDate.toISOString()}`);
    
    // 查询指定月份的健康日历事件
    const events = await HealthCalendarEvent.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          { start_time: { [Op.between]: [startDate, endDate] } },
          { end_time: { [Op.between]: [startDate, endDate] } }
        ]
      },
      order: [['start_time', 'ASC']]
    });
    
    console.log(`找到 ${events.length} 条健康日历事件`);
    
    // 格式化事件为前端期望的格式
    const formattedEvents = events.map(event => ({
      id: `health_${event.id}`,
      user_id: event.user_id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      all_day: event.all_day,
      // 提供一个与普通日历事件兼容的类别结构
      category: {
        id: 0,
        name: event.category,
        color: event.color || '#3788d8'
      },
      health_metric_id: event.health_metric_id,
      isHealthEvent: true // 标识为健康事件
    }));
    
    res.status(200).json(formattedEvents);
  } catch (err) {
    console.error('Error fetching month health calendar events:', err);
    res.status(500).json({ message: 'Failed to fetch month health calendar events' });
  }
};