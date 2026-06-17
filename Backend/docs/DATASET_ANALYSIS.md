# Dataset Understanding and MongoDB Planning

## Raw Dataset

File used: `data/ecommerce_customer_churn_dataset.json`

The dataset is a JSON array containing 15,259 ecommerce customer records. Each record has 25 fields. The raw numeric values are encoded as strings, so the seed script converts them to numbers before insertion into MongoDB.

Example raw record:

```json
{
  "Age": "43.0",
  "Gender": "Male",
  "Country": "France",
  "City": "Marseille",
  "Membership_Years": "2.9",
  "Login_Frequency": "14.0",
  "Session_Duration_Avg": "27.4",
  "Pages_Per_Session": "6.0",
  "Cart_Abandonment_Rate": "50.6",
  "Wishlist_Items": "3.0",
  "Total_Purchases": "9.0",
  "Average_Order_Value": "94.72",
  "Days_Since_Last_Purchase": "34.0",
  "Discount_Usage_Rate": "46.4",
  "Returns_Rate": "2.0",
  "Email_Open_Rate": "17.9",
  "Customer_Service_Calls": "9.0",
  "Product_Reviews_Written": "4.0",
  "Social_Media_Engagement_Score": "16.3",
  "Mobile_App_Usage": "20.8",
  "Payment_Method_Diversity": "1.0",
  "Lifetime_Value": "953.33",
  "Credit_Balance": "2278.0",
  "Churned": "0",
  "Signup_Quarter": "Q1"
}
```

## Data Quality Notes

The dataset is synthetic and contains a few outliers:

- `Age` ranges from `0` to `200`.
- `Cart_Abandonment_Rate` can exceed `100`.
- `Total_Purchases` includes a small number of negative values.
- All fields are present across sampled records.

The backend preserves the dataset faithfully during seeding. For new API writes, validation is stricter and expects normal ecommerce values such as non-negative purchases.

## MongoDB-Friendly Structure

Primary collection: `customers`

Each raw row becomes one customer document:

```js
{
  customerCode: "CUST-000001",
  age: 43,
  gender: "Male",
  country: "France",
  city: "Marseille",
  membershipYears: 2.9,
  loginFrequency: 14,
  sessionDurationAvg: 27.4,
  pagesPerSession: 6,
  cartAbandonmentRate: 50.6,
  wishlistItems: 3,
  totalPurchases: 9,
  averageOrderValue: 94.72,
  daysSinceLastPurchase: 34,
  discountUsageRate: 46.4,
  returnsRate: 2,
  emailOpenRate: 17.9,
  customerServiceCalls: 9,
  productReviewsWritten: 4,
  socialMediaEngagementScore: 16.3,
  mobileAppUsage: 20.8,
  paymentMethodDiversity: 1,
  lifetimeValue: 953.33,
  creditBalance: 2278,
  churned: false,
  signupQuarter: "Q1",
  isDeleted: false,
  history: [],
  rawRecord: {}
}
```

Support collections:

- `users`: authentication accounts with bcrypt password hashes and roles.
- `sessions`: JWT access/refresh session tracking and revocation.
- `searchlogs`: search trend analytics.
- `systemlogs`: request, error, and security logs.
- `reports`: admin report workflow support.

## Relationships

This dataset is customer-centric, so customer analytics are embedded in the customer document rather than split into separate collections. This supports fast filtering, sorting, pagination, and aggregation without repeated lookups.

References are used only for application concerns:

- `sessions.user -> users._id`
- `searchlogs.user -> users._id`
- `systemlogs.user -> users._id`
- `reports.resolvedBy -> users._id`
- `customers.history.changedBy -> users._id`

## Index Plan

Indexes are added for fields used heavily in filters and sorting:

- `customerCode`
- `country`, `city`, `gender`, `signupQuarter`
- `churned`, `isDeleted`
- `age`, `membershipYears`
- `totalPurchases`, `lifetimeValue`, `creditBalance`
- `loginFrequency`, `mobileAppUsage`, `discountUsageRate`
- `cartAbandonmentRate`, `daysSinceLastPurchase`
- Compound indexes for `country + city`, `churned + lifetimeValue`, and `totalPurchases + lifetimeValue`

## API Mapping

CRUD maps directly to `customers`.

Customer information routes map to equality filters on categorical fields and numeric filters on behavior metrics.

Search routes use regex-based matching for text fields plus semantic shortcuts:

- `high-value`
- `loyal`
- `inactive`
- `mobile`
- `discount`
- `cart`
- `reviews`
- `credit`
- `engagement`
- `churned`
- `premium`

Analytics and statistics routes use MongoDB aggregation pipelines with `$match`, `$group`, `$project`, `$sort`, `$bucket`, and `$sample`.

## CRUD Plan

- Create: validate customer payload, generate `customerCode` if missing, insert document.
- Read: support single record, list records, filters, search, projection, sorting, and pagination.
- Update: `PUT` replaces the full record; `PATCH` updates selected fields.
- Delete: soft delete with `isDeleted: true` and `deletedAt`, preserving history.
- Bulk operations: validate arrays, then insert/update/delete many records together.

Development began only after this dataset structure and schema plan were finalized.
