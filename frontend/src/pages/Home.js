import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Hotel, Utensils, Plane, MapPin, ArrowRight, Star, Sparkles } from 'lucide-react';

const Home = () => {
  const services = [
    {
      title: 'Real Estate',
      description: 'Buy, sell, or rent properties across the Philippines',
      icon: Building2,
      path: '/real-estate',
      color: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    {
      title: 'Hotels & Resorts',
      description: 'Book the best accommodations for your stay',
      icon: Hotel,
      path: '/hotels',
      color: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
    },
    {
      title: 'Restaurants',
      description: 'Discover and reserve tables at top restaurants',
      icon: Utensils,
      path: '/restaurants',
      color: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    },
    {
      title: 'Travel & Tours',
      description: 'Explore tour packages and transportation',
      icon: Plane,
      path: '/travel',
      color: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'
    },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: 'Luxury Condo in Makati',
      location: 'Makati City, Metro Manila',
      price: '₱15,000,000',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      beds: 3,
      baths: 2,
      sqm: 120
    },
    {
      id: 2,
      title: 'Beachfront Villa in Boracay',
      location: 'Boracay Island, Aklan',
      price: '₱45,000,000',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop',
      beds: 5,
      baths: 4,
      sqm: 450
    },
    {
      id: 3,
      title: 'Modern House in Quezon City',
      location: 'Quezon City, Metro Manila',
      price: '₱12,500,000',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      beds: 4,
      baths: 3,
      sqm: 200
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite'
          }} />
        </div>
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&h=1080&fit=crop"
            alt="Philippines beach"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 fade-in-up">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center float">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <span className="text-3xl font-bold">STAR</span>
                <span className="text-3xl text-red-400">★</span>
                <span className="text-3xl font-bold">FIELDS</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 fade-in-up-delay-1">
              Discover Your Perfect Property in the Philippines
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 mb-8 fade-in-up-delay-2">
              
            </p>
            <div className="flex items-center gap-2 mb-6 fade-in-up-delay-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sky-100 text-sm">Trusted by 1,200,000+ Filipinos</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sky-100 text-sm">Trusted by 300,000+ Foreigners</span>
            </div>
            <div className="flex flex-wrap gap-4 fade-in-up-delay-3">
              <Link to="/real-estate" className="btn-primary text-lg px-8 py-3 pulse-glow">
                Find Property
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/services" className="btn-secondary text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4">
              <Sparkles size={14} />
              What We Offer
            </span>
            <h2 className="section-title mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto section-subtitle">
              Comprehensive solutions for all your lifestyle needs across the Philippines
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.path}
                className="group card hover-lift"
              >
                <div className="h-48 overflow-hidden img-zoom">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                  <div className="mt-4 flex items-center text-sky-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-3">
                <Star size={14} />
                Featured
              </span>
              <h2 className="section-title">Featured Properties</h2>
              <p className="text-gray-600 mt-2 section-subtitle">Handpicked properties for you</p>
            </div>
            <Link to="/real-estate" className="text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {featuredProperties.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`} className="group card hover-lift">
                <div className="relative h-56 overflow-hidden img-zoom">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">Click to view details</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-sky-600 transition-colors">{property.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                    <MapPin size={14} className="text-sky-500" />
                    {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1"><Building2 size={14} /> {property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqm} m²</span>
                  </div>
                  <p className="text-xl font-bold gradient-text">{property.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Star size={14} />
              Why Us
            </span>
            <h2 className="section-title mb-4">Why Choose STARFIELDS?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto section-subtitle">
              Trusted by thousands of Filipinos for their property and lifestyle needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-sky-500/25 transition-all duration-300">
                <Building2 className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Properties</h3>
              <p className="text-gray-600">All listings are verified by our team of experts</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-emerald-500/25 transition-all duration-300">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nationwide Coverage</h3>
              <p className="text-gray-600">From Luzon to Mindanao, we cover the entire Philippines</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-purple-500/25 transition-all duration-300">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Agents</h3>
              <p className="text-gray-600">Professional licensed agents ready to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 rounded-3xl p-8 md:p-16 text-center text-white overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
              <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their perfect property through STARFIELDS
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/real-estate" className="btn-secondary text-lg px-8 py-3 bg-white text-sky-600 hover:bg-gray-100 shadow-lg">
                  Browse Properties
                </Link>
                <Link to="/register" className="btn-primary text-lg px-8 py-3 bg-sky-800 hover:bg-sky-900 border-2 border-white/30 shadow-lg pulse-glow">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
