import React from 'react';
import { Briefcase, FileText, Hammer, Scale, Calculator } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Titling Services',
      description: 'Property title transfer and registration assistance',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Home Loans',
      description: 'Mortgage and financing assistance for your property purchase',
      icon: Calculator,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Construction',
      description: 'Construction and renovation services for your property',
      icon: Hammer,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Legal Services',
      description: 'Legal assistance for property transactions and disputes',
      icon: Scale,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-sky-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-sky-100">Comprehensive solutions for all your property needs</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.title} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <service.icon size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-sky-600 font-medium hover:text-sky-700">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">Need custom services? Contact us today!</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
