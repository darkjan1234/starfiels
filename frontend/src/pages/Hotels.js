import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { MapPin, Star, Search, Filter, Loader, Calendar, Users, ChevronRight, Home } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    checkIn: null,
    checkOut: null,
    guests: 2,
    starRating: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <div className="bg-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Stay</h1>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={filters.checkIn}
                  onChange={(date) => setFilters({ ...filters, checkIn: date })}
                  placeholderText="Check-in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  minDate={new Date()}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={filters.checkOut}
                  onChange={(date) => setFilters({ ...filters, checkOut: date })}
                  placeholderText="Check-out"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  minDate={filters.checkIn || new Date()}
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Search Hotels
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
            <Link to="/" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <MapPin size={16} />
              <span>Hotels & Resorts</span>
            </span>
            {filters.search && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900">Search: "{filters.search}"</span>
              </>
            )}
            {filters.starRating && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900">{filters.starRating} Star</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={18} />
            <span className="font-medium">Filter by:</span>
          </div>
          <select
            value={filters.starRating}
            onChange={(e) => setFilters({ ...filters, starRating: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Star</option>
            <option value="4">4 Star</option>
            <option value="3">3 Star</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hotels found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.id}`}
                className="group card hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.main_image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hotel.is_featured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < (hotel.star_rating || 0) ? 'currentColor' : 'none'}
                        className={i < (hotel.star_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {hotel.review_count || 0} reviews
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{hotel.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                    <MapPin size={14} />
                    {hotel.city_name}, {hotel.province_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatPrice(hotel.min_price || 0)}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {hotel.property_type || 'Hotel'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
