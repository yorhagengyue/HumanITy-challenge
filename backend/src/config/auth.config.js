require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || "my_secret_key_for_mylife_companion_app",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "my_refresh_secret_key_for_mylife_companion_app",
  expiresIn: process.env.JWT_EXPIRES_IN || "1d", // 1 day
  refreshExpiresIn: "7d" // 7 days
};