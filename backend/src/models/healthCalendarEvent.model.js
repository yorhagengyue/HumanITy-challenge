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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'user_start_idx',
        fields: ['user_id', 'start_time']
      },
      {
        name: 'user_category_idx',
        fields: ['user_id', 'category']
      },
      {
        name: 'metric_idx',
        fields: ['health_metric_id']
      }
    ]
  });

  return HealthCalendarEvent;
}; 