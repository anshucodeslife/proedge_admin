import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { fetchStats } from '../../store/slices/dashboardSlice';
import { Activity, Eye, Globe, Clock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatsCard = ({ title, value, subtext, color, icon: Icon }) => {
  const borderColors = {
    teal: 'border-l-4 border-l-teal-500',
    indigo: 'border-l-4 border-l-indigo-500',
    blue: 'border-l-4 border-l-blue-500',
  };
  const textColors = {
    teal: 'text-teal-500',
    indigo: 'text-indigo-500',
    blue: 'text-blue-500',
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${borderColors[color] || 'border-l-4 border-l-gray-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
          <div className="flex items-center gap-1 text-sm">
            <span className={`font-medium ${textColors[color]}`}>{subtext}</span>
          </div>
        </div>
        {Icon && <Icon className={`opacity-20 ${textColors[color]}`} size={32} />}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, traffic, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading && !stats) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, Superadmin. Here's what's happening today.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/students" className="block transform hover:translate-y-[-2px] transition-all duration-200 group">
          <Card className="p-6 border-l-4 border-emerald-500 h-full hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-slate-500 mb-2 font-medium">Total Students</div>
                <div className="text-3xl font-bold text-slate-800">{stats?.totalStudents || 0}</div>
                <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
                  Active Users <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/courses" className="block transform hover:translate-y-[-2px] transition-all duration-200 group">
          <Card className="p-6 border-l-4 border-blue-500 h-full hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-slate-500 mb-2 font-medium">Total Courses</div>
                <div className="text-3xl font-bold text-slate-800">{stats?.totalCourses || 0}</div>
                <div className="text-xs text-blue-600 font-medium mt-2 flex items-center">
                  Course Catalog <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/enrollments" className="block transform hover:translate-y-[-2px] transition-all duration-200 group">
          <Card className="p-6 border-l-4 border-indigo-500 h-full hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-slate-500 mb-2 font-medium">Active Enrollments</div>
                <div className="text-3xl font-bold text-slate-800">{stats?.activeEnrollments || 0}</div>
                <div className="text-xs text-indigo-600 font-medium mt-2 flex items-center">
                  Student Engagements <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/payments" className="block transform hover:translate-y-[-2px] transition-all duration-200 group">
          <Card className="p-6 border-l-4 border-amber-500 h-full hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-slate-500 mb-2 font-medium">Total Revenue</div>
                <div className="text-3xl font-bold text-slate-800">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
                <div className="text-xs text-amber-600 font-medium mt-2 flex items-center">
                  Lifetime Earnings <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Traffic Stats Section */}
      {traffic && (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Website Traffic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              title="Today's Views"
              value={traffic.today?.views || 0}
              subtext={`${traffic.today?.unique || 0} Unique Visitors`}
              color="teal"
              icon={Eye}
            />
            <StatsCard
              title="Yesterday's Views"
              value={traffic.yesterday?.views || 0}
              subtext={`${traffic.yesterday?.unique || 0} Unique Visitors`}
              color="indigo"
              icon={Clock}
            />
            <StatsCard
              title="Last Hour"
              value={traffic.lastHour?.views || 0}
              subtext="Page Views"
              color="blue"
              icon={Globe}
            />
          </div>

          {/* Traffic Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Last 24 Hours Activity</h4>
            <div className="w-full h-full pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic.chart || []}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    interval={2}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
