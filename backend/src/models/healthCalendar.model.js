const mongoose = require("mongoose");

const HealthCalendarSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  start: {
    type: Date,
    required: true,
    index: true
  },
  end: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['medication', 'appointment', 'exercise', 'diet', 'sleep', 'other'],
    default: 'other',
    index: true
  },
  color: {
    type: String,
    default: '#4285F4'
  },
  healthMetricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthMetric',
    index: true
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  reminder: {
    type: Date
  },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  status: {
    type: String,
    enum: ['planned', 'completed', 'cancelled'],
    default: 'planned'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 添加复合索引用于高效查询
HealthCalendarSchema.index({ userId: 1, start: 1 });
HealthCalendarSchema.index({ userId: 1, category: 1 });
HealthCalendarSchema.index({ userId: 1, healthMetricId: 1 });

const HealthCalendar = mongoose.model("HealthCalendar", HealthCalendarSchema);

module.exports = HealthCalendar; 