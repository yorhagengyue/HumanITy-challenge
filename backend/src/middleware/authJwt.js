const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

// Verify JWT token
verifyToken = (req, res, next) => {
  console.log('Headers received:', JSON.stringify(req.headers));
  
  // Get token from request header (support both formats)
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  
  // If using Bearer format, extract the token
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    console.log('Extracted token from Bearer format');
  }
  
  console.log('Token found:', token ? 'yes' : 'no');
  
  if (!token) {
    console.log('No token provided!');
    return res.status(403).send({
      message: "No token provided! Please login."
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey', (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return res.status(401).send({
        message: "Unauthorized! Token is invalid or expired."
      });
    }
    
    console.log('Token verified successfully for user ID:', decoded.id);
    req.userId = decoded.id;
    next();
  });
};

// Check if user is admin
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      });
    }
    
    if (user.role === 'admin') {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Admin role required!"
    });
  } catch (err) {
    res.status(500).send({
      message: "Error verifying admin role!"
    });
  }
};

// Check if user is accessing their own resources
isSameUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (userId !== req.userId) {
      return res.status(403).send({
        message: "Access to another user's resources denied!"
      });
    }
    
    next();
  } catch (err) {
    res.status(500).send({
      message: "Error verifying user identity!"
    });
  }
};

// Check if user is admin or accessing their own resources
isAdminOrSameUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      });
    }
    
    // Allow if admin
    if (user.role === 'admin') {
      next();
      return;
    }
    
    // Allow if accessing own resources
    const resourceUserId = parseInt(req.params.id);
    if (req.userId === resourceUserId) {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Access denied!"
    });
  } catch (err) {
    res.status(500).send({
      message: "Error verifying permissions!"
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSameUser,
  isAdminOrSameUser
};

module.exports = authJwt; 