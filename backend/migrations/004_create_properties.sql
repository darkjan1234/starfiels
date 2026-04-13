-- Property Categories Table
CREATE TABLE IF NOT EXISTS property_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO property_categories (name, slug, description) VALUES
    ('Residential', 'residential', 'House and lot, condos, apartments'),
    ('Commercial', 'commercial', 'Office spaces, retail, warehouses'),
    ('Industrial', 'industrial', 'Factories, plants, industrial lots'),
    ('Land', 'land', 'Raw lots, agricultural land'),
    ('Foreclosed', 'foreclosed', 'Bank foreclosed properties')
ON CONFLICT (slug) DO NOTHING;

-- Property Types Table
CREATE TABLE IF NOT EXISTS property_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES property_categories(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, slug)
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    property_type_id UUID NOT NULL REFERENCES property_types(id),
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease', 'preselling')),
    
    -- Owner/Agent
    owner_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES users(id),
    
    -- Price
    price DECIMAL(15, 2) NOT NULL,
    price_per_sqm DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'PHP',
    is_negotiable BOOLEAN DEFAULT false,
    
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
    lot_area DECIMAL(10, 2),
    floor_area DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking_slots INTEGER,
    floors INTEGER,
    year_built INTEGER,
    
    -- Features (stored as JSON array)
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'pending', 'sold', 'rented', 'inactive', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMP,
    
    -- Views and Favorites
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_properties_type ON properties(property_type_id);
CREATE INDEX idx_properties_listing ON properties(listing_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(region_id, province_id, city_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_featured ON properties(is_featured, featured_until);
CREATE INDEX idx_properties_created ON properties(created_at DESC);

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
