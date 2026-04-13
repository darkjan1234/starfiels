import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { useAuthStore } from '../store/authStore';
import { MapPin, Bed, Bath, Square, Heart, Share, Phone, Mail, Calendar, Loader, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.property);
      setIsFavorite(response.data.property.isFavorited);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.post(`/properties/${id}/favorite`);
      setIsFavorite(response.data.isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [{ url: 'https://via.placeholder.com/800x600?text=No+Image' }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-[500px] bg-gray-900">
        <img
          src={images[activeImage]?.url || images[0]?.url}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.slice(0, 6).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === idx ? 'border-white' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Back button */}
        <Link
          to="/real-estate"
          className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white font-medium flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back to listings
        </Link>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-lg backdrop-blur-sm transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white">
            <Share size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                  property.listing_type === 'sale' ? 'bg-sky-100 text-sky-700' :
                  property.listing_type === 'rent' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  For {property.listing_type}
                </span>
                {property.property_type_name && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {property.property_type_name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin size={18} />
                {property.address}, {property.city_name}, {property.province_name}
              </p>
            </div>

            {/* Price */}
            <div className="card p-6">
              <p className="text-3xl font-bold text-sky-600">{formatPrice(property.price)}</p>
              {property.is_negotiable && (
                <span className="text-sm text-gray-500">Price negotiable</span>
              )}
            </div>

            {/* Features */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Property Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Bed className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Bath className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.floor_area > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Square className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Floor Area</p>
                      <p className="font-semibold">{property.floor_area} m²</p>
                    </div>
                  </div>
                )}
                {property.lot_area > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Square className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lot Area</p>
                      <p className="font-semibold">{property.lot_area} m²</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{property.description || 'No description available.'}</p>
            </div>

            {/* Map */}
            {property.latitude && property.longitude && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="h-80 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[property.latitude, property.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[property.latitude, property.longitude]}>
                      <Popup>{property.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Reviews</h3>
                <div className="space-y-4">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                              className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                      <p className="text-sm text-gray-500 mt-2">- {review.first_name} {review.last_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Contact Agent</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center">
                  {property.owner_avatar ? (
                    <img src={property.owner_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sky-700 font-bold text-lg">
                      {property.owner_first_name?.[0]}{property.owner_last_name?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{property.owner_first_name} {property.owner_last_name}</p>
                  <p className="text-sm text-gray-500">Property Owner</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full btn-primary py-3"
                >
                  <Phone size={18} className="mr-2" />
                  Contact Agent
                </button>
                <button className="w-full btn-secondary py-3">
                  <Mail size={18} className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
