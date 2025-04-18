module.exports = (sequelize, Sequelize) => {
  const HealthCalendarEvent = sequelize.define("health_calendar_events", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    category: {
      type: Sequelize.ENUM('medication', 'appointment', 'exercise', 'diet', 'measurement', 'other'),
      defaultValue: 'other'
    },
    color: {
      type: Sequelize.STRING(20),
      defaultValue: '#3788d8'
    },
    all_day: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    health_metric_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'health_metrics',
        key: 'id'
      }
    },
    metric_value: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    recurrence_frequency: {
      type: Sequelize.ENUM('none', 'daily', 'weekly', 'monthly'),
      defaultValue: 'none'
    },
    recurrence_interval: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    recurrence_end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    reminder_time: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '提前多少分钟提醒'
    },
    reminder_type: {
      type: Sequelize.ENUM('notification', 'email', 'sms'),
      defaultValue: 'notification'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'user_id_idx',
        fields: ['user_id']
      },
      {
        name: 'health_metric_id_idx',
        fields: ['health_metric_id']
      }
    ],
    hooks: {
      beforeCreate: (event, options) => {
        // 自动将健康类型映射到允许的类别值
        event.category = mapCategoryToAllowed(event.category);
      },
      beforeBulkCreate: (events, options) => {
        // 批量创建时的类别映射
        events.forEach(event => {
          event.category = mapCategoryToAllowed(event.category);
        });
      }
    }
  });

  // 辅助函数：将任何健康类型映射到允许的日历事件类别
  function mapCategoryToAllowed(category) {
    // 默认为other
    let mappedCategory = 'other';
    
    // 健康类型到类别的映射关系
    switch (category) {
      case 'weight':
      case 'height':
      case 'bloodPressure':
      case 'heartRate':
      case 'bloodSugar':
        mappedCategory = 'measurement'; // 各种测量类型都映射到measurement
        break;
      case 'sleep':
        mappedCategory = 'other'; // 睡眠记录映射到other
        break;
      case 'exercise':
        mappedCategory = 'exercise'; // 运动记录直接映射到exercise
        break;
      case 'water':
      case 'diet':
        mappedCategory = 'diet'; // 饮食相关记录映射到diet
        break;
      case 'medication':
        mappedCategory = 'medication'; // 药物记录直接映射到medication
        break;
      case 'appointment':
        mappedCategory = 'appointment'; // 约会直接映射到appointment
        break;
      default:
        // 如果已经是允许的值之一，则保持不变
        const allowedCategories = ['medication', 'appointment', 'exercise', 'diet', 'measurement', 'other'];
        if (allowedCategories.includes(category)) {
          mappedCategory = category;
        } else {
          mappedCategory = 'other'; // 其他类型默认映射到other
        }
    }
    
    return mappedCategory;
  }

  return HealthCalendarEvent;
};