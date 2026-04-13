-- Agent Hierarchy View (managed via users.parent_id)
-- Additional tables for agent management

-- Agent Performance Metrics
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time period
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Performance stats
    leads_generated INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    properties_listed INTEGER DEFAULT 0,
    properties_sold INTEGER DEFAULT 0,
    properties_rented INTEGER DEFAULT 0,
    total_sales_value DECIMAL(15, 2) DEFAULT 0,
    total_rental_value DECIMAL(15, 2) DEFAULT 0,
    
    -- Engagement
    calls_made INTEGER DEFAULT 0,
    meetings_scheduled INTEGER DEFAULT 0,
    meetings_completed INTEGER DEFAULT 0,
    
    -- Response metrics
    avg_response_time_minutes INTEGER,
    customer_satisfaction_rating DECIMAL(3, 2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(agent_id, period_type, period_start)
);

CREATE INDEX idx_agent_metrics_agent ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_period ON agent_metrics(period_type, period_start);

-- Commission Tracking
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id),
    
    -- Related transaction
    transaction_type VARCHAR(50) NOT NULL, -- 'property_sale', 'property_rental', 'referral'
    transaction_id UUID NOT NULL,
    
    -- Commission details
    commission_amount DECIMAL(12, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) NOT NULL,
    base_amount DECIMAL(12, 2) NOT NULL,
    
    -- Split info (if shared)
    is_split BOOLEAN DEFAULT false,
    split_with_id UUID REFERENCES users(id),
    split_percentage DECIMAL(5, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed', 'cancelled')),
    
    -- Payment
    paid_at TIMESTAMP,
    payment_reference VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_commissions_agent ON commissions(agent_id);
CREATE INDEX idx_commissions_status ON commissions(status);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Lead source
    source VARCHAR(50) NOT NULL, -- 'website', 'referral', 'walk_in', 'phone', 'social_media', 'property_inquiry'
    source_details TEXT,
    
    -- Lead info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Interest
    interest_type VARCHAR(50), -- 'buy', 'rent', 'sell', 'invest'
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    preferred_location TEXT,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Status progression
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'viewing_scheduled', 'negotiating', 'converted', 'lost', 'nurture')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Notes
    notes TEXT,
    
    -- Follow up
    next_follow_up TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_at TIMESTAMP
);

CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_follow_up ON leads(next_follow_up);

-- Lead Activities
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES users(id),
    
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'viewing', 'note', 'status_change', 'follow_up')),
    description TEXT,
    
    -- For meetings/viewings
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    outcome VARCHAR(50), -- 'successful', 'no_answer', 'not_interested', 'rescheduled'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);

-- Tasks & Appointments
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Assignment
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    
    -- Related to
    related_type VARCHAR(50), -- 'lead', 'property', 'booking', 'client'
    related_id UUID,
    
    -- Scheduling
    due_date DATE,
    due_time TIME,
    reminder_at TIMESTAMP,
    
    -- Task type
    task_type VARCHAR(50) CHECK (task_type IN ('call', 'meeting', 'viewing', 'follow_up', 'paperwork', 'marketing', 'other')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    completed_at TIMESTAMP,
    completed_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);
