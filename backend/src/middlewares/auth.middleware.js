const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

// 验证Token
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // 从Bearer token中提取token
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).send({
      message: "未提供token!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "未授权!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// 验证管理员权限
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({
        message: "用户不存在!"
      });
    }
    
    // 假设User模型有个角色字段
    // 如果没有角色字段，可以新建一张角色表进行关联
    if (user.role === 'admin') {
      next();
      return;
    }

    res.status(403).send({
      message: "需要管理员权限!"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "验证管理员权限时出错"
    });
  }
};

// 验证用户状态是否活跃
isActive = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({
        message: "用户不存在!"
      });
    }
    
    if (user.status !== 'active') {
      return res.status(403).send({
        message: "账户未激活或已被暂停!"
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: err.message || "验证用户状态时出错"
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isActive
};

module.exports = authMiddleware; 