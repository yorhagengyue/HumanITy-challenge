const db = require('../models');
const User = db.users;
const UserPreference = db.userPreferences;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 创建用户
exports.create = async (req, res) => {
  try {
    // 验证请求
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(400).send({
        message: "用户名、密码和邮箱不能为空！"
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    if (existingUser) {
      return res.status(400).send({
        message: "用户名已存在！"
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email: req.body.email } });
    if (existingEmail) {
      return res.status(400).send({
        message: "邮箱已被注册！"
      });
    }

    // 创建用户对象
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      full_name: req.body.full_name || '',
      avatar: req.body.avatar || '',
      role: req.body.role || 'user'
    };

    // 保存到数据库
    const data = await User.create(user);
    res.status(201).send({
      id: data.id,
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      role: data.role
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "创建用户失败！"
    });
  }
};

// 查找所有用户
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'full_name', 'avatar', 'role', 'created_at']
    });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取用户列表失败！"
    });
  }
};

// 查找单个用户
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'full_name', 'avatar', 'role', 'created_at']
    });
    
    if (!user) {
      return res.status(404).send({
        message: `未找到ID为${id}的用户！`
      });
    }
    
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || "获取用户详情失败！"
    });
  }
};

// 更新用户信息
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Create separate objects for user data and preferences
    const userData = {
      full_name: req.body.full_name,
      avatar: req.body.avatar
    };
    
    const preferencesData = {
      phone: req.body.phone,
      school: req.body.school,
      grade: req.body.grade,
      bio: req.body.bio
    };
    
    // Update user data
    const [userUpdated] = await User.update(userData, {
      where: { id: id }
    });
    
    // Find or create user preferences
    const [preferences, created] = await UserPreference.findOrCreate({
      where: { user_id: id },
      defaults: { ...preferencesData, user_id: id }
    });
    
    // If preferences already exist, update them
    if (!created) {
      await UserPreference.update(preferencesData, {
        where: { user_id: id }
      });
    }
    
    res.send({
      message: "Profile updated successfully"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating user profile"
    });
  }
};

// 删除用户
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await User.destroy({
      where: { id: id }
    });
    
    if (num === 1) {
      res.send({
        message: "用户删除成功！"
      });
    } else {
      res.status(404).send({
        message: `未找到ID为${id}的用户！`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "删除用户失败！"
    });
  }
};

// Get current user information with preferences
exports.getCurrentUser = async (req, res) => {
  try {
    console.log(`Getting user profile for user ID: ${req.userId}`);
    
    // First just get the user by ID without specifying attributes
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      console.log(`User not found with ID: ${req.userId}`);
      return res.status(404).send({
        message: "User not found"
      });
    }
    
    console.log(`User found: ${user.username}`);
    
    // Build a safe user object that handles missing fields
    const safeUserData = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      avatar: user.avatar || '',
      role: user.role || 'user',
      created_at: user.created_at
    };
    
    try {
      // Get user preferences
      const preferences = await UserPreference.findOne({
        where: { user_id: req.userId }
      });
      
      console.log(`User preferences found: ${!!preferences}`);
      
      // Combine user and preferences data
      const userData = {
        ...safeUserData,
        phone: preferences ? preferences.phone || '' : '',
        school: preferences ? preferences.school || '' : '',
        grade: preferences ? preferences.grade || '' : '',
        bio: preferences ? preferences.bio || '' : ''
      };
      
      res.send(userData);
    } catch (prefErr) {
      console.error('Error fetching user preferences:', prefErr);
      
      // Send user data even if preferences failed
      res.send(safeUserData);
    }
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    res.status(500).send({
      message: err.message || "Error retrieving user information"
    });
  }
};

// Upload profile image
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        message: "Please upload an image file"
      });
    }
    
    const id = req.params.id;
    
    // Update user avatar
    const [userUpdated] = await User.update({
      avatar: req.file.filename
    }, {
      where: { id: id }
    });
    
    if (userUpdated === 1) {
      res.send({
        message: "Avatar updated successfully",
        avatar: req.file.filename
      });
    } else {
      res.status(404).send({
        message: "User not found or no changes made"
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error uploading avatar"
    });
  }
};

// Get user notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({
      where: { user_id: req.userId },
      attributes: ['email_reminders', 'task_notifications', 'health_reminders', 'emotional_support_messages']
    });
    
    if (!preferences) {
      return res.send({
        emailReminders: true,
        taskNotifications: true,
        healthReminders: true,
        emotionalSupportMessages: true
      });
    }
    
    res.send({
      emailReminders: preferences.email_reminders,
      taskNotifications: preferences.task_notifications,
      healthReminders: preferences.health_reminders,
      emotionalSupportMessages: preferences.emotional_support_messages
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving notification settings"
    });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const settings = {
      email_reminders: req.body.emailReminders,
      task_notifications: req.body.taskNotifications,
      health_reminders: req.body.healthReminders,
      emotional_support_messages: req.body.emotionalSupportMessages
    };
    
    // Find or create user preferences
    const [preferences, created] = await UserPreference.findOrCreate({
      where: { user_id: req.userId },
      defaults: { ...settings, user_id: req.userId }
    });
    
    // If preferences already exist, update them
    if (!created) {
      await UserPreference.update(settings, {
        where: { user_id: req.userId }
      });
    }
    
    res.send({
      message: "Notification settings updated successfully"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating notification settings"
    });
  }
};

// Get user privacy settings
exports.getPrivacySettings = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({
      where: { user_id: req.userId },
      attributes: ['share_health_data', 'share_emotional_data', 'allow_parent_access', 'allow_school_access']
    });
    
    if (!preferences) {
      return res.send({
        shareHealthData: false,
        shareEmotionalData: false,
        allowParentAccess: false,
        allowSchoolAccess: false
      });
    }
    
    res.send({
      shareHealthData: preferences.share_health_data,
      shareEmotionalData: preferences.share_emotional_data,
      allowParentAccess: preferences.allow_parent_access,
      allowSchoolAccess: preferences.allow_school_access
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving privacy settings"
    });
  }
};

// Update privacy settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const settings = {
      share_health_data: req.body.shareHealthData,
      share_emotional_data: req.body.shareEmotionalData,
      allow_parent_access: req.body.allowParentAccess,
      allow_school_access: req.body.allowSchoolAccess
    };
    
    // Find or create user preferences
    const [preferences, created] = await UserPreference.findOrCreate({
      where: { user_id: req.userId },
      defaults: { ...settings, user_id: req.userId }
    });
    
    // If preferences already exist, update them
    if (!created) {
      await UserPreference.update(settings, {
        where: { user_id: req.userId }
      });
    }
    
    res.send({
      message: "Privacy settings updated successfully"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating privacy settings"
    });
  }
}; 