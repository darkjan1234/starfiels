import React, { useState, useEffect } from 'react';
import { api } from '../store/authStore';
import { Calendar, Hotel, MapPin, Loader, Clock } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/hotels/bookings/my');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">Start booking hotels and tours for your next adventure</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={booking.main_image_url || 'https://via.placeholder.com/200x150?text=No+Image'}
                    alt={booking.hotel_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{booking.hotel_name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin size={14} />
                        {booking.city_name}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Hotel size={16} />
                    {booking.room_type_name}
                    <span className="mx-2">•</span>
                    <Clock size={16} />
                    {booking.nights} nights
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <span className="text-gray-500">Check-in</span>
                      <p className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <span className="text-gray-500">Check-out</span>
                      <p className="font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-sky-600">{formatPrice(booking.final_amount)}</p>
                  <p className="text-xs text-gray-500">{booking.booking_code}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
