import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import RealEstate from './pages/RealEstate';
import PropertyDetail from './pages/PropertyDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Restaurants from './pages/Restaurants';
import Travel from './pages/Travel';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyProperties from './pages/MyProperties';
import Favorites from './pages/Favorites';
import Bookings from './pages/Bookings';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
