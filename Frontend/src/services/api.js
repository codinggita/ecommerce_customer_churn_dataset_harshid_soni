import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token if auth is implemented later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchDashboardStats = async () => {
  try {
    const [
      countRes,
      churnRes,
      aovRes,
      ltvRes,
      signupRes,
      churnAnalysisRes
    ] = await Promise.all([
      api.get('/stats/customers/count'),
      api.get('/stats/customers/churn-count'),
      api.get('/stats/customers/average-order-value'),
      api.get('/stats/customers/average-lifetime'),
      api.get('/stats/customers/signup-quarter-count'),
      api.get('/analytics/customers/churn-analysis')
    ]);

    return {
      totalCustomers: countRes.data.data.count || 0,
      churnedCustomers: churnRes.data.data.churned || 0,
      activeCustomers: churnRes.data.data.active || 0,
      churnRate: churnRes.data.data.churnRate || 0,
      averageOrderValue: aovRes.data.data.average || 0,
      averageLifetimeValue: ltvRes.data.data.average || 0,
      signupHistory: signupRes.data.data.groups || [],
      churnAnalysis: churnAnalysisRes.data.data || null,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};

export default api;
