module.exports = {
  // MongoDB connection configuration
  URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mylife_companion',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}; 