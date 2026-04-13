import React from 'react';
import { Users, Building2, Calendar, DollarSign, TrendingUp, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Properties', value: '567', icon: Building2, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Bookings', value: '892', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { title: 'Revenue', value: '₱2.4M', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium">
          Administrator
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Users className="w-10 h-10 text-sky-600 mb-4" />
          <h3 className="font-semibold text-lg">User Management</h3>
          <p className="text-gray-600 text-sm mt-1">Manage users, agents, and permissions</p>
        </div>
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Building2 className="w-10 h-10 text-emerald-600 mb-4" />
          <h3 className="font-semibold text-lg">Properties</h3>
          <p className="text-gray-600 text-sm mt-1">Review and manage property listings</p>
        </div>
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Settings className="w-10 h-10 text-gray-600 mb-4" />
          <h3 className="font-semibold text-lg">Settings</h3>
          <p className="text-gray-600 text-sm mt-1">Configure system settings and preferences</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user registered', time: '2 minutes ago', type: 'user' },
            { action: 'Property listed: Luxury Condo in Makati', time: '15 minutes ago', type: 'property' },
            { action: 'Hotel booking confirmed', time: '1 hour ago', type: 'booking' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'property' ? 'bg-emerald-500' :
                  'bg-purple-500'
                }`} />
                <p className="font-medium text-gray-900">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
