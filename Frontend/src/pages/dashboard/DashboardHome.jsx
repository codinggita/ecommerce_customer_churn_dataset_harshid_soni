import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../services/api';
import { Users, UserX, DollarSign, Activity, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      </div>
    );
  }

  // Formatting for charts
  const signupData = stats?.signupHistory?.map(item => ({
    name: `Q${item._id}`,
    signups: item.count
  })).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const churnData = [
    { name: 'Active', value: stats?.activeCustomers || 0 },
    { name: 'Churned', value: stats?.churnedCustomers || 0 }
  ];

  const PIE_COLORS = ['#10b981', '#f43f5e'];

  const SummaryCard = ({ title, value, icon: Icon, trend, prefix = '' }) => (
    <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 group hover:bg-slate-800/80 transition-all duration-300 shadow-xl shadow-black/20">
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
        <Icon size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 font-medium tracking-wide">{title}</h3>
          <div className="p-2 bg-slate-700/50 rounded-lg text-indigo-400">
            <Icon size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            {prefix}{value}
          </span>
          {trend && (
            <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome back. Here's what's happening with your customers today.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Customers" 
          value={stats?.totalCustomers?.toLocaleString()} 
          icon={Users} 
        />
        <SummaryCard 
          title="Churn Rate" 
          value={`${(stats?.churnRate * 100).toFixed(1)}%`} 
          icon={Activity} 
        />
        <SummaryCard 
          title="Avg Order Value" 
          value={stats?.averageOrderValue?.toFixed(2)} 
          prefix="$"
          icon={DollarSign} 
        />
        <SummaryCard 
          title="Avg Lifetime Value" 
          value={stats?.averageLifetimeValue?.toFixed(2)} 
          prefix="$"
          icon={TrendingUp} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-400" />
            Customer Signups by Quarter
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <UserX size={20} className="text-rose-400" />
            Customer Churn Ratio
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
