module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
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
        model: 'task_categories',
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
    due_date: {
      type: Sequelize.DATE
    },
    priority: {
      type: Sequelize.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    status: {
      type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'canceled'),
      defaultValue: 'pending'
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

  return Task;
}; 