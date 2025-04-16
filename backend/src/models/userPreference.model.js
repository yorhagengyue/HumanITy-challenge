module.exports = (sequelize, Sequelize) => {
  const UserPreference = sequelize.define("user_preference", {
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
    // Additional profile fields
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    school: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    grade: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    bio: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // Notification settings
    email_reminders: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    task_notifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    health_reminders: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    emotional_support_messages: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    // Privacy settings
    share_health_data: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    share_emotional_data: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    allow_parent_access: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    allow_school_access: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    // Theme preferences
    dark_mode: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    color_theme: {
      type: Sequelize.STRING(20),
      defaultValue: 'blue'
    }
  }, {
    tableName: 'user_preferences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return UserPreference;
}; 