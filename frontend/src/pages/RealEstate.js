import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../store/authStore';
import { MapPin, Bed, Bath, Square, Search, Filter, Grid, List, Loader, ChevronRight, Home } from 'lucide-react';

const RealEstate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listingType: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    region: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [searchParams, pagination.page]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.listingType) params.set('listingType', filters.listingType);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
      if (filters.region) params.set('region', filters.region);
      params.set('page', pagination.page);
      params.set('limit', '12');

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <div className="bg-sky-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Property</h1>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <select
                value={filters.listingType}
                onChange={(e) => handleFilterChange('listingType', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="preselling">Pre-selling</option>
              </select>
              <button
                onClick={applyFilters}
                className="btn-primary py-3 px-8"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
            <Link to="/" className="flex items-center gap-1 hover:text-sky-600 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="flex items-center gap-1 text-sky-600 font-medium">
              <MapPin size={16} />
              <span>Real Estate</span>
            </span>
            {filters.search && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900">Search: "{filters.search}"</span>
              </>
            )}
            {filters.listingType && (
              <>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-gray-900 capitalize">For {filters.listingType}</span>
              </>
            )}
            <span className="ml-auto text-xs text-gray-500 hidden sm:block">
              Showing {pagination.total} properties
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={18} />
                <h3 className="font-semibold">Filters</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${pagination.total} properties found`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-sky-100 text-sky-600' : 'text-gray-400'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-sky-100 text-sky-600' : 'text-gray-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-sky-600" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No properties found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {properties.map((property) => (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className={`group card hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 h-48' : 'h-56'}`}>
                      <img
                        src={property.main_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                          property.listing_type === 'sale' ? 'bg-sky-600 text-white' :
                          property.listing_type === 'rent' ? 'bg-emerald-600 text-white' :
                          'bg-purple-600 text-white'
                        }`}>
                          For {property.listing_type}
                        </span>
                      </div>
                      {property.is_featured && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                        <MapPin size={14} />
                        {property.city_name}, {property.province_name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {property.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed size={14} /> {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath size={14} /> {property.bathrooms}
                          </span>
                        )}
                        {property.floor_area > 0 && (
                          <span className="flex items-center gap-1">
                            <Square size={14} /> {property.floor_area}m²
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold text-sky-600">{formatPrice(property.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      pagination.page === page
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstate;
