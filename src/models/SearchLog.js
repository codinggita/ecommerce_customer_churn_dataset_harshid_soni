const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    resultCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchLog', searchLogSchema);
