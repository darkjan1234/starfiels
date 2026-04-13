-- Services Catalog Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Service Category
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'real_estate_transaction', 
        'titling', 
        'survey', 
        'transfer', 
        'home_loan', 
        'construction',
        'renovation',
        'property_management',
        'legal',
        'inspection'
    )),
    
    -- Service Type
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('buy', 'sell', 'rent', 'mortgage', 'titling', 'survey', 'transfer', 'loan', 'construction', 'consultation')),
    
    -- Provider
    provider_id UUID NOT NULL REFERENCES users(id),
    
    -- Pricing
    pricing_type VARCHAR(20) CHECK (pricing_type IN ('fixed', 'hourly', 'percentage', 'quote', 'free')),
    base_price DECIMAL(10, 2),
    price_percentage DECIMAL(5, 2), -- for percentage-based pricing
    price_description TEXT,
    
    -- Service Details
    features JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    
    -- Duration
    estimated_duration VARCHAR(100),
    
    -- Coverage Area
    service_regions UUID[] DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    is_featured BOOLEAN DEFAULT false,
    
    -- Media
    image_url TEXT,
    documents JSONB DEFAULT '[]',
    
    -- Stats
    request_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(2, 1),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_type ON services(service_type);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_status ON services(status);

-- Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Requester
    requester_id UUID NOT NULL REFERENCES users(id),
    
    -- Service
    service_id UUID NOT NULL REFERENCES services(id),
    
    -- Related Property (optional)
    property_id UUID REFERENCES properties(id),
    
    -- Request Details
    request_details TEXT,
    preferred_start_date DATE,
    budget_range_min DECIMAL(12, 2),
    budget_range_max DECIMAL(12, 2),
    
    -- Contact
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    contact_address TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'declined')),
    
    -- Provider Response
    quoted_amount DECIMAL(12, 2),
    quote_details TEXT,
    quote_valid_until DATE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quoted_at TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_service_requests_requester ON service_requests(requester_id);
CREATE INDEX idx_service_requests_service ON service_requests(service_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- Service Request Documents
CREATE TABLE IF NOT EXISTS service_request_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'requirement', 'deliverable', 'contract', 'receipt'
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Reviews
CREATE TABLE IF NOT EXISTS service_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id),
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    -- Detailed ratings
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
