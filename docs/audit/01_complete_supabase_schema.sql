-- ============================================================================
-- ISI SECURITY: ENTERPRISE SUPABASE DATABASE ARCHITECTURE & SQL MIGRATION
-- Database: PostgreSQL 15+ (Supabase)
-- Version: 2.4.0 (Enterprise Digital Presence & CRM Suite)
-- ============================================================================

-- 0. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema objects if re-running migration
DROP VIEW IF EXISTS v_marketing_funnel_kpis CASCADE;
DROP VIEW IF EXISTS v_lead_conversion_summary CASCADE;

-- ----------------------------------------------------------------------------
-- 1. COMPANIES & CLIENT ACCOUNTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    industry VARCHAR(100),
    employee_count_tier VARCHAR(50), -- e.g., '1-50', '51-200', '201-1000', '1000+'
    hq_city VARCHAR(100),
    hq_state VARCHAR(100),
    hq_country VARCHAR(100) DEFAULT 'India',
    is_enterprise BOOLEAN DEFAULT FALSE,
    tier VARCHAR(20) DEFAULT 'Standard', -- 'Standard', 'Key Account', 'Strategic'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_domain ON public.companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);

-- ----------------------------------------------------------------------------
-- 2. CONTACTS (PEOPLE & DECISION MAKERS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    designation VARCHAR(150), -- e.g., 'Chief Information Security Officer', 'VP Operations'
    is_corporate_email BOOLEAN DEFAULT TRUE,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_contact_email UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);

-- ----------------------------------------------------------------------------
-- 3. MARKETING CAMPAIGNS & TRACKING REPOSITORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(150) NOT NULL UNIQUE,
    utm_source VARCHAR(100) NOT NULL,
    utm_medium VARCHAR(100) NOT NULL,
    utm_campaign VARCHAR(150) NOT NULL,
    utm_content VARCHAR(150),
    utm_term VARCHAR(150),
    channel VARCHAR(50) NOT NULL, -- 'Google Ads', 'YouTube', 'LinkedIn', 'Meta', 'Organic', 'WhatsApp', 'Affiliate'
    budget_inr NUMERIC(12, 2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_utm ON public.campaigns(utm_source, utm_medium, utm_campaign);

-- ----------------------------------------------------------------------------
-- 4. MASTER LEADS TABLE (CENTRALIZED MULTI-CHANNEL INGESTION)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'ISI-LEAD-2026-928172'
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    
    -- Demographics
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    designation VARCHAR(150),
    
    -- Categorization & Requirements
    lead_type VARCHAR(50) NOT NULL DEFAULT 'sales', -- 'sales', 'career', 'academy', 'contact'
    form_type VARCHAR(100) NOT NULL, -- 'Contact_Form', 'Sales_Inquiries', 'Consultation_Requests', etc.
    service_interest VARCHAR(255), -- 'Manned Guarding', 'C4i Command Center', 'Integrated Facility Management'
    requirement TEXT,
    preferred_time VARCHAR(100),
    
    -- Operational Status
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'rejected'
    priority VARCHAR(20) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    assigned_to VARCHAR(100), -- Team member email or Jira Assignee ID
    
    -- CRM & External Sync Status
    jira_issue_key VARCHAR(50), -- e.g. 'DLF-492'
    jira_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Created', 'Updated', 'Failed'
    jira_sync_timestamp TIMESTAMPTZ,
    
    sheets_synced BOOLEAN DEFAULT FALSE,
    sheets_row_id VARCHAR(50),
    sheets_sync_timestamp TIMESTAMPTZ,
    
    -- Digital Attribution & Telemetry Context
    source VARCHAR(100) NOT NULL DEFAULT 'Direct',
    traffic_channel VARCHAR(100) DEFAULT 'Direct',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(150),
    utm_content VARCHAR(150),
    utm_term VARCHAR(150),
    page_url TEXT,
    referrer TEXT,
    ip_address VARCHAR(50),
    location VARCHAR(150),
    country VARCHAR(100) DEFAULT 'India',
    variant VARCHAR(50) DEFAULT 'original',
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at_ist VARCHAR(50), -- Human-readable IST string
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_lead_number ON public.leads(lead_number);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_jira_issue_key ON public.leads(jira_issue_key);
CREATE INDEX IF NOT EXISTS idx_leads_metadata_gin ON public.leads USING GIN (metadata);

-- ----------------------------------------------------------------------------
-- 5. RAW FORM SUBMISSIONS (AUDIT REPLAY & PRESERVATION LAYER)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    form_name VARCHAR(100) NOT NULL,
    raw_payload JSONB NOT NULL,
    sanitized_payload JSONB NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    http_headers JSONB,
    submission_status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_lead_id ON public.form_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. JIRA & GOOGLE SHEETS INTEGRATION LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jira_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    lead_number VARCHAR(50) NOT NULL,
    issue_key VARCHAR(50),
    action VARCHAR(50) NOT NULL, -- 'create_issue', 'create_subtasks', 'update_status', 'add_comment'
    status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'FAILED', 'RETRY'
    http_status INT,
    request_payload JSONB,
    response_payload JSONB,
    error_details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.google_sheet_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    lead_number VARCHAR(50) NOT NULL,
    sheet_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'append_row', 'update_row'
    status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'FAILED', 'RETRY'
    payload JSONB,
    response_status INT,
    error_details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jira_logs_lead_number ON public.jira_sync_logs(lead_number);
CREATE INDEX IF NOT EXISTS idx_sheets_logs_lead_number ON public.google_sheet_sync_logs(lead_number);

-- ----------------------------------------------------------------------------
-- 7. ACTIVITIES & TIMELINE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'form_submit', 'call', 'meeting', 'whatsapp', 'email_sent', 'jira_update', 'status_change'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    performed_by VARCHAR(100) DEFAULT 'System',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(activity_type);

-- ----------------------------------------------------------------------------
-- 8. OPERATIONAL TASKS (JIRA MIRROR & INTERNAL ACTION ITEMS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    jira_subtask_key VARCHAR(50),
    title VARCHAR(255) NOT NULL, -- 'Contact', 'Follow Up 1', 'Gather Requirements', etc.
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'To Do', -- 'To Do', 'In Progress', 'Done', 'Blocked'
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    assigned_to VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- ----------------------------------------------------------------------------
-- 9. USER BEHAVIOR & CLIENT-SIDE TELEMETRY EVENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    visitor_id VARCHAR(100),
    event_name VARCHAR(100) NOT NULL, -- 'page_view', 'cta_click', 'form_start', 'form_submit', 'scroll_depth', 'chat_message'
    page_url TEXT NOT NULL,
    page_title VARCHAR(255),
    referrer TEXT,
    event_data JSONB DEFAULT '{}'::jsonb,
    
    -- Technical Context
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_session ON public.website_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON public.website_events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.website_events(created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. SYSTEM AUDIT LOGS (SECURITY & GOVERNANCE AUDIT TRAIL)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(100) DEFAULT 'system',
    actor_role VARCHAR(50) DEFAULT 'system',
    action VARCHAR(100) NOT NULL, -- 'CREATE_LEAD', 'UPDATE_STATUS', 'JIRA_SYNC', 'API_KEY_ROTATION'
    target_table VARCHAR(100),
    target_id VARCHAR(100),
    old_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 11. AUTOMATED TRIGGERS & FUNCTIONS
-- ----------------------------------------------------------------------------

-- Function: Automatic updated_at timestamp management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all stateful entities
DROP TRIGGER IF EXISTS trg_companies_updated_at ON public.companies;
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Automatic Activity Record on Lead Creation
CREATE OR REPLACE FUNCTION record_lead_creation_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.activities (
        lead_id,
        contact_id,
        activity_type,
        title,
        description,
        performed_by,
        metadata
    ) VALUES (
        NEW.id,
        NEW.contact_id,
        'lead_created',
        'Lead created via ' || NEW.form_type,
        'Lead ' || NEW.lead_number || ' registered through ' || NEW.source,
        'Lead Engine',
        jsonb_build_object(
            'lead_number', NEW.lead_number,
            'source', NEW.source,
            'page_url', NEW.page_url
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lead_creation_activity ON public.leads;
CREATE TRIGGER trg_lead_creation_activity AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION record_lead_creation_activity();

-- ----------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jira_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_sheet_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous public inserts for lead ingestion and telemetry
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to website_events" ON public.website_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to form_submissions" ON public.form_submissions FOR INSERT WITH CHECK (true);

-- Authenticated Admin / Service Role full access
CREATE POLICY "Admin full access on leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on companies" ON public.companies FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on contacts" ON public.contacts FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on campaigns" ON public.campaigns FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on activities" ON public.activities FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on tasks" ON public.tasks FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on sync logs" ON public.jira_sync_logs FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on sheet logs" ON public.google_sheet_sync_logs FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin full access on audit logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 13. REAL-TIME TELEMETRY & MARKETING VIEWS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_marketing_funnel_kpis AS
SELECT
    COUNT(DISTINCT l.id) AS total_leads,
    COUNT(DISTINCT CASE WHEN l.status IN ('qualified', 'proposal_sent', 'won') THEN l.id END) AS qualified_leads,
    COUNT(DISTINCT CASE WHEN l.status = 'won' THEN l.id END) AS converted_leads,
    ROUND(
        (COUNT(DISTINCT CASE WHEN l.status = 'won' THEN l.id END)::numeric / NULLIF(COUNT(DISTINCT l.id), 0)) * 100, 
        2
    ) AS lead_to_win_conversion_rate_pct,
    COUNT(DISTINCT CASE WHEN l.lead_type = 'sales' THEN l.id END) AS sales_leads,
    COUNT(DISTINCT CASE WHEN l.lead_type = 'career' THEN l.id END) AS career_applications,
    COUNT(DISTINCT CASE WHEN l.form_type = 'Chatbot' THEN l.id END) AS chatbot_leads,
    COUNT(DISTINCT CASE WHEN l.form_type = 'Calendar_Booking' THEN l.id END) AS booking_leads,
    COUNT(DISTINCT CASE WHEN l.jira_status = 'Created' THEN l.id END) AS jira_synced_leads
FROM public.leads l;

CREATE OR REPLACE VIEW public.v_lead_conversion_summary AS
SELECT
    COALESCE(l.traffic_channel, 'Direct') AS channel,
    COALESCE(l.utm_source, 'None') AS source,
    COALESCE(l.utm_campaign, 'None') AS campaign,
    COUNT(l.id) AS total_leads,
    COUNT(CASE WHEN l.status = 'won' THEN 1 END) AS closed_deals,
    ROUND(
        (COUNT(CASE WHEN l.status = 'won' THEN 1 END)::numeric / NULLIF(COUNT(l.id), 0)) * 100, 
        2
    ) AS conversion_rate_pct
FROM public.leads l
GROUP BY l.traffic_channel, l.utm_source, l.utm_campaign
ORDER BY total_leads DESC;

-- Grant access on views to authenticated roles
GRANT SELECT ON public.v_marketing_funnel_kpis TO authenticated, anon;
GRANT SELECT ON public.v_lead_conversion_summary TO authenticated, anon;
