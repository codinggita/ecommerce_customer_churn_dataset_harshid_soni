const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'security'],
      default: 'info',
      index: true,
    },
    event: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemLog', systemLogSchema);
