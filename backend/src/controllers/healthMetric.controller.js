const db = require("../models");
const HealthMetric = db.healthMetrics;
const { Op } = db.Sequelize;

// 创建新的健康指标
exports.create = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, value, unit, date, notes } = req.body;
    
    // 创建新的健康指标记录
    const newMetric = await HealthMetric.create({
      user_id: userId,
      type,
      value,
      unit: unit || '',
      date: date || new Date(),
      notes: notes || ''
    });
    
    res.status(201).json(newMetric);
  } catch (err) {
    res.status(500).json({ message: "创建健康指标失败", error: err.message });
  }
};

// 获取用户的所有健康指标
exports.findAll = async (req, res) => {
  try {
    const userId = req.userId;
    const metrics = await HealthMetric.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ message: "获取健康指标失败", error: err.message });
  }
};

// 按类型获取健康指标
exports.findByType = async (req, res) => {
  try {
    const userId = req.userId;
    const type = req.params.type;
    
    const metrics = await HealthMetric.findAll({
      where: { 
        user_id: userId,
        type
      },
      order: [['date', 'DESC']]
    });
    
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ message: `获取类型为 ${req.params.type} 的健康指标失败`, error: err.message });
  }
};

// 按日期范围获取健康指标
exports.findByDateRange = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, type } = req.query;
    
    // 构建查询条件
    const whereCondition = { user_id: userId };
    
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (type) {
      whereCondition.type = type;
    }
    
    const metrics = await HealthMetric.findAll({
      where: whereCondition,
      order: [['date', 'DESC']]
    });
    
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ message: "按日期范围获取健康指标失败", error: err.message });
  }
};

// 获取单个健康指标
exports.findOne = async (req, res) => {
  try {
    const userId = req.userId;
    const metricId = req.params.id;
    
    const metric = await HealthMetric.findOne({
      where: {
        id: metricId,
        user_id: userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: "未找到健康指标" });
    }
    
    res.status(200).json(metric);
  } catch (err) {
    res.status(500).json({ message: "获取健康指标失败", error: err.message });
  }
};

// 更新健康指标
exports.update = async (req, res) => {
  try {
    const userId = req.userId;
    const metricId = req.params.id;
    const updateData = req.body;
    
    // 查找并更新健康指标
    const [updated] = await HealthMetric.update(updateData, {
      where: {
        id: metricId,
        user_id: userId
      }
    });
    
    if (updated === 0) {
      return res.status(404).json({ message: "未找到健康指标" });
    }
    
    // 获取更新后的记录
    const metric = await HealthMetric.findByPk(metricId);
    
    res.status(200).json(metric);
  } catch (err) {
    res.status(500).json({ message: "更新健康指标失败", error: err.message });
  }
};

// 删除健康指标
exports.delete = async (req, res) => {
  try {
    const userId = req.userId;
    const metricId = req.params.id;
    
    // 查找并删除健康指标
    const deleted = await HealthMetric.destroy({
      where: {
        id: metricId,
        user_id: userId
      }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: "未找到健康指标" });
    }
    
    res.status(200).json({ message: "健康指标已成功删除" });
  } catch (err) {
    res.status(500).json({ message: "删除健康指标失败", error: err.message });
  }
};

// 获取健康指标统计信息
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const type = req.params.type;
    const { startDate, endDate } = req.query;
    
    // 构建查询条件
    const whereCondition = { 
      user_id: userId,
      type
    };
    
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // 获取指定类型的所有健康指标
    const metrics = await HealthMetric.findAll({
      where: whereCondition,
      order: [['date', 'ASC']]
    });
    
    if (metrics.length === 0) {
      return res.status(200).json({
        average: null,
        min: null,
        max: null,
        count: 0,
        trend: null,
        data: []
      });
    }
    
    // 计算统计信息
    const values = metrics.map(metric => metric.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // 计算趋势（正值表示上升趋势，负值表示下降趋势）
    let trend = null;
    if (metrics.length > 1) {
      const firstValue = metrics[0].value;
      const lastValue = metrics[metrics.length - 1].value;
      trend = ((lastValue - firstValue) / firstValue) * 100; // 百分比变化
    }
    
    // 格式化结果以便于前端展示
    const formattedData = metrics.map(metric => ({
      date: metric.date,
      value: metric.value,
      notes: metric.notes
    }));
    
    res.status(200).json({
      average,
      min,
      max,
      count: metrics.length,
      trend,
      data: formattedData
    });
  } catch (err) {
    res.status(500).json({ message: "获取健康指标统计信息失败", error: err.message });
  }
}; 