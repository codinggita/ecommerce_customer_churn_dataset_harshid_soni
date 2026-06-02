const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeCustomer = (raw, index = 0) => ({
  customerCode: raw.customerCode || raw.Customer_Code || `CUST-${String(index + 1).padStart(6, '0')}`,
  age: toNumber(raw.age ?? raw.Age),
  gender: raw.gender ?? raw.Gender,
  country: raw.country ?? raw.Country,
  city: raw.city ?? raw.City,
  membershipYears: toNumber(raw.membershipYears ?? raw.Membership_Years),
  loginFrequency: toNumber(raw.loginFrequency ?? raw.Login_Frequency),
  sessionDurationAvg: toNumber(raw.sessionDurationAvg ?? raw.Session_Duration_Avg),
  pagesPerSession: toNumber(raw.pagesPerSession ?? raw.Pages_Per_Session),
  cartAbandonmentRate: toNumber(raw.cartAbandonmentRate ?? raw.Cart_Abandonment_Rate),
  wishlistItems: toNumber(raw.wishlistItems ?? raw.Wishlist_Items),
  totalPurchases: toNumber(raw.totalPurchases ?? raw.Total_Purchases),
  averageOrderValue: toNumber(raw.averageOrderValue ?? raw.Average_Order_Value),
  daysSinceLastPurchase: toNumber(raw.daysSinceLastPurchase ?? raw.Days_Since_Last_Purchase),
  discountUsageRate: toNumber(raw.discountUsageRate ?? raw.Discount_Usage_Rate),
  returnsRate: toNumber(raw.returnsRate ?? raw.Returns_Rate),
  emailOpenRate: toNumber(raw.emailOpenRate ?? raw.Email_Open_Rate),
  customerServiceCalls: toNumber(raw.customerServiceCalls ?? raw.Customer_Service_Calls),
  productReviewsWritten: toNumber(raw.productReviewsWritten ?? raw.Product_Reviews_Written),
  socialMediaEngagementScore: toNumber(raw.socialMediaEngagementScore ?? raw.Social_Media_Engagement_Score),
  mobileAppUsage: toNumber(raw.mobileAppUsage ?? raw.Mobile_App_Usage),
  paymentMethodDiversity: toNumber(raw.paymentMethodDiversity ?? raw.Payment_Method_Diversity),
  lifetimeValue: toNumber(raw.lifetimeValue ?? raw.Lifetime_Value),
  creditBalance: toNumber(raw.creditBalance ?? raw.Credit_Balance),
  churned: ['1', 1, true, 'true', 'yes', 'churned'].includes(raw.churned ?? raw.Churned),
  signupQuarter: raw.signupQuarter ?? raw.Signup_Quarter,
  rawRecord: raw,
});

module.exports = {
  normalizeCustomer,
  toNumber,
};
