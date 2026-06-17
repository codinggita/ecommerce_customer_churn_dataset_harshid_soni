# Ecommerce Customer Churn Backend

A complete Node.js, Express.js, MongoDB, and JWT backend built for the `ecommerce_customer_churn_dataset.json` dataset. The API supports full CRUD, bulk operations, filtering, search, sorting, pagination, analytics, statistics, authentication, protected routes, admin routes, middleware practice routes, Postman testing, dataset seeding, and backup export.

The backend was designed only after analyzing the provided JSON dataset. The dataset planning document is available at `docs/DATASET_ANALYSIS.md`.

## Project Status

Completed and verified:

- JSON dataset analyzed before backend implementation.
- Dataset converted into a MongoDB-friendly customer schema.
- MongoDB collections and relationships planned.
- Express server and MongoDB connection configured.
- MVC folder structure implemented.
- Customer CRUD APIs implemented.
- Filtering, sorting, pagination, projection, route params, and query params implemented.
- MongoDB aggregation routes implemented.
- JWT authentication and role-based admin access implemented.
- Middleware for auth, validation, logging, errors, rate limiting, CORS, Helmet, and compression implemented.
- Soft delete, timestamps, response standardization, async error wrapper, seed script, backup script, and Postman collection included.
- Integration tests added with Jest, Supertest, and MongoDB memory server.

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | Joi |
| Security | Helmet, CORS, rate limiting |
| Logging | Morgan, custom request logger |
| Testing | Jest, Supertest, mongodb-memory-server |
| API Testing | Postman collection |

## Dataset Summary

Dataset file:

```text
data/ecommerce_customer_churn_dataset.json
```

The dataset contains `15,259` ecommerce customer records. Each raw record includes customer demographics, ecommerce activity, purchase behavior, engagement metrics, churn status, and signup quarter.

Raw dataset fields include:

```text
Age
Gender
Country
City
Membership_Years
Login_Frequency
Session_Duration_Avg
Pages_Per_Session
Cart_Abandonment_Rate
Wishlist_Items
Total_Purchases
Average_Order_Value
Days_Since_Last_Purchase
Discount_Usage_Rate
Returns_Rate
Email_Open_Rate
Customer_Service_Calls
Product_Reviews_Written
Social_Media_Engagement_Score
Mobile_App_Usage
Payment_Method_Diversity
Lifetime_Value
Credit_Balance
Churned
Signup_Quarter
```

The seed script normalizes these names into camelCase MongoDB fields and converts string-encoded numbers into numbers.

## MongoDB Collections

| Collection | Purpose |
| --- | --- |
| `customers` | Main normalized customer dataset documents |
| `users` | Auth users with hashed passwords and roles |
| `sessions` | JWT session tracking and token revocation |
| `searchlogs` | Search query logging for trend analytics |
| `systemlogs` | Request, error, and security event logging |
| `reports` | Admin report workflow support |

## Customer Document Shape

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
  deletedAt: null,
  history: []
}
```

## Relationships

Customer analytics fields are embedded directly in each customer document because the dataset is customer-centric and most APIs filter or aggregate on customer behavior.

References are used for application-level data:

| Relationship | Type |
| --- | --- |
| `sessions.user -> users._id` | Reference |
| `searchlogs.user -> users._id` | Reference |
| `systemlogs.user -> users._id` | Reference |
| `reports.resolvedBy -> users._id` | Reference |
| `customers.history.changedBy -> users._id` | Reference |

## Features

Core backend features:

- Node.js project setup with Express.js.
- MongoDB connected through a separate config file.
- Clean MVC architecture.
- Services for business logic.
- Controllers for request and response handling.
- Mongoose schemas with validation and indexes.
- Complete customer CRUD.
- Bulk create, update, and delete.
- Soft delete and restore support.
- Query filtering and dynamic filter builder.
- Sorting and pagination.
- Regex search.
- MongoDB aggregation pipelines.
- JWT authentication.
- Admin role protection.
- Centralized async error handling.
- Standard API response shape.
- Request validation layer.
- Rate limiting.
- Request logging.
- CORS support.
- Security headers.
- Compression.
- Seed script.
- Backup script.
- Postman collection.
- Automated integration tests.

## Folder Structure

```text
.
|-- data/
|   `-- ecommerce_customer_churn_dataset.json
|-- docs/
|   `-- DATASET_ANALYSIS.md
|-- postman/
|   `-- ecommerce-customer-churn-api.postman_collection.json
|-- scripts/
|   |-- backup.js
|   `-- seed.js
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |   |-- database.js
|   |   `-- env.js
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   `-- validators/
|-- tests/
|   `-- customerApi.test.js
|-- .env.example
|-- package.json
`-- README.md
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB server
- Postman, optional but recommended

Check versions:

```bash
node -v
npm -v
mongod --version
```

## Installation

Install project dependencies:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

## Environment Variables

Example `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_customer_churn
JWT_SECRET=change-this-development-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
DEBUG_LOGS=true
```

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment |
| `PORT` | Server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry |
| `CORS_ORIGIN` | Allowed CORS origin |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window |
| `RATE_LIMIT_MAX` | Max requests per window |
| `DEBUG_LOGS` | Enables detailed request logs in development |

## Database Seeding

Seed MongoDB with the full dataset:

```bash
npm run seed
```

The seed command:

- Connects to MongoDB.
- Clears existing customer records.
- Normalizes all raw JSON records.
- Inserts all `15,259` customers.
- Creates demo auth users.

Default seeded users:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Password123!` |
| Customer | `customer@example.com` | `Password123!` |

## Running the Server

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default base URL:

```text
http://localhost:5000
```

Versioned base URL also works:

```text
http://localhost:5000/api/v1
```

Health check:

```bash
curl http://localhost:5000/health
```

## API Response Format

Success response:

```json
{
  "success": true,
  "message": "Customers fetched successfully.",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15259,
    "totalPages": 1526,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Request validation failed.",
  "error": {
    "details": [
      "\"age\" is required"
    ]
  }
}
```

## Authentication Flow

1. Register a user with `POST /auth/register`.
2. Login with `POST /auth/login`.
3. Copy `data.accessToken`.
4. Send protected requests with:

```text
Authorization: Bearer <accessToken>
```

5. Refresh tokens with `POST /jwt/refresh-token`.
6. Logout with `POST /auth/logout`.

## Customer CRUD Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers` | Fetch all customers |
| `GET` | `/customers/:id` | Fetch one customer |
| `POST` | `/customers` | Add a customer |
| `PUT` | `/customers/:id` | Replace complete customer |
| `PATCH` | `/customers/:id` | Update specific fields |
| `DELETE` | `/customers/:id` | Soft delete customer |
| `GET` | `/customers/exists/:id` | Check if customer exists |
| `PATCH` | `/customers/:id/restore` | Restore soft-deleted customer |
| `GET` | `/customers/:id/history` | Get update history |
| `POST` | `/customers/bulk-create` | Insert multiple customers |
| `PATCH` | `/customers/bulk-update` | Update multiple customers |
| `DELETE` | `/customers/bulk-delete` | Soft delete multiple customers |
| `POST` | `/customers/import-json` | Import customers from JSON request body |
| `POST` | `/customers/import-json-file` | Import customers from a JSON file path |

## Customer Information Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers/country/:country` | Customers by country |
| `GET` | `/customers/city/:city` | Customers by city |
| `GET` | `/customers/gender/:gender` | Customers by gender |
| `GET` | `/customers/age/:age` | Customers by exact age |
| `GET` | `/customers/signup-quarter/:quarter` | Customers by signup quarter |
| `GET` | `/customers/login-frequency/:value` | Customers with login frequency greater than or equal to value |
| `GET` | `/customers/session-duration/:value` | Customers with session duration greater than or equal to value |
| `GET` | `/customers/purchases/:value` | Customers with purchases greater than or equal to value |
| `GET` | `/customers/lifetime/:value` | Customers with lifetime value greater than or equal to value |
| `GET` | `/customers/credit/:value` | Customers with credit balance greater than or equal to value |
| `GET` | `/customers/churn-status/:status` | Customers by churn status |
| `GET` | `/customers/mobile-usage/:value` | Customers with mobile usage greater than or equal to value |
| `GET` | `/customers/discount-rate/:value` | Customers with discount rate greater than or equal to value |
| `GET` | `/customers/reviews/:value` | Customers with reviews greater than or equal to value |

## Customer Segment Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers/churned` | Churned customers |
| `GET` | `/customers/active` | Active customers |
| `GET` | `/customers/high-value` | High lifetime value customers |
| `GET` | `/customers/high-purchases` | High purchase customers |
| `GET` | `/customers/high-credit` | High credit balance customers |
| `GET` | `/customers/high-engagement` | Highly engaged customers |
| `GET` | `/customers/high-mobile-usage` | High mobile users |
| `GET` | `/customers/high-discount-users` | High discount users |
| `GET` | `/customers/recent-buyers` | Recently active buyers |
| `GET` | `/customers/inactive` | Inactive customers |
| `GET` | `/customers/top-reviewers` | Customers with most reviews |
| `GET` | `/customers/high-cart-abandonment` | High cart abandonment customers |
| `GET` | `/customers/frequent-logins` | Frequent login customers |
| `GET` | `/customers/loyal` | Loyal customers |
| `GET` | `/customers/premium` | Premium customers |

## Query Parameters

`GET /customers` supports these query parameters:

| Query | Example | Description |
| --- | --- | --- |
| `page` | `/customers?page=1` | Page number |
| `limit` | `/customers?limit=10` | Items per page, max 100 |
| `sort` | `/customers?sort=lifetimeValue` | Sort field |
| `fields` | `/customers?fields=country,city,lifetimeValue` | Field projection |
| `country` | `/customers?country=France` | Filter by country |
| `city` | `/customers?city=Manchester` | Filter by city |
| `gender` | `/customers?gender=Male` | Filter by gender |
| `minAge` | `/customers?minAge=30` | Minimum age |
| `maxAge` | `/customers?maxAge=50` | Maximum age |
| `membershipYears` | `/customers?membershipYears=2` | Minimum membership years |
| `minPurchases` | `/customers?minPurchases=10` | Minimum purchases |
| `minLifetime` | `/customers?minLifetime=1000` | Minimum lifetime value |
| `minCredit` | `/customers?minCredit=2000` | Minimum credit balance |
| `churned` | `/customers?churned=1` | Churn filter |
| `signupQuarter` | `/customers?signupQuarter=Q4` | Signup quarter |
| `minLoginFrequency` | `/customers?minLoginFrequency=10` | Minimum login frequency |
| `minMobileUsage` | `/customers?minMobileUsage=20` | Minimum mobile usage |
| `minDiscountRate` | `/customers?minDiscountRate=40` | Minimum discount usage |
| `minSessionDuration` | `/customers?minSessionDuration=30` | Minimum session duration |
| `search` | `/customers?search=France` | Regex search across customer text fields |

## Sorting

Sort examples:

```text
GET /customers?sort=age
GET /customers?sort=membershipYears
GET /customers?sort=loginFrequency
GET /customers?sort=sessionDuration
GET /customers?sort=purchases
GET /customers?sort=averageOrderValue
GET /customers?sort=lifetimeValue
GET /customers?sort=creditBalance
GET /customers?sort=discountRate
GET /customers?sort=mobileUsage
GET /customers?sort=-createdAt
```

Shortcut sort routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers/sort/age-desc` | Oldest customers first |
| `GET` | `/customers/sort/purchases-desc` | Highest purchases first |
| `GET` | `/customers/sort/lifetime-desc` | Highest lifetime value first |
| `GET` | `/customers/sort/login-desc` | Highest login activity first |
| `GET` | `/customers/sort/credit-desc` | Highest credit balance first |

## Search Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/search/customers?q=france` | Search by keyword |
| `GET` | `/search/customers?q=manchester` | Search by city |
| `GET` | `/search/customers?q=male` | Search by gender |
| `GET` | `/search/customers?q=q4` | Search by signup quarter |
| `GET` | `/search/customers?q=high-value` | Search high-value customers |
| `GET` | `/search/customers?q=loyal` | Search loyal customers |
| `GET` | `/search/customers?q=inactive` | Search inactive customers |
| `GET` | `/search/customers?q=mobile` | Search mobile users |
| `GET` | `/search/customers?q=discount` | Search discount users |
| `GET` | `/search/customers?q=cart` | Search cart abandonment customers |
| `GET` | `/search/customers?q=reviews` | Search reviewer customers |
| `GET` | `/search/customers?q=credit` | Search credit balance customers |
| `GET` | `/search/customers?q=engagement` | Search engaged customers |
| `GET` | `/search/customers?q=churned` | Search churned customers |
| `GET` | `/search/customers?q=premium` | Search premium customers |

## Filter Shortcut Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers/filter/high-purchases` | High purchases |
| `GET` | `/customers/filter/high-lifetime` | High lifetime value |
| `GET` | `/customers/filter/high-credit` | High credit balance |
| `GET` | `/customers/filter/high-login` | High login activity |
| `GET` | `/customers/filter/high-mobile` | High mobile usage |
| `GET` | `/customers/filter/high-discount` | High discount usage |
| `GET` | `/customers/filter/high-cart-abandonment` | High cart abandonment |
| `GET` | `/customers/filter/high-engagement` | High engagement |
| `GET` | `/customers/filter/high-reviews` | High reviews |
| `GET` | `/customers/filter/churned` | Churned customers |
| `GET` | `/customers/filter/active` | Active customers |
| `GET` | `/customers/filter/low-session` | Low session duration |
| `GET` | `/customers/filter/high-session` | High session duration |
| `GET` | `/customers/filter/high-order-value` | High order value |
| `GET` | `/customers/filter/loyal` | Loyal customers |

## Analytics Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/analytics/customers/top-buyers` | Top purchasing customers |
| `GET` | `/analytics/customers/top-lifetime` | Top lifetime value customers |
| `GET` | `/analytics/customers/top-credit` | Top credit balance customers |
| `GET` | `/analytics/customers/top-engagement` | Top engagement customers |
| `GET` | `/analytics/customers/top-mobile-users` | Top mobile users |
| `GET` | `/analytics/customers/top-discount-users` | Top discount users |
| `GET` | `/analytics/customers/top-reviewers` | Top reviewers |
| `GET` | `/analytics/customers/churn-analysis` | Churn analysis |
| `GET` | `/analytics/customers/retention` | Retention analysis |
| `GET` | `/analytics/customers/session-analysis` | Session duration analysis |
| `GET` | `/analytics/customers/purchase-analysis` | Purchase analysis |
| `GET` | `/analytics/customers/country-analysis` | Country distribution |
| `GET` | `/analytics/customers/city-analysis` | City distribution |
| `GET` | `/analytics/customers/signup-analysis` | Signup quarter distribution |
| `GET` | `/analytics/customers/payment-analysis` | Payment method diversity |

## Statistics Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/stats/customers/count` | Total customers |
| `GET` | `/stats/customers/average-age` | Average age |
| `GET` | `/stats/customers/average-lifetime` | Average lifetime value |
| `GET` | `/stats/customers/average-credit` | Average credit balance |
| `GET` | `/stats/customers/average-order-value` | Average order value |
| `GET` | `/stats/customers/highest-purchases` | Highest purchasing customer |
| `GET` | `/stats/customers/highest-lifetime` | Highest lifetime customer |
| `GET` | `/stats/customers/highest-credit` | Highest credit customer |
| `GET` | `/stats/customers/country-count` | Count by country |
| `GET` | `/stats/customers/city-count` | Count by city |
| `GET` | `/stats/customers/gender-count` | Count by gender |
| `GET` | `/stats/customers/churn-count` | Active and churned counts |
| `GET` | `/stats/customers/signup-quarter-count` | Count by signup quarter |
| `GET` | `/stats/customers/review-count` | Review statistics |
| `GET` | `/stats/customers/mobile-usage` | Mobile usage statistics |

## Advanced Customer Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers/random` | Random customer |
| `GET` | `/customers/trending` | Trending customer analytics |
| `GET` | `/customers/recent` | Recently active customers |
| `GET` | `/customers/recommendations` | Marketing recommendations |
| `GET` | `/customers/predictions/churn` | Churn risk prediction |
| `GET` | `/customers/predictions/retention` | Retention trend prediction |
| `GET` | `/customers/segments/premium` | Premium segment |
| `GET` | `/customers/segments/high-value` | High-value segment |
| `GET` | `/customers/segments/loyal` | Loyal segment |
| `GET` | `/customers/segments/risky` | Risky segment |
| `GET` | `/customers/segments/inactive` | Inactive segment |
| `GET` | `/customers/heatmap/countries` | Country heatmap data |
| `GET` | `/customers/heatmap/cities` | City heatmap data |
| `GET` | `/customers/insights/purchases` | Purchase insights |
| `GET` | `/customers/insights/mobile-usage` | Mobile usage insights |
| `GET` | `/customers/insights/discounts` | Discount insights |
| `GET` | `/customers/insights/engagement` | Engagement insights |
| `GET` | `/customers/alerts/high-churn` | High churn alerts |
| `GET` | `/customers/alerts/inactive-users` | Inactive user alerts |
| `GET` | `/customers/alerts/high-cart-abandonment` | Cart abandonment alerts |
| `GET` | `/customers/system/health` | Customer API health |
| `GET` | `/customers/system/version` | API version details |
| `GET` | `/customers/system/config` | Public API config |
| `POST` | `/customers/cache/clear` | Clear in-memory cache |
| `GET` | `/customers/logs` | API logs |
| `GET` | `/customers/activity` | Recent API activity |
| `GET` | `/customers/live-search?q=france` | Live search |
| `GET` | `/customers/dashboard/summary` | Dashboard summary |
| `GET` | `/customers/dashboard/revenue` | Revenue dashboard |

## Authentication Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/logout` | Logout current session |
| `GET` | `/auth/profile` | Fetch authenticated profile |
| `PATCH` | `/auth/profile` | Update authenticated profile |
| `DELETE` | `/auth/profile` | Delete profile |
| `POST` | `/auth/forgot-password` | Generate password reset token |
| `POST` | `/auth/reset-password` | Reset password |
| `POST` | `/auth/change-password` | Change current password |
| `POST` | `/auth/verify-email` | Verify email |
| `POST` | `/auth/send-otp` | Send OTP |
| `POST` | `/auth/verify-otp` | Verify OTP |
| `POST` | `/auth/resend-verification` | Resend verification OTP |
| `GET` | `/auth/session` | Fetch active sessions |
| `DELETE` | `/auth/session` | Logout all sessions |

## JWT Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/jwt/profile` | JWT protected profile |
| `GET` | `/jwt/dashboard` | JWT protected dashboard |
| `POST` | `/jwt/generate-token` | Generate JWT token |
| `POST` | `/jwt/verify-token` | Verify JWT token |
| `POST` | `/jwt/refresh-token` | Refresh access token |
| `DELETE` | `/jwt/revoke-token` | Revoke token |
| `GET` | `/jwt/private-customers` | Protected customer records |
| `GET` | `/jwt/private-stats` | Protected stats |
| `GET` | `/jwt/admin` | Admin-only JWT route |
| `GET` | `/jwt/customer-insights` | Protected insights |

## Admin Routes

Admin routes require:

```text
Authorization: Bearer <adminAccessToken>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/admin/customers` | Admin customer list |
| `GET` | `/admin/dashboard` | Admin dashboard |
| `GET` | `/admin/stats` | Admin stats |
| `GET` | `/admin/churn-analysis` | Admin churn analysis |
| `GET` | `/admin/users` | All users |
| `GET` | `/admin/users/:id` | User details |
| `PATCH` | `/admin/users/:id/ban` | Ban user |
| `PATCH` | `/admin/users/:id/unban` | Unban user |
| `PATCH` | `/admin/users/:id/role` | Change role |
| `GET` | `/admin/reports` | Reports |
| `PATCH` | `/admin/reports/:id/resolve` | Resolve report |
| `GET` | `/admin/system/health` | System health |
| `GET` | `/admin/system/logs` | System logs |
| `POST` | `/admin/system/maintenance` | Toggle maintenance |
| `DELETE` | `/admin/cache/clear` | Clear cache |
| `GET` | `/admin/security/events` | Security events |

## Protected Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/protected/customers` | Protected customer create |
| `PATCH` | `/protected/customers/:id` | Protected customer update |
| `DELETE` | `/protected/customers/:id` | Protected customer delete |

## Middleware Practice Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/middleware/logger` | Request logger middleware demo |
| `GET` | `/middleware/auth` | Auth middleware demo |
| `GET` | `/middleware/cache` | Cache middleware demo |
| `GET` | `/middleware/rate-limit` | Rate limit middleware demo |
| `GET` | `/middleware/error-handler` | Error handler demo |
| `GET` | `/middleware/request-time` | Request timing middleware demo |
| `GET` | `/middleware/security` | Security middleware demo |
| `GET` | `/middleware/cors` | CORS middleware demo |
| `GET` | `/middleware/compression` | Compression middleware demo |
| `POST` | `/middleware/validation` | Validation middleware demo |

## HEAD and OPTIONS

Express automatically supports `HEAD` for matching `GET` routes. The project also returns communication options for `OPTIONS` requests with:

```text
Allow: GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS
```

Examples:

```text
HEAD /customers
HEAD /customers/:id
HEAD /stats/customers/count
HEAD /analytics/customers/top-buyers
HEAD /auth/profile
HEAD /customers/system/health
OPTIONS /customers
OPTIONS /customers/:id
OPTIONS /auth/login
OPTIONS /admin/customers
OPTIONS /search/customers
OPTIONS /jwt/profile
OPTIONS /customers/system/health
```

## Request Body Examples

Create customer:

```json
{
  "age": 32,
  "gender": "Female",
  "country": "France",
  "city": "Paris",
  "membershipYears": 3,
  "loginFrequency": 15,
  "sessionDurationAvg": 28,
  "pagesPerSession": 8,
  "cartAbandonmentRate": 42,
  "wishlistItems": 4,
  "totalPurchases": 18,
  "averageOrderValue": 125,
  "daysSinceLastPurchase": 12,
  "discountUsageRate": 35,
  "returnsRate": 4,
  "emailOpenRate": 22,
  "customerServiceCalls": 2,
  "productReviewsWritten": 5,
  "socialMediaEngagementScore": 48,
  "mobileAppUsage": 21,
  "paymentMethodDiversity": 3,
  "lifetimeValue": 2250,
  "creditBalance": 1500,
  "churned": false,
  "signupQuarter": "Q4"
}
```

Patch customer:

```json
{
  "lifetimeValue": 2600,
  "loginFrequency": 19
}
```

Bulk update:

```json
{
  "ids": [
    "CUSTOMER_MONGO_ID_1",
    "CUSTOMER_MONGO_ID_2"
  ],
  "update": {
    "churned": true
  }
}
```

Register:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password123!",
  "role": "customer"
}
```

Login:

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

## Combination Query Examples

```text
GET /customers?country=France&sort=lifetimeValue&page=1&limit=10
GET /customers?city=Manchester&minPurchases=10&sort=purchases&page=1&limit=10
GET /customers?gender=Male&minCredit=2000&sort=creditBalance&page=1&limit=15
GET /customers?signupQuarter=Q4&minMobileUsage=20&sort=mobileUsage&page=1&limit=10
GET /customers?country=Canada&minDiscountRate=10&sort=discountRate&page=1&limit=10
GET /customers?country=France&minSessionDuration=20&sort=sessionDuration&page=1&limit=10
GET /customers?city=Vancouver&minPurchases=5&sort=averageOrderValue&page=1&limit=10
GET /customers?gender=Female&minLifetime=1000&sort=lifetimeValue&page=1&limit=10
GET /customers?country=UK&minCredit=2000&sort=creditBalance&page=1&limit=15
```

## MongoDB Aggregation Usage

Aggregation is used for:

- Churn analysis.
- Retention analysis.
- Session duration buckets.
- Purchase analysis.
- Country, city, gender, and signup-quarter counts.
- Payment method diversity.
- Dashboard summaries.
- Search trend analysis.

Pipeline stages used include:

```text
$match
$group
$project
$sort
$bucket
$sample
$addFields
```

## Validation Rules

The API validates customer create, replace, patch, import, bulk update, auth register, auth login, OTP, password reset, and password change requests.

Examples:

- `age` must be numeric.
- `gender` must be `Male`, `Female`, or `Other`.
- `signupQuarter` must be `Q1`, `Q2`, `Q3`, or `Q4`.
- Purchases and monetary fields must be valid numbers for new API writes.
- Email and password are validated for auth routes.
- Pagination values must be positive integers.

## Error Handling

The project includes centralized error handling for:

- Invalid MongoDB IDs.
- Missing required fields.
- Joi validation errors.
- Mongoose validation errors.
- Duplicate customer or user records.
- Invalid login credentials.
- Unauthorized admin access.
- Invalid pagination.
- Empty search queries.
- Invalid churn status values.
- Unknown routes.

## Rate Limiting

Rate limiting is applied to:

- General API requests.
- Login and register routes.
- Search routes.
- Admin routes.
- Analytics routes.

This helps prevent brute-force login attempts and excessive API usage.

## Postman Testing

Import this collection into Postman:

```text
postman/ecommerce-customer-churn-api.postman_collection.json
```

Collection variables:

| Variable | Description |
| --- | --- |
| `baseUrl` | Defaults to `http://localhost:5000` |
| `token` | JWT access token |
| `refreshToken` | JWT refresh token |
| `customerId` | Customer document ID |

Recommended Postman flow:

1. Run `npm run seed`.
2. Start server with `npm run dev`.
3. Run `Authentication -> Login`.
4. Token is saved into the `token` variable.
5. Test customer, admin, analytics, stats, and protected routes.

## Testing

Run the automated test suite:

```bash
npm test
```

The tests cover:

- Health route.
- Customer create, list, read, update, and soft delete.
- Customer validation errors.
- Filter routes.
- Search routes.
- Analytics routes.
- Stats routes.
- Register and login.
- JWT protected profile.
- Admin access.
- Unauthorized admin protection.

## Backup

Export customer documents:

```bash
npm run backup
```

Backup files are written to:

```text
backups/
```

## Available npm Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start server with Node |
| `npm run dev` | Start server with Nodemon |
| `npm run seed` | Seed MongoDB with dataset |
| `npm run backup` | Export customer documents |
| `npm test` | Run integration tests |
| `npm run test:watch` | Run tests in watch mode |

## System Design Notes

The backend follows a monolithic architecture:

- One Express server.
- One MongoDB database.
- MVC code organization.
- Centralized middleware.
- Services for business logic.
- Models for database structure.

Scaling concepts considered:

- Indexes support frequent filter and sort fields.
- Pagination limits large responses.
- Rate limiting protects heavy endpoints.
- Aggregation keeps analytics inside MongoDB.
- Soft delete preserves data history.
- JWT sessions allow token revocation.

Future production scaling options:

- Add Redis caching.
- Add a load balancer.
- Add MongoDB replication.
- Add sharding for very large customer datasets.
- Move logs to a dedicated observability system.
- Split analytics into background jobs if traffic grows.

## Troubleshooting

MongoDB connection fails:

```text
Check that MongoDB is running and MONGODB_URI is correct.
```

Seed inserts zero records:

```text
Check that data/ecommerce_customer_churn_dataset.json exists.
```

Admin route returns 401:

```text
Login first and send Authorization: Bearer <token>.
```

Admin route returns 403:

```text
Use the seeded admin account or register a user with role admin.
```

Search returns 400:

```text
Provide a non-empty q query parameter.
Example: /search/customers?q=france
```

Pagination returns 400:

```text
Use positive page and limit values.
Example: /customers?page=1&limit=10
```

Port already in use:

```text
Change PORT in .env or stop the process using port 5000.
```

## Important Files

| File | Purpose |
| --- | --- |
| `docs/DATASET_ANALYSIS.md` | Dataset understanding and schema plan |
| `src/models/Customer.js` | Customer MongoDB schema |
| `src/services/customerService.js` | Customer business logic |
| `src/services/analyticsService.js` | Aggregation logic |
| `src/services/authService.js` | Auth and JWT session logic |
| `src/routes/customerRoutes.js` | Customer route definitions |
| `src/app.js` | Express app setup |
| `src/server.js` | Server startup |
| `scripts/seed.js` | Dataset seed script |
| `scripts/backup.js` | Database backup script |
| `tests/customerApi.test.js` | Integration tests |
| `postman/ecommerce-customer-churn-api.postman_collection.json` | Postman API collection |

## Final Verification Checklist

- Run `npm install`.
- Create `.env`.
- Run `npm run seed`.
- Run `npm test`.
- Start server with `npm run dev`.
- Open `http://localhost:5000/health`.
- Import Postman collection.
- Login as admin.
- Test CRUD, filters, search, analytics, stats, protected routes, and admin routes.
