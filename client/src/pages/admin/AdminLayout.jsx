import React, { useEffect } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { useToast } from '../../components/Toast';

const AdminLayout = () => {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    // Add noindex for admin pages
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    metaTag.content = 'noindex, nofollow';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, redirect to /admin login card
  if (!admin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    addToast('You have been logged out', 'info');
    navigate('/admin', { replace: true });
  };

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Prayers', path: '/admin/prayers', icon: BookOpen },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-cream-100 font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-cream-50 border-r border-cream-300 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Church Branding Header */}
          <div className="p-6 border-b border-cream-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full p-0.5 bg-white border border-gold-300 shadow-2xs overflow-hidden shrink-0">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                    Parish Admin
                  </h2>
                  <p className="text-xs text-gold-700">St. Francis Xavier's</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gold-500 text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:bg-cream-200 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-cream-200 space-y-2">
          <div className="px-4 py-2 bg-cream-100 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span className="truncate">Admin: {admin.username}</span>
            <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-cream-200 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-cream-50/90 backdrop-blur-md border-b border-cream-300/80 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-cream-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-heading font-semibold text-base sm:text-lg text-slate-900">
              St. Francis Xavier's Church, Neduvila — Admin Dashboard
            </h1>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Auto logout after 30 min inactivity
          </div>
        </header>

        {/* Child Pages Content */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

