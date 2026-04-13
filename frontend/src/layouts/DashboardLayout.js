import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Home,
  Heart,
  Calendar,
  Settings,
  Users,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const isActive = (path) => location.pathname.startsWith(path);

  const buyerMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/favorites', label: 'My Favorites', icon: Heart },
    { path: '/bookings', label: 'My Bookings', icon: Calendar },
    { path: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const sellerMenu = [
    { path: '/my-properties', label: 'My Properties', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const agentMenu = [
    { path: '/agent', label: 'Agent Dashboard', icon: Briefcase },
    { path: '/my-properties', label: 'My Listings', icon: Building2 },
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  ];

  const adminMenu = [
    { path: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
    { path: '/dashboard', label: 'Overview', icon: Users },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [...adminMenu, ...buyerMenu];
      case 'agent':
      case 'property_manager':
      case 'unit_manager':
        return [...agentMenu, ...buyerMenu];
      case 'seller':
        return [...sellerMenu, ...buyerMenu];
      default:
        return buyerMenu;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo area */}
          <div className="p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-xl text-gray-900">STARFIELDS</span>
              )}
            </Link>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-20 bg-sky-600 text-white rounded-full p-1 shadow-md hover:bg-sky-700"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sky-700 font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              {isSidebarOpen && (
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
            <Link
              to="/"
              className="text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              Back to Website
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
