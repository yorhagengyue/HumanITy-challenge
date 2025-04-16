const db = require('../models');
const HealthMetric = db.healthMetrics;
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
    
    // Update fields
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
    
    // MySQL doesn't have DISTINCT ON, so we need a different approach
    // Get the latest entry for each type
    const latestMetrics = await HealthMetric.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: lastWeek
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    // Filter to get only the latest entry for each type
    const latestMetricsMap = {};
    latestMetrics.forEach(metric => {
      if (!latestMetricsMap[metric.type] || 
          new Date(metric.createdAt) > new Date(latestMetricsMap[metric.type].createdAt)) {
        latestMetricsMap[metric.type] = metric;
      }
    });
    
    // Calculate averages for each type
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
    
    // Prepare summary response
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
    
    // Get the current date and calculate dates for last 7 days, last 30 days
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Fetch the counts and averages for different metrics in the last 7 days
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
    
    // Fetch the counts and averages for different metrics in the last 30 days
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
    
    // Get the most recent entry for each metric type
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
    
    // Format the response
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
    // Validate request
    if (!req.body.type || !req.body.value || !req.body.unit) {
      return res.status(400).json({ message: "Type, value, and unit are required fields." });
    }

    // Create a new health metric
    const healthMetric = new HealthMetric({
      userId: req.userId,
      type: req.body.type,
      value: req.body.value,
      unit: req.body.unit,
      date: req.body.date || new Date(),
      notes: req.body.notes || ""
    });

    // Save the health metric in the database
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
    
    // Build query object
    const query = { userId };
    
    // Apply type filter if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Apply date range filter if provided
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }
    
    // Set up pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const healthMetrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination metadata
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
    
    // Validate type parameter
    const validTypes = ['sleep', 'exercise', 'screenTime', 'studyTime', 'water', 'steps', 'weight', 'heartRate', 'mood'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid metric type." });
    }
    
    // Build query object
    const query = { userId, type };
    
    // Apply date range filter if provided
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }
    
    // Set up pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const healthMetrics = await HealthMetric.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination metadata
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
    // Validate request
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Data to update cannot be empty." });
    }

    const userId = req.userId;
    const id = req.params.id;

    // Find the health metric and ensure it belongs to the user
    const existingMetric = await HealthMetric.findOne({ _id: id, userId });
    
    if (!existingMetric) {
      return res.status(404).json({ message: "Health metric not found." });
    }
    
    // Update fields
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

    // Find the health metric and ensure it belongs to the user
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
  
  // Validate request
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
    // First check if the metric exists and belongs to the user
    const metric = await HealthMetric.findOne({
      where: { 
        id: id,
        user_id: req.userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found!" });
    }
    
    // Update the metric
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
    // First check if the metric exists and belongs to the user
    const metric = await HealthMetric.findOne({
      where: { 
        id: id,
        user_id: req.userId
      }
    });
    
    if (!metric) {
      return res.status(404).json({ message: "Health metric not found!" });
    }
    
    // Delete the metric
    await metric.destroy();
    
    return res.status(200).json({ message: "Health metric deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}; 