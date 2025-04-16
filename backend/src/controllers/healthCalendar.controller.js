const db = require("../models");
const HealthCalendarEvent = db.healthCalendarEvents;
const HealthMetric = db.healthMetrics;
const { Op } = db.Sequelize;

// 创建新的健康日历事件
exports.createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const eventData = { ...req.body, user_id: userId };
    
    // 将驼峰命名转换为下划线命名
    if (eventData.metricValue !== undefined) {
      eventData.metric_value = eventData.metricValue;
      delete eventData.metricValue;
    }
    
    if (eventData.startTime !== undefined) {
      eventData.start_time = eventData.startTime;
      delete eventData.startTime;
    }
    
    if (eventData.endTime !== undefined) {
      eventData.end_time = eventData.endTime;
      delete eventData.endTime;
    }
    
    if (eventData.allDay !== undefined) {
      eventData.all_day = eventData.allDay;
      delete eventData.allDay;
    }
    
    // 创建事件
    const newEvent = await HealthCalendarEvent.create(eventData);
    
    // 如果事件更新了健康指标，则同时创建或更新健康指标
    if (eventData.metric_value !== null && eventData.category !== 'other') {
      let metricType = eventData.category;
      
      // 如果类别是"测量"，则根据标题确定具体指标类型
      if (eventData.category === 'measurement') {
        const title = eventData.title.toLowerCase();
        if (title.includes('weight')) {
          metricType = 'weight';
        } else if (title.includes('blood pressure')) {
          metricType = 'bloodPressure';
        } else if (title.includes('heart')) {
          metricType = 'heartRate';
        } else {
          metricType = 'other';
        }
      }
      
      // 创建相应的健康指标记录
      const metricData = {
        user_id: userId,
        type: metricType,
        value: eventData.metric_value,
        date: eventData.start_time,
        notes: eventData.description || `Added from health calendar: ${eventData.title}`
      };
      
      // 保存健康指标并关联到事件
      const newMetric = await HealthMetric.create(metricData);
      
      // 更新事件以包含健康指标ID
      await newEvent.update({
        health_metric_id: newMetric.id
      });
    }
    
    // 查询完整的更新后事件
    const savedEvent = await HealthCalendarEvent.findByPk(newEvent.id);
    
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: "创建健康日历事件失败", error: err.message });
  }
};

// 获取用户的所有健康日历事件
exports.getAllEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const events = await HealthCalendarEvent.findAll({
      where: { user_id: userId }
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "获取健康日历事件失败", error: err.message });
  }
};

// 按月获取健康日历事件
exports.getEventsByMonth = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month } = req.params;
    
    // 设置月初和月末时间
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    const events = await HealthCalendarEvent.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          // 事件在当月内开始
          { start_time: { [Op.between]: [startDate, endDate] } },
          // 事件在当月内结束
          { end_time: { [Op.between]: [startDate, endDate] } },
          // 事件跨越整个月
          { 
            [Op.and]: [
              { start_time: { [Op.lte]: startDate } },
              { end_time: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });
    
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "按月获取健康日历事件失败", error: err.message });
  }
};

// 获取单个健康日历事件
exports.getEventById = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    
    const event = await HealthCalendarEvent.findOne({
      where: { 
        id: eventId,
        user_id: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: "未找到事件" });
    }
    
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "获取健康日历事件失败", error: err.message });
  }
};

// 更新健康日历事件
exports.updateEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const updateData = { ...req.body };
    
    // 将驼峰命名转换为下划线命名
    if (updateData.metricValue !== undefined) {
      updateData.metric_value = updateData.metricValue;
      delete updateData.metricValue;
    }
    
    if (updateData.startTime !== undefined) {
      updateData.start_time = updateData.startTime;
      delete updateData.startTime;
    }
    
    if (updateData.endTime !== undefined) {
      updateData.end_time = updateData.endTime;
      delete updateData.endTime;
    }
    
    if (updateData.allDay !== undefined) {
      updateData.all_day = updateData.allDay;
      delete updateData.allDay;
    }
    
    // 查找事件
    const event = await HealthCalendarEvent.findOne({
      where: {
        id: eventId,
        user_id: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: "未找到事件" });
    }
    
    // 更新事件
    await event.update(updateData);
    
    // 如果事件有关联的健康指标且值被更新，同时更新健康指标
    if (event.health_metric_id && updateData.metric_value !== undefined) {
      await HealthMetric.update(
        { 
          value: updateData.metric_value,
          date: updateData.start_time || event.start_time,
          notes: updateData.description || event.description
        },
        {
          where: { id: event.health_metric_id }
        }
      );
    }
    
    // 获取更新后的事件
    const updatedEvent = await HealthCalendarEvent.findByPk(eventId);
    
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "更新健康日历事件失败", error: err.message });
  }
};

// 删除健康日历事件
exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    
    // 查找事件
    const event = await HealthCalendarEvent.findOne({
      where: {
        id: eventId,
        user_id: userId
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: "未找到事件" });
    }
    
    // 如果有关联的健康指标，则同时删除
    if (event.health_metric_id) {
      await HealthMetric.destroy({
        where: { id: event.health_metric_id }
      });
    }
    
    // 删除事件
    await HealthCalendarEvent.destroy({
      where: { id: eventId }
    });
    
    res.status(200).json({ message: "健康日历事件已成功删除" });
  } catch (err) {
    res.status(500).json({ message: "删除健康日历事件失败", error: err.message });
  }
};

// 获取与特定健康指标相关的事件
exports.getEventsByMetric = async (req, res) => {
  try {
    const userId = req.userId;
    const metricId = req.params.metricId;
    
    const events = await HealthCalendarEvent.findAll({
      where: {
        user_id: userId,
        health_metric_id: metricId
      }
    });
    
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "获取健康指标相关事件失败", error: err.message });
  }
};

// 按类别获取事件
exports.getEventsByCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const category = req.params.category;
    
    const events = await HealthCalendarEvent.findAll({
      where: {
        user_id: userId,
        category
      }
    });
    
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "按类别获取事件失败", error: err.message });
  }
}; 