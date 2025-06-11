-- Championships Credential Platform Database Schema
-- Comprehensive credential management for Big 12 Championship events

-- Create enum types for credential categories
CREATE TYPE credential_type AS ENUM (
  'media',
  'official', 
  'staff',
  'volunteer',
  'vendor',
  'athlete',
  'coach',
  'team_personnel',
  'vip',
  'sponsor',
  'photographer',
  'broadcaster'
);

CREATE TYPE credential_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'denied',
  'issued',
  'active',
  'revoked',
  'expired'
);

CREATE TYPE access_level AS ENUM (
  'field_access',
  'sideline_access',
  'press_box',
  'interview_room',
  'locker_room',
  'restricted_areas',
  'general_admission',
  'backstage',
  'venue_perimeter',
  'parking'
);

CREATE TYPE championship_sport AS ENUM (
  'football',
  'basketball_mens',
  'basketball_womens', 
  'baseball',
  'softball',
  'soccer',
  'volleyball',
  'tennis_mens',
  'tennis_womens',
  'golf_mens',
  'golf_womens',
  'track_field',
  'cross_country',
  'swimming_diving',
  'gymnastics',
  'wrestling',
  'equestrian'
);

-- Championship Events table
CREATE TABLE IF NOT EXISTS public.championship_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sport championship_sport NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  capacity INTEGER,
  description TEXT,
  credential_deadline TIMESTAMPTZ,
  event_logo_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credential Templates table
CREATE TABLE IF NOT EXISTS public.credential_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type credential_type NOT NULL,
  background_image_url TEXT,
  template_data JSONB, -- Store design template info
  access_levels access_level[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations/Affiliations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- media_outlet, university, sponsor, vendor, etc.
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES public.user_profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credential Requests table
CREATE TABLE IF NOT EXISTS public.credential_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  championship_event_id UUID REFERENCES public.championship_events(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES public.user_profiles(id),
  organization_id UUID REFERENCES public.organizations(id),
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  date_of_birth DATE,
  
  -- Credential Details
  credential_type credential_type NOT NULL,
  requested_access_levels access_level[] DEFAULT '{}',
  purpose TEXT, -- reason for credential request
  duration_start TIMESTAMPTZ,
  duration_end TIMESTAMPTZ,
  
  -- Documentation
  photo_url TEXT, -- headshot for credential
  identification_document_url TEXT,
  letter_of_assignment_url TEXT,
  additional_documents JSONB, -- array of document URLs
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Medical Information
  medical_conditions TEXT,
  allergies TEXT,
  
  -- Status and Workflow
  status credential_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  approved_by UUID REFERENCES public.user_profiles(id),
  approved_at TIMESTAMPTZ,
  denial_reason TEXT,
  
  -- Special Requests
  special_accommodations TEXT,
  vehicle_info JSONB, -- license plate, make, model for parking
  equipment_list TEXT[], -- list of equipment being brought
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issued Credentials table
CREATE TABLE IF NOT EXISTS public.issued_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_request_id UUID REFERENCES public.credential_requests(id) ON DELETE CASCADE,
  championship_event_id UUID REFERENCES public.championship_events(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.credential_templates(id),
  
  -- Credential Identifiers
  credential_number TEXT UNIQUE NOT NULL,
  qr_code TEXT UNIQUE NOT NULL, -- QR code data
  barcode TEXT, -- backup barcode
  
  -- Granted Access
  access_levels access_level[] NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  
  -- Credential Data
  holder_name TEXT NOT NULL,
  holder_title TEXT,
  organization_name TEXT,
  photo_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
  issued_by UUID REFERENCES public.user_profiles(id),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Security
  security_hash TEXT, -- hash for validation
  print_count INTEGER DEFAULT 0,
  last_printed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Log table for tracking credential usage
CREATE TABLE IF NOT EXISTS public.credential_access_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_id UUID REFERENCES public.issued_credentials(id) ON DELETE CASCADE,
  championship_event_id UUID REFERENCES public.championship_events(id) ON DELETE CASCADE,
  
  -- Access Details
  access_point TEXT NOT NULL, -- gate/entrance identifier
  access_type access_level NOT NULL,
  scan_result TEXT DEFAULT 'granted' CHECK (scan_result IN ('granted', 'denied', 'expired', 'revoked')),
  
  -- Scanner Information
  scanned_by UUID REFERENCES public.user_profiles(id),
  scanner_device_id TEXT,
  location_coordinates TEXT, -- GPS coordinates if available
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  additional_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credential Reviewers table (who can approve credentials)
CREATE TABLE IF NOT EXISTS public.credential_reviewers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  championship_event_id UUID REFERENCES public.championship_events(id) ON DELETE CASCADE,
  credential_types credential_type[] DEFAULT '{}', -- which types they can review
  max_approval_limit INTEGER DEFAULT 1000, -- maximum they can approve
  is_active BOOLEAN DEFAULT TRUE,
  assigned_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venue Access Points table
CREATE TABLE IF NOT EXISTS public.venue_access_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  championship_event_id UUID REFERENCES public.championship_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  required_access_levels access_level[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  operating_hours JSONB, -- schedule when this access point is active
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.championship_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issued_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_access_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Championship Events
CREATE POLICY "Anyone can view published championship events" ON public.championship_events
  FOR SELECT USING (status = 'upcoming' OR status = 'active');

CREATE POLICY "Operations and admin can manage championship events" ON public.championship_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'operations')
    )
  );

-- Credential Requests
CREATE POLICY "Users can view their own credential requests" ON public.credential_requests
  FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "Users can create credential requests" ON public.credential_requests
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update their own draft requests" ON public.credential_requests
  FOR UPDATE USING (requester_id = auth.uid() AND status = 'draft');

CREATE POLICY "Reviewers can view requests for their events" ON public.credential_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.credential_reviewers cr
      WHERE cr.user_id = auth.uid() 
      AND cr.championship_event_id = credential_requests.championship_event_id
      AND cr.is_active = TRUE
    )
  );

-- Organizations
CREATE POLICY "Anyone can view verified organizations" ON public.organizations
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin can manage all organizations" ON public.organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_championship_events_sport ON public.championship_events(sport);
CREATE INDEX IF NOT EXISTS idx_championship_events_dates ON public.championship_events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_credential_requests_event ON public.credential_requests(championship_event_id);
CREATE INDEX IF NOT EXISTS idx_credential_requests_requester ON public.credential_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_credential_requests_status ON public.credential_requests(status);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_number ON public.issued_credentials(credential_number);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_qr ON public.issued_credentials(qr_code);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_event ON public.issued_credentials(championship_event_id);
CREATE INDEX IF NOT EXISTS idx_access_log_credential ON public.credential_access_log(credential_id);
CREATE INDEX IF NOT EXISTS idx_access_log_event ON public.credential_access_log(championship_event_id);
CREATE INDEX IF NOT EXISTS idx_access_log_timestamp ON public.credential_access_log(created_at);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_championship_events_updated_at
  BEFORE UPDATE ON public.championship_events
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_credential_templates_updated_at
  BEFORE UPDATE ON public.credential_templates
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_credential_requests_updated_at
  BEFORE UPDATE ON public.credential_requests
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_issued_credentials_updated_at
  BEFORE UPDATE ON public.issued_credentials
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Functions for credential management
CREATE OR REPLACE FUNCTION generate_credential_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  -- Generate format: B12-YYYY-XXXXXX (B12 prefix, year, 6 digit number)
  result := 'B12-' || EXTRACT(YEAR FROM NOW()) || '-' || 
            LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
  
  -- Check if exists, regenerate if needed
  WHILE EXISTS (SELECT 1 FROM public.issued_credentials WHERE credential_number = result) LOOP
    result := 'B12-' || EXTRACT(YEAR FROM NOW()) || '-' || 
              LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate QR code data
CREATE OR REPLACE FUNCTION generate_qr_code_data(
  p_credential_id UUID,
  p_credential_number TEXT
)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  -- Generate QR code data with credential info and security hash
  result := jsonb_build_object(
    'id', p_credential_id,
    'number', p_credential_number,
    'timestamp', EXTRACT(EPOCH FROM NOW()),
    'hash', encode(digest(p_credential_id::TEXT || p_credential_number || NOW()::TEXT, 'sha256'), 'hex')
  )::TEXT;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert sample championship events
INSERT INTO public.championship_events (name, sport, start_date, end_date, venue_name, city, state, capacity, description) VALUES
('Big 12 Football Championship 2024', 'football', '2024-12-07', '2024-12-07', 'AT&T Stadium', 'Arlington', 'TX', 80000, 'Annual Big 12 Football Championship Game'),
('Big 12 Men''s Basketball Championship 2025', 'basketball_mens', '2025-03-13', '2025-03-16', 'T-Mobile Center', 'Kansas City', 'MO', 19500, 'Big 12 Men''s Basketball Tournament'),
('Big 12 Women''s Basketball Championship 2025', 'basketball_womens', '2025-03-07', '2025-03-10', 'Paycom Center', 'Oklahoma City', 'OK', 18203, 'Big 12 Women''s Basketball Tournament'),
('Big 12 Baseball Championship 2025', 'baseball', '2025-05-22', '2025-05-25', 'Globe Life Field', 'Arlington', 'TX', 40300, 'Big 12 Baseball Championship Tournament')
ON CONFLICT DO NOTHING;

-- Insert default credential templates
INSERT INTO public.credential_templates (name, type, access_levels, is_default) VALUES
('Media Credential', 'media', ARRAY['press_box', 'interview_room', 'general_admission']::access_level[], TRUE),
('Official Credential', 'official', ARRAY['field_access', 'sideline_access', 'restricted_areas']::access_level[], TRUE),
('Staff Credential', 'staff', ARRAY['backstage', 'venue_perimeter', 'general_admission']::access_level[], TRUE),
('VIP Credential', 'vip', ARRAY['press_box', 'general_admission', 'parking']::access_level[], TRUE),
('Photographer Credential', 'photographer', ARRAY['field_access', 'sideline_access', 'general_admission']::access_level[], TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample organizations
INSERT INTO public.organizations (name, type, website, contact_email, verification_status) VALUES
('ESPN', 'media_outlet', 'https://espn.com', 'credentials@espn.com', 'verified'),
('Fox Sports', 'media_outlet', 'https://foxsports.com', 'media@foxsports.com', 'verified'),
('Big 12 Conference', 'conference', 'https://big12sports.com', 'media@big12sports.com', 'verified'),
('University of Texas', 'university', 'https://texassports.com', 'media@texassports.com', 'verified'),
('Kansas Jayhawks', 'university', 'https://kuathletics.com', 'media@ku.edu', 'verified')
ON CONFLICT (name) DO NOTHING;