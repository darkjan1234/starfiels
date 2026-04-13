import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import { Heart, Building2, Calendar, TrendingUp, Eye, ArrowRight, Loader } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/bookings'),
      ]);
      setStats(statsRes.data.stats);
      setRecentActivity(activityRes.data.bookings || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'My Favorites',
      value: stats?.favoritesCount || 0,
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      link: '/favorites',
    },
    {
      title: 'My Properties',
      value: stats?.propertiesCount || 0,
      icon: Building2,
      color: 'bg-sky-100 text-sky-600',
      link: '/my-properties',
    },
    {
      title: 'My Bookings',
      value: (stats?.hotelBookings || 0) + (stats?.tourBookings || 0),
      icon: Calendar,
      color: 'bg-emerald-100 text-emerald-600',
      link: '/bookings',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-purple-100 text-purple-600',
      link: '/my-properties',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Bookings</h3>
            <Link to="/bookings" className="text-sky-600 text-sm hover:text-sky-700 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent bookings</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.hotel_name || 'Booking'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.check_in_date).toLocaleDateString()} - {booking.status}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/real-estate" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Browse Properties</p>
                <p className="text-sm text-gray-500">Find your dream home</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </Link>
            <Link to="/hotels" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Book a Hotel</p>
                <p className="text-sm text-gray-500">Plan your next getaway</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </Link>
            <Link to="/my-properties/new" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">List a Property</p>
                <p className="text-sm text-gray-500">Sell or rent your property</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
