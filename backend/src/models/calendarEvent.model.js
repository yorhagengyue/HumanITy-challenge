module.exports = (sequelize, Sequelize) => {
  const CalendarEvent = sequelize.define("calendar_event", {
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
    category_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'calendar_categories',
        key: 'id'
      }
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    location: {
      type: Sequelize.STRING
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    all_day: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reminder: {
      type: Sequelize.INTEGER
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
    timestamps: false
  });

  return CalendarEvent;
}; 