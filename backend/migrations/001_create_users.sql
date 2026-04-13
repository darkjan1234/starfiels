-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    
    -- Role and permissions
    role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('admin', 'property_manager', 'unit_manager', 'agent', 'seller', 'buyer', 'hotel_manager', 'restaurant_manager', 'travel_operator')),
    
    -- For agent hierarchy
    parent_id UUID REFERENCES users(id),
    agent_code VARCHAR(20) UNIQUE,
    
    -- Profile details
    bio TEXT,
    company_name VARCHAR(255),
    license_number VARCHAR(100),
    
    -- Location
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    region VARCHAR(50),
    zip_code VARCHAR(10),
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    
    -- Security
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_parent ON users(parent_id);
CREATE INDEX idx_users_agent_code ON users(agent_code);
CREATE INDEX idx_users_location ON users(region, province, city);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
