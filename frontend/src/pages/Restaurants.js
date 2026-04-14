import React from 'react';
import { Utensils } from 'lucide-react';

const Restaurants = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Discover Restaurants</h1>
          <p className="text-orange-100">Find and book the best dining experiences</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <Utensils className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our restaurant booking system is under development. Check back soon to discover and book the best restaurants in the Philippines!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
