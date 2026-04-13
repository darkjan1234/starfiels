import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Briefcase, Users, DollarSign, TrendingUp, Target, Phone } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Leads', value: '24', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Closed Deals', value: '8', icon: Target, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Commission', value: '₱125,000', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Conversion Rate', value: '33%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full font-medium capitalize">
          {user?.role}
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

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-sky-50 rounded-lg text-center hover:bg-sky-100 transition-colors">
            <Briefcase className="w-8 h-8 text-sky-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Add New Lead</p>
          </button>
          <button className="p-4 bg-emerald-50 rounded-lg text-center hover:bg-emerald-100 transition-colors">
            <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Schedule Call</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Set Target</p>
          </button>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Leads</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">John Doe {i}</p>
                <p className="text-sm text-gray-500">Interested in Condo in Makati</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                New
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
