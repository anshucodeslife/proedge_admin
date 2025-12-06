import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { fetchStats } from '../../store/slices/dashboardSlice';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading) {
    return <div className="p-8 text-center">Loading stats...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, Superadmin. Here's what's happening today.</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-emerald-500">
          <div className="text-slate-500 mb-2">Total Students</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.totalStudents || 0}</div>
          <div className="text-xs text-emerald-600 font-medium mt-2">↗ +12 this month</div>
        </Card>
        <Card className="p-6 border-l-4 border-blue-500">
          <div className="text-slate-500 mb-2">Total Staff</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.totalStaff || 0}</div>
          <div className="text-xs text-slate-400 font-medium mt-2">→ Stable</div>
        </Card>
        <Card className="p-6 border-l-4 border-indigo-500">
          <div className="text-slate-500 mb-2">Active Classes</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.activeClasses || 0}</div>
          <div className="text-xs text-indigo-600 font-medium mt-2">All sessions active</div>
        </Card>
        <Card className="p-6 border-l-4 border-amber-500">
          <div className="text-slate-500 mb-2">Avg Attendance</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.avgAttendance || 0}%</div>
          <div className="text-xs text-amber-600 font-medium mt-2">↘ -2% from last week</div>
        </Card>
      </div>
      <Card className="h-64 flex items-center justify-center text-slate-400 bg-slate-50/50 border-dashed">
        <p>Activity Chart Placeholder</p>
      </Card>
    </div>
  );
};
