import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Real Estate': [
      { label: 'Buy Property', path: '/real-estate?type=buy' },
      { label: 'Rent Property', path: '/real-estate?type=rent' },
      { label: 'Sell Property', path: '/services?type=sell' },
      { label: 'Find Agents', path: '/services' },
    ],
    'Services': [
      { label: 'Home Loans', path: '/services?type=loan' },
      { label: 'Property Management', path: '/services' },
      { label: 'Construction', path: '/services' },
      { label: 'Legal Services', path: '/services' },
    ],
    'Company': [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Contact', path: '/contact' },
      { label: 'Blog', path: '/blog' },
    ],
    'Support': [
      { label: 'Help Center', path: '/help' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Sitemap', path: '/sitemap' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-sky-500/30 transition-shadow duration-300">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">STAR</span>
                <span className="font-bold text-xl text-red-400">★</span>
                <span className="font-bold text-xl tracking-tight">FIELDS</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your all-in-one platform for Real Estate, Hotels, Restaurants, and Travel in the Philippines. 
              Making property dreams come true since 2024.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@starfields.com.ph" className="flex items-center gap-3 text-sm text-gray-400 hover:text-sky-400 transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <Mail size={16} />
                </div>
                admin@starfields.com.ph
              </a>
              <a href="tel:+63281234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-sky-400 transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <Phone size={16} />
                </div>
                +63 9652863541
              </a>
              <p className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                General Santos City, Philippines
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <div key={title} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                {title}
                <span className="h-0.5 flex-1 bg-gray-800 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-sky-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-sky-400 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {currentYear} STARFIELDS. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
                { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
                { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
                { icon: Youtube, label: 'Youtube', url: 'https://youtube.com' },
              ].map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-sky-600 transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
