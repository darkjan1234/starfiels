-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description TEXT,
    cuisine_type VARCHAR(100),
    
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
    
    -- Details
    price_range VARCHAR(10) CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    seating_capacity INTEGER,
    
    -- Operating Hours (stored as JSON)
    operating_hours JSONB DEFAULT '{}',
    
    -- Features
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    
    -- Reservation Settings
    accepts_reservations BOOLEAN DEFAULT true,
    min_reservation_advance INTEGER DEFAULT 2, -- hours
    max_reservation_advance INTEGER DEFAULT 30, -- days
    default_reservation_duration INTEGER DEFAULT 120, -- minutes
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended', 'temporarily_closed')),
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

CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_location ON restaurants(region_id, province_id, city_id);
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine_type);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_featured ON restaurants(is_featured);

CREATE TRIGGER update_restaurants_updated_at 
    BEFORE UPDATE ON restaurants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Restaurant Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    
    -- Dietary info
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_spicy BOOLEAN DEFAULT false,
    allergens JSONB DEFAULT '[]',
    
    -- Media
    image_url TEXT,
    
    -- Options
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    prep_time INTEGER, -- minutes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON menu_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Restaurant Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(50), -- indoor, outdoor, private, etc.
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tables_restaurant ON restaurant_tables(restaurant_id);

-- Table Reservations
CREATE TABLE IF NOT EXISTS table_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    table_id UUID REFERENCES restaurant_tables(id),
    
    -- Reservation Details
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    duration INTEGER DEFAULT 120, -- minutes
    party_size INTEGER NOT NULL,
    
    -- Guest Info
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_email VARCHAR(255),
    special_requests TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

CREATE INDEX idx_reservations_user ON table_reservations(user_id);
CREATE INDEX idx_reservations_restaurant ON table_reservations(restaurant_id);
CREATE INDEX idx_reservations_date ON table_reservations(reservation_date);
CREATE INDEX idx_reservations_status ON table_reservations(status);

CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON table_reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Restaurant Reviews
CREATE TABLE IF NOT EXISTS restaurant_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    ambiance_rating INTEGER CHECK (ambiance_rating >= 1 AND ambiance_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    title VARCHAR(255),
    review TEXT,
    visit_date DATE,
    
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurant_reviews_restaurant ON restaurant_reviews(restaurant_id);
