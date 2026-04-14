import React from 'react';
import { Plane } from 'lucide-react';

const Travel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Travel & Tours</h1>
          <p className="text-purple-100">Explore tour packages and book your next adventure</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <Plane className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our travel and tours booking system is under development. Soon you'll be able to book flights, tour packages, and transportation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Travel;
