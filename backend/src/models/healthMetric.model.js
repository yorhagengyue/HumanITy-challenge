module.exports = (sequelize, Sequelize) => {
  const HealthMetric = sequelize.define("health_metrics", {
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
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['weight', 'height', 'bloodPressure', 'heartRate', 'bloodSugar', 'sleep', 'exercise', 'water', 'diet', 'medication', 'other']]
      }
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    unit: {
      type: Sequelize.STRING(20),
      defaultValue: ''
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'user_type_date_idx',
        fields: ['user_id', 'type', 'date']
      }
    ]
  });

  return HealthMetric;
};

/*
// Mongoose version for future reference
const mongoose = require('mongoose');

const HealthMetricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sleep', 'exercise', 'screenTime', 'studyTime', 'water', 'steps', 'weight', 'heartRate', 'mood']
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for faster querying
HealthMetricSchema.index({ userId: 1, type: 1, date: -1 });

const HealthMetric = mongoose.model('HealthMetric', HealthMetricSchema);

module.exports = HealthMetric;
*/ 