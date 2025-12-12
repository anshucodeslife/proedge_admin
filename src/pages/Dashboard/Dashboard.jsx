import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStats } from '../../store/slices/dashboardSlice';
import {
  Activity, Eye, Globe, Clock, ChevronRight, Users, BookOpen,
  GraduationCap, TrendingUp, IndianRupee, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModernStatsCard = ({ title, value, subtext, icon: Icon, color, to }) => {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'hover:shadow-emerald-500/20'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      gradient: 'from-blue-500 to-indigo-500',
      shadow: 'hover:shadow-blue-500/20'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      gradient: 'from-indigo-500 to-violet-500',
      shadow: 'hover:shadow-indigo-500/20'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      iconBg: 'bg-amber-100',
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'hover:shadow-amber-500/20'
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      iconBg: 'bg-teal-100',
      gradient: 'from-teal-400 to-emerald-500',
      shadow: 'hover:shadow-teal-500/20'
    },
  };

  const style = colorStyles[color] || colorStyles.blue;
  const Wrapper = to ? Link : 'div';

  return (
    <Wrapper
      to={to}
      className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl ${style.shadow} transition-all duration-300 group`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
              {subtext}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} text-${color}-600 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={style.text} />
        </div>
      </div>

      {/* Decorative Gradient Blob */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${style.gradient} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`} />
    </Wrapper>
  );
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, traffic, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ModernStatsCard
          to="/students"
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtext="Active Learners"
          icon={Users}
          color="emerald"
        />
        <ModernStatsCard
          to="/courses"
          title="Total Courses"
          value={stats?.totalCourses || 0}
          subtext="Course Catalog"
          icon={BookOpen}
          color="blue"
        />
        <ModernStatsCard
          to="/enrollments"
          title="Active Enrollments"
          value={stats?.activeEnrollments || 0}
          subtext="Engagements"
          icon={GraduationCap}
          color="indigo"
        />
        <ModernStatsCard
          to="/payments"
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          subtext="Lifetime Earnings"
          icon={IndianRupee}
          color="amber"
        />
      </div>

      {/* Traffic Stats Section */}
      {traffic && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Website Traffic</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ModernStatsCard
                  title="Today's Views"
                  value={traffic.today?.views || 0}
                  subtext={`${traffic.today?.unique || 0} Unique Visitors`}
                  icon={Eye}
                  color="teal"
                />
                <ModernStatsCard
                  title="Yesterday's Views"
                  value={traffic.yesterday?.views || 0}
                  subtext={`${traffic.yesterday?.unique || 0} Unique Visitors`}
                  icon={Clock}
                  color="indigo"
                />
              </div>
            </div>

            {/* Traffic Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Traffic Trends</h4>
                  <p className="text-sm text-slate-500">Last 24 hours activity</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold">
                  <TrendingUp size={14} />
                  <span>Live</span>
                </div>
              </div>

              <div className="w-full h-[300px]">
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
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      interval={2}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVisits)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
