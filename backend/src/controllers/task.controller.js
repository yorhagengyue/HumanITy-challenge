const db = require('../models');
const Task = db.tasks;
const TaskCategory = db.taskCategories;
const Op = db.Sequelize.Op;

// 创建任务
exports.create = async (req, res) => {
  try {
    // 验证请求
    if (!req.body.title) {
      return res.status(400).send({
        message: "任务标题不能为空！"
      });
    }

    // 创建任务对象
    const task = {
      user_id: req.userId,
      title: req.body.title,
      description: req.body.description || '',
      due_date: req.body.due_date,
      priority: req.body.priority || 'medium',
      status: req.body.status || 'pending',
      category_id: req.body.category_id
    };

    // 如果提供了分类ID，检查分类是否存在且属于当前用户
    if (task.category_id) {
      const category = await TaskCategory.findOne({
        where: {
          id: task.category_id,
          user_id: req.userId
        }
      });

      if (!category) {
        return res.status(404).send({
          message: "指定的任务分类不存在或不属于当前用户！"
        });
      }
    }

    // 保存到数据库
    const data = await Task.create(task);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "创建任务失败！"
    });
  }
};

// 查找用户的所有任务
exports.findAll = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 构建查询条件
    let condition = { user_id: userId };
    
    // 按状态筛选
    if (req.query.status) {
      condition.status = req.query.status;
    }
    
    // 按分类筛选
    if (req.query.category_id) {
      condition.category_id = req.query.category_id;
    }
    
    // 按优先级筛选
    if (req.query.priority) {
      condition.priority = req.query.priority;
    }
    
    // 按到期日期范围筛选
    if (req.query.from_date && req.query.to_date) {
      condition.due_date = {
        [Op.between]: [new Date(req.query.from_date), new Date(req.query.to_date)]
      };
    } else if (req.query.from_date) {
      condition.due_date = {
        [Op.gte]: new Date(req.query.from_date)
      };
    } else if (req.query.to_date) {
      condition.due_date = {
        [Op.lte]: new Date(req.query.to_date)
      };
    }
    
    // 搜索标题和描述
    if (req.query.search) {
      condition[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    // 查询数据库
    const tasks = await Task.findAll({
      where: condition,
      include: [{
        model: TaskCategory,
        attributes: ['id', 'name', 'color', 'icon']
      }],
      order: [['due_date', 'ASC']]
    });
    
    res.send(tasks);
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取任务列表失败！"
    });
  }
};

// 查找单个任务
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    
    const task = await Task.findOne({
      where: {
        id: id,
        user_id: userId
      },
      include: [{
        model: TaskCategory,
        attributes: ['id', 'name', 'color', 'icon']
      }]
    });
    
    if (!task) {
      return res.status(404).send({
        message: `未找到ID为${id}的任务！`
      });
    }
    
    res.send(task);
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取任务详情失败！"
    });
  }
};

// 更新任务
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    
    // 检查任务是否存在且属于当前用户
    const task = await Task.findOne({
      where: {
        id: id,
        user_id: userId
      }
    });
    
    if (!task) {
      return res.status(404).send({
        message: `未找到ID为${id}的任务！`
      });
    }
    
    // 如果更新了分类，检查分类是否存在且属于当前用户
    if (req.body.category_id) {
      const category = await TaskCategory.findOne({
        where: {
          id: req.body.category_id,
          user_id: userId
        }
      });
      
      if (!category) {
        return res.status(404).send({
          message: "指定的任务分类不存在或不属于当前用户！"
        });
      }
    }
    
    // 更新任务
    const [num] = await Task.update(req.body, {
      where: {
        id: id,
        user_id: userId
      }
    });
    
    if (num === 1) {
      res.send({
        message: "任务更新成功！"
      });
    } else {
      res.status(500).send({
        message: "更新任务失败！"
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "更新任务失败！"
    });
  }
};

// 删除任务
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    
    const num = await Task.destroy({
      where: {
        id: id,
        user_id: userId
      }
    });
    
    if (num === 1) {
      res.send({
        message: "任务删除成功！"
      });
    } else {
      res.status(404).send({
        message: `未找到ID为${id}的任务！`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "删除任务失败！"
    });
  }
};

// 获取用户的任务统计
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 获取各状态的任务数量
    const stats = await Task.findAll({
      attributes: [
        'status',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
      ],
      where: { user_id: userId },
      group: ['status']
    });
    
    // 获取各优先级的任务数量
    const priorityStats = await Task.findAll({
      attributes: [
        'priority',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
      ],
      where: { user_id: userId },
      group: ['priority']
    });
    
    // 获取即将到期的任务数量
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingTasks = await Task.count({
      where: {
        user_id: userId,
        due_date: {
          [Op.between]: [today, nextWeek]
        },
        status: {
          [Op.ne]: 'completed'
        }
      }
    });
    
    // 获取已逾期的任务数量
    const overdueTasks = await Task.count({
      where: {
        user_id: userId,
        due_date: {
          [Op.lt]: today
        },
        status: {
          [Op.ne]: 'completed'
        }
      }
    });
    
    res.send({
      statusStats: stats,
      priorityStats: priorityStats,
      upcoming: upcomingTasks,
      overdue: overdueTasks
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取任务统计失败！"
    });
  }
}; 