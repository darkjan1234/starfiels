import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { Plus, MapPin, Bed, Bath, Loader, Eye, Edit2, Trash2 } from 'lucide-react';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/users/properties');
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'sold':
        return 'bg-blue-100 text-blue-700';
      case 'rented':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <Link to="/my-properties/new" className="btn-primary">
          <Plus size={18} className="mr-2" />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-4">Start listing your properties for sale or rent</p>
          <Link to="/my-properties/new" className="btn-primary">
            <Plus size={18} className="mr-2" />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="card p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={property.main_image || 'https://via.placeholder.com/200x150?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                      <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin size={14} />
                        {property.city_name}, {property.province_name}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-sky-600">{formatPrice(property.price)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <span className="flex items-center gap-1">
                      <Bed size={14} /> {property.bedrooms || 0} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={14} /> {property.bathrooms || 0} baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {property.view_count || 0} views
                    </span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/properties/${property.id}`}
                    className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                  </Link>
                  <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit2 size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
