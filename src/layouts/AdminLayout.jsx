import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { logout } from '../store/slices/authSlice';

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/staff': return 'Staff & Teachers';
      case '/parents': return 'Parents';
      case '/students': return 'Students';
      case '/academics': return 'Academic Structure';
      case '/courses': return 'Courses';
      case '/questions': return 'Question Bank';
      case '/attendance': return 'Attendance';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobileOpen={isMobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <Topbar title={getTitle()} setMobileOpen={setMobileOpen} />
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
