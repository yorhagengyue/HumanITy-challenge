const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration
exports.signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    
    // Validate request
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(400).send({
        message: "Username, password, and email cannot be empty!"
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username: req.body.username } });
    if (existingUser) {
      return res.status(400).send({
        message: "Username is already taken!"
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email: req.body.email } });
    if (existingEmail) {
      return res.status(400).send({
        message: "Email is already registered!"
      });
    }

    // Create user object
    const user = {
      username: req.body.username,
      email: req.body.email,
      password_hash: bcrypt.hashSync(req.body.password, 8),
      full_name: req.body.full_name || '',
      avatar: req.body.avatar || '',
      role: 'user'
    };

    console.log("Creating user with:", user);

    try {
      // Save user to database
      const data = await User.create(user);
      console.log("User created successfully:", data);
      
      // Create default user preferences (can be implemented here)
      
      res.status(201).send({
        message: "User registered successfully!"
      });
    } catch (dbError) {
      console.error("Database error during user creation:", dbError);
      res.status(500).send({
        message: "Database error: " + dbError.message
      });
    }
  } catch (err) {
    console.error("General error in signup:", err);
    res.status(500).send({
      message: err.message || "An error occurred during registration!"
    });
  }
};

// User Login
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    // Check database connection
    try {
      await db.sequelize.authenticate();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(503).json({
        message: "Database service temporarily unavailable, please try again later"
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid password"
      });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.expiresIn
    });

    // Return user info and Token
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    // Get token
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized! Token is invalid or expired."
        });
      }
      
      // Token is valid
      res.status(200).send({
        message: "Token is valid!",
        userId: decoded.id
      });
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error verifying token!"
    });
  }
};

// Logout
exports.logout = (req, res) => {
  // Client needs to remove token
  res.status(200).send({
    message: "Successfully logged out!"
  });
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    // Validate refresh token
    if (!req.body.refreshToken) {
      return res.status(400).send({
        message: "Refresh token is required!"
      });
    }

    // Validation and decoding logic depends on the actual refresh token mechanism
    // Simplified here assuming the refresh token is a JWT token
    let userId;
    try {
      const decoded = jwt.verify(req.body.refreshToken, config.refreshSecret);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).send({
        message: "Refresh token is invalid or expired!"
      });
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      });
    }

    // Create new access token
    const newToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.expiresIn
    });

    res.status(200).send({
      newToken: newToken,
      status: "success"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error refreshing token!"
    });
  }
};

// Password reset request
exports.requestPasswordReset = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email) {
      return res.status(400).send({
        message: "Email cannot be empty!"
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      // For security, return success even if user doesn't exist
      return res.status(200).send({
        message: "If the email exists, a password reset email has been sent!"
      });
    }

    // In a real application, generate reset token and send email
    // Simplified here to just return success message

    res.status(200).send({
      message: "If the email exists, a password reset email has been sent!"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error requesting password reset!"
    });
  }
};

// Confirm password reset
exports.confirmPasswordReset = async (req, res) => {
  try {
    // Validate request
    if (!req.body.token || !req.body.newPassword) {
      return res.status(400).send({
        message: "Token and new password cannot be empty!"
      });
    }

    // Validate token
    // In a real application, validate the password reset token
    // Simplified here assuming the token is valid and contains the user ID

    // In a real application, get userId from token
    const userId = 1; // Assumed userId

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    await User.update(
      { password_hash: hashedPassword },
      { where: { id: userId } }
    );

    res.status(200).send({
      message: "Password has been reset successfully!"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error during password reset!"
    });
  }
}; 