const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['created', 'updated', 'replaced', 'deleted', 'restored', 'bulk-updated'],
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    age: { type: Number, required: true, index: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'], index: true },
    country: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    membershipYears: { type: Number, required: true, index: true },
    loginFrequency: { type: Number, required: true, index: true },
    sessionDurationAvg: { type: Number, required: true },
    pagesPerSession: { type: Number, required: true },
    cartAbandonmentRate: { type: Number, required: true, index: true },
    wishlistItems: { type: Number, required: true },
    totalPurchases: { type: Number, required: true, index: true },
    averageOrderValue: { type: Number, required: true, index: true },
    daysSinceLastPurchase: { type: Number, required: true, index: true },
    discountUsageRate: { type: Number, required: true, index: true },
    returnsRate: { type: Number, required: true },
    emailOpenRate: { type: Number, required: true },
    customerServiceCalls: { type: Number, required: true },
    productReviewsWritten: { type: Number, required: true, index: true },
    socialMediaEngagementScore: { type: Number, required: true, index: true },
    mobileAppUsage: { type: Number, required: true, index: true },
    paymentMethodDiversity: { type: Number, required: true },
    lifetimeValue: { type: Number, required: true, index: true },
    creditBalance: { type: Number, required: true, index: true },
    churned: { type: Boolean, required: true, index: true },
    signupQuarter: { type: String, required: true, enum: ['Q1', 'Q2', 'Q3', 'Q4'], index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    history: {
      type: [historySchema],
      default: [],
    },
    rawRecord: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ country: 1, city: 1 });
customerSchema.index({ churned: 1, lifetimeValue: -1 });
customerSchema.index({ totalPurchases: -1, lifetimeValue: -1 });
customerSchema.index({
  customerCode: 'text',
  country: 'text',
  city: 'text',
  gender: 'text',
  signupQuarter: 'text',
});

module.exports = mongoose.model('Customer', customerSchema);
