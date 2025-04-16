module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    full_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    avatar: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    role: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'user'
    },
    last_login: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
}; 