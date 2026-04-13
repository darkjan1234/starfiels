-- Travel & Tours - Tour Packages
CREATE TABLE IF NOT EXISTS tour_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Operator
    operator_id UUID NOT NULL REFERENCES users(id),
    
    -- Tour Details
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER,
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'difficult')),
    tour_type VARCHAR(50) CHECK (tour_type IN ('day_trip', 'multi_day', 'adventure', 'cultural', 'food', 'island_hopping', 'city_tour', 'nature', 'historical')),
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_person BOOLEAN DEFAULT true,
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Inclusions/Exclusions
    inclusions JSONB DEFAULT '[]',
    exclusions JSONB DEFAULT '[]',
    
    -- Itinerary (stored as JSON array)
    itinerary JSONB DEFAULT '[]',
    
    -- Destinations
    destinations JSONB DEFAULT '[]',
    region_id UUID REFERENCES regions(id),
    province_ids UUID[] DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'sold_out')),
    is_featured BOOLEAN DEFAULT false,
    
    -- Media
    main_image_url TEXT,
    gallery_images JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tours_operator ON tour_packages(operator_id);
CREATE INDEX idx_tours_region ON tour_packages(region_id);
CREATE INDEX idx_tours_type ON tour_packages(tour_type);
CREATE INDEX idx_tours_status ON tour_packages(status);

CREATE TRIGGER update_tours_updated_at 
    BEFORE UPDATE ON tour_packages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tour Bookings
CREATE TABLE IF NOT EXISTS tour_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    tour_package_id UUID NOT NULL REFERENCES tour_packages(id),
    
    -- Booking Details
    travel_date DATE NOT NULL,
    participants INTEGER NOT NULL,
    participant_details JSONB DEFAULT '[]',
    
    -- Contact
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    
    -- Special Requests
    special_requests TEXT,
    dietary_requirements TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

CREATE INDEX idx_tour_bookings_user ON tour_bookings(user_id);
CREATE INDEX idx_tour_bookings_package ON tour_bookings(tour_package_id);
CREATE INDEX idx_tour_bookings_date ON tour_bookings(travel_date);

-- Transport Services
CREATE TABLE IF NOT EXISTS transport_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(255) NOT NULL,
    provider_id UUID NOT NULL REFERENCES users(id),
    
    -- Service Details
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('van', 'car', 'bus', 'boat', 'motorcycle', 'shuttle')),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    capacity INTEGER NOT NULL,
    
    -- Features
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    
    -- Service Areas
    service_regions UUID[] DEFAULT '{}',
    pickup_locations JSONB DEFAULT '[]',
    
    -- Pricing
    base_price DECIMAL(10, 2),
    price_per_km DECIMAL(6, 2),
    price_per_hour DECIMAL(8, 2),
    full_day_price DECIMAL(10, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance', 'inactive')),
    
    -- Media
    images JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transport Bookings
CREATE TABLE IF NOT EXISTS transport_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES transport_services(id),
    
    -- Trip Details
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE,
    return_time TIME,
    is_round_trip BOOLEAN DEFAULT false,
    
    passengers INTEGER NOT NULL,
    luggage_count INTEGER DEFAULT 0,
    
    -- Pricing
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    
    special_instructions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flight/Transport Tickets (for external bookings tracking)
CREATE TABLE IF NOT EXISTS travel_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    ticket_type VARCHAR(50) NOT NULL CHECK (ticket_type IN ('flight', 'ferry', 'bus', 'train')),
    booking_reference VARCHAR(100),
    
    -- Route
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_datetime TIMESTAMP NOT NULL,
    arrival_datetime TIMESTAMP,
    
    -- Provider
    provider_name VARCHAR(100),
    provider_code VARCHAR(20),
    
    -- Passenger
    passenger_name VARCHAR(255),
    passenger_count INTEGER DEFAULT 1,
    
    -- Details
    class VARCHAR(50),
    seat_number VARCHAR(20),
    
    -- Status
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'boarded', 'completed', 'cancelled')),
    
    -- Pricing
    price DECIMAL(10, 2),
    
    -- Attachments
    ticket_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
