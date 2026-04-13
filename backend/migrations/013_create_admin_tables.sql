-- Admin Settings
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
    
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    
    is_editable BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, category) VALUES
    ('site_name', 'STARFIELDS', 'string', 'Website name', 'general'),
    ('site_tagline', 'Buy • Sell • Rent • Forclosed • Mortgage', 'string', 'Site tagline', 'general'),
    ('contact_email', 'info@starfields.com.ph', 'string', 'Primary contact email', 'contact'),
    ('contact_phone', '+63 2 8123 4567', 'string', 'Primary contact phone', 'contact'),
    ('commission_rate_sale', '3.0', 'number', 'Default commission rate for sales (%)', 'commission'),
    ('commission_rate_rental', '1.0', 'number', 'Default commission rate for rentals (%)', 'commission'),
    ('featured_listing_price', '5000', 'number', 'Price for featured listing (PHP)', 'pricing'),
    ('max_property_images', '30', 'number', 'Maximum images per property', 'limits'),
    ('max_upload_size', '50', 'number', 'Maximum upload size in MB', 'limits'),
    ('require_email_verification', 'true', 'boolean', 'Require email verification for new accounts', 'security'),
    ('enable_agent_registration', 'true', 'boolean', 'Allow public agent registration', 'security'),
    ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'system')
ON CONFLICT (setting_key) DO NOTHING;

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    
    old_data JSONB,
    new_data JSONB,
    
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    ip_address INET,
    reason TEXT
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Admin Dashboard Widgets
CREATE TABLE IF NOT EXISTS admin_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    widget_type VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    configuration JSONB DEFAULT '{}',
    
    position_row INTEGER,
    position_col INTEGER,
    width INTEGER DEFAULT 1,
    height INTEGER DEFAULT 1,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backup Records
CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    backup_type VARCHAR(50) NOT NULL CHECK (backup_type IN ('full', 'database', 'files')),
    file_path TEXT,
    file_size BIGINT,
    
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    created_by UUID REFERENCES users(id),
    error_message TEXT
);

-- API Keys (for external integrations)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    
    permissions JSONB DEFAULT '[]',
    allowed_ips INET[],
    
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
