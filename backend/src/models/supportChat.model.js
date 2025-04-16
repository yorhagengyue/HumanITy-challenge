module.exports = (sequelize, Sequelize) => {
  const SupportChat = sequelize.define("support_chat", {
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
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    sender_type: {
      type: Sequelize.ENUM('user', 'ai'),
      allowNull: false
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
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

  return SupportChat;
}; 