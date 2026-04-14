import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { MapPin, Star, Loader, ChevronLeft, Wifi, Car, Coffee, Dumbbell, Waves, Utensils } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  restaurant: Utensils,
  gym: Dumbbell,
  pool: Waves,
  breakfast: Coffee,
};

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data.hotel);
      } catch (error) {
        console.error('Error fetching hotel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-[400px] bg-gray-900">
        <img
          src={hotel.main_image_url || 'https://via.placeholder.com/1200x400?text=No+Image'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <Link
          to="/hotels"
          className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white font-medium flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back to hotels
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < (hotel.star_rating || 0) ? 'currentColor' : 'none'}
                    className={i < (hotel.star_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-500">{hotel.property_type}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin size={18} />
                {hotel.address}, {hotel.city_name}, {hotel.province_name}
              </p>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <p className="text-gray-600 whitespace-pre-line">{hotel.description || 'No description available.'}</p>
            </div>

            {/* Amenities */}
            {hotel.amenities && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(hotel.amenities || []).map((amenity, idx) => {
                    const Icon = amenityIcons[amenity.toLowerCase()] || Star;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon size={18} className="text-emerald-600" />
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Room Types */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Select Room</h3>
              <div className="space-y-4">
                {(hotel.roomTypes || []).map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{room.name}</h4>
                        <p className="text-sm text-gray-500">Max {room.max_occupancy} guests</p>
                        {room.bed_type && <p className="text-sm text-gray-500">{room.bed_type}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600">{formatPrice(room.base_price)}</p>
                        <p className="text-xs text-gray-500">per night</p>
                        <p className="text-sm text-emerald-600 mt-1">{room.available_rooms} rooms left</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            {hotel.latitude && hotel.longitude && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="h-80 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[hotel.latitude, hotel.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[hotel.latitude, hotel.longitude]} />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Book Your Stay</h3>
              {selectedRoom ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="font-medium text-emerald-900">{selectedRoom.name}</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatPrice(selectedRoom.base_price)}</p>
                    <p className="text-sm text-emerald-700">per night</p>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Select a room to book</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
