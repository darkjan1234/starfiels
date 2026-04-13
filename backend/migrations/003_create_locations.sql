-- Regions Table
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    island_group VARCHAR(20) NOT NULL CHECK (island_group IN ('Luzon', 'Visayas', 'Mindanao')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provinces Table
CREATE TABLE IF NOT EXISTS provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(region_id, code)
);

-- Cities/Municipalities Table
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('city', 'municipality')),
    is_huc BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Barangays Table
CREATE TABLE IF NOT EXISTS barangays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_provinces_region ON provinces(region_id);
CREATE INDEX idx_cities_province ON cities(province_id);
CREATE INDEX idx_barangays_city ON barangays(city_id);

-- Insert Philippines regions
INSERT INTO regions (name, code, island_group) VALUES
    ('Ilocos Region', '01', 'Luzon'),
    ('Cagayan Valley', '02', 'Luzon'),
    ('Central Luzon', '03', 'Luzon'),
    ('CALABARZON', '04A', 'Luzon'),
    ('MIMAROPA', '04B', 'Luzon'),
    ('Bicol Region', '05', 'Luzon'),
    ('Cordillera Administrative Region', 'CAR', 'Luzon'),
    ('National Capital Region', 'NCR', 'Luzon'),
    ('Western Visayas', '06', 'Visayas'),
    ('Central Visayas', '07', 'Visayas'),
    ('Eastern Visayas', '08', 'Visayas'),
    ('Zamboanga Peninsula', '09', 'Mindanao'),
    ('Northern Mindanao', '10', 'Mindanao'),
    ('Davao Region', '11', 'Mindanao'),
    ('SOCCSKSARGEN', '12', 'Mindanao'),
    ('Caraga', '13', 'Mindanao'),
    ('BARMM', 'BARMM', 'Mindanao')
ON CONFLICT (code) DO NOTHING;
