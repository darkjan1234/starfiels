-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Conversation type
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'property_inquiry', 'booking_support', 'group')),
    
    -- Related entity (optional)
    related_type VARCHAR(50), -- 'property', 'booking', 'hotel', 'restaurant', etc.
    related_id UUID,
    
    -- Conversation settings
    title VARCHAR(255),
    is_group BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP
);

CREATE INDEX idx_conversations_type ON chat_conversations(type);
CREATE INDEX idx_conversations_status ON chat_conversations(status);
CREATE INDEX idx_conversations_updated ON chat_conversations(updated_at DESC);

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Chat Participants Table
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Participant settings
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    
    -- Tracking
    last_read_at TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    
    -- Notifications
    is_muted BOOLEAN DEFAULT false,
    
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_participants_conversation ON chat_participants(conversation_id);
CREATE INDEX idx_participants_user ON chat_participants(user_id);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    
    -- Message content
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'image', 'file', 'location', 'property_card', 'booking_card')),
    content TEXT NOT NULL,
    
    -- For file attachments
    file_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    
    -- For location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_name VARCHAR(255),
    
    -- For cards
    card_data JSONB,
    
    -- Reply to
    reply_to_id UUID REFERENCES chat_messages(id),
    
    -- Status
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_messages_created ON chat_messages(created_at DESC);

-- Message Read Receipts
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id)
);
