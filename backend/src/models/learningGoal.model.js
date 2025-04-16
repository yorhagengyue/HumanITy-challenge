module.exports = (sequelize, Sequelize) => {
  const LearningGoal = sequelize.define("learning_goal", {
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
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    target_date: {
      type: Sequelize.DATEONLY
    },
    progress: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    status: {
      type: Sequelize.ENUM('not_started', 'in_progress', 'completed', 'abandoned'),
      defaultValue: 'not_started'
    },
    resources: {
      type: Sequelize.JSON
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

  return LearningGoal;
}; 