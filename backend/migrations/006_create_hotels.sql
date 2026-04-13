-- Hotels & Resorts Table
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Owner/Manager
    owner_id UUID NOT NULL REFERENCES users(id),
    manager_id UUID REFERENCES users(id),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Location
    region_id UUID REFERENCES regions(id),
    province_id UUID REFERENCES provinces(id),
    city_id UUID REFERENCES cities(id),
    barangay_id UUID REFERENCES barangays(id),
    address TEXT,
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Hotel Details
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    property_type VARCHAR(50) CHECK (property_type IN ('hotel', 'resort', 'inn', 'hostel', 'guesthouse', 'villa', 'aparthotel')),
    
    -- Amenities
    amenities JSONB DEFAULT '[]',
    facilities JSONB DEFAULT '[]',
    
    -- Policies
    check_in_time TIME,
    check_out_time TIME,
    cancellation_policy TEXT,
    pet_friendly BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    is_featured BOOLEAN DEFAULT false,
    
    -- Media
    main_image_url TEXT,
    gallery_images JSONB DEFAULT '[]',
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hotels_owner ON hotels(owner_id);
CREATE INDEX idx_hotels_location ON hotels(region_id, province_id, city_id);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_featured ON hotels(is_featured);
CREATE INDEX idx_hotels_rating ON hotels(star_rating);

CREATE TRIGGER update_hotels_updated_at 
    BEFORE UPDATE ON hotels 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Hotel Room Types Table
CREATE TABLE IF NOT EXISTS hotel_room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_occupancy INTEGER NOT NULL,
    bed_type VARCHAR(50),
    room_size DECIMAL(8, 2),
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_types_hotel ON hotel_room_types(hotel_id);

-- Hotel Rooms Table
CREATE TABLE IF NOT EXISTS hotel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID NOT NULL REFERENCES hotel_room_types(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor INTEGER,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_type_id, room_number)
);

CREATE INDEX idx_rooms_type ON hotel_rooms(room_type_id);
CREATE INDEX idx_rooms_status ON hotel_rooms(status);

-- Hotel Bookings Table
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    hotel_id UUID NOT NULL REFERENCES hotels(id),
    room_type_id UUID NOT NULL REFERENCES hotel_room_types(id),
    room_id UUID REFERENCES hotel_rooms(id),
    
    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INTEGER NOT NULL,
    
    -- Guests
    adults INTEGER NOT NULL,
    children INTEGER DEFAULT 0,
    guest_names JSONB,
    
    -- Pricing
    room_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'failed')),
    
    -- Special Requests
    special_requests TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP
);

CREATE INDEX idx_bookings_user ON hotel_bookings(user_id);
CREATE INDEX idx_bookings_hotel ON hotel_bookings(hotel_id);
CREATE INDEX idx_bookings_dates ON hotel_bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON hotel_bookings(status);
CREATE INDEX idx_bookings_code ON hotel_bookings(booking_code);

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON hotel_bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Room Availability Calendar
CREATE TABLE IF NOT EXISTS room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID NOT NULL REFERENCES hotel_room_types(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_count INTEGER NOT NULL DEFAULT 0,
    booked_count INTEGER DEFAULT 0,
    price_override DECIMAL(10, 2),
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_type_id, date)
);

CREATE INDEX idx_availability_type_date ON room_availability(room_type_id, date);
