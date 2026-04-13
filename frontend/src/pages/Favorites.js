import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { Heart, MapPin, Bed, Bath, Square, Trash2, Loader } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/users/favorites');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await api.post(`/properties/${propertyId}/favorite`);
      setFavorites(favorites.filter(f => f.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-4">Start saving properties you're interested in</p>
          <Link to="/real-estate" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property.id} className="card overflow-hidden group">
              <div className="relative h-56">
                <img
                  src={property.main_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <Link to={`/properties/${property.id}`} className="block p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
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
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
