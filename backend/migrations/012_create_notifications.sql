-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'welcome',
        'verification',
        'booking_confirmed',
        'booking_reminder',
        'booking_cancelled',
        'payment_received',
        'payment_failed',
        'new_message',
        'property_inquiry',
        'price_drop',
        'new_listing',
        'appointment_reminder',
        'review_received',
        'document_uploaded',
        'system_alert',
        'lead_assigned',
        'commission_earned'
    )),
    
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Related entity
    related_type VARCHAR(50), -- 'property', 'booking', 'chat', 'lead', 'payment'
    related_id UUID,
    
    -- Action
    action_url TEXT,
    action_text VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Delivery channels
    channels JSONB DEFAULT '["in_app"]',
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    push_sent BOOLEAN DEFAULT false,
    push_sent_at TIMESTAMP,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(recipient_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Channel preferences
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    
    -- Type preferences (JSON object with boolean values)
    type_preferences JSONB DEFAULT '{}',
    
    -- Quiet hours
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    quiet_hours_enabled BOOLEAN DEFAULT false,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID REFERENCES users(id),
    
    -- Activity details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'user', 'property', 'booking', 'payment', 'system'
    entity_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
