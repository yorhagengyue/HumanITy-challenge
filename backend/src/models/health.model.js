const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sleep', 'water', 'exercise', 'meditation', 'steps', 'heartRate', 'bloodPressure', 'weight', 'mood', 'screenTime', 'nutrition']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries by userId and type
healthMetricSchema.index({ userId: 1, type: 1, date: -1 });

// Create a text index for searching in notes
healthMetricSchema.index({ notes: 'text' });

const HealthMetric = mongoose.model('HealthMetric', healthMetricSchema);

module.exports = HealthMetric; 