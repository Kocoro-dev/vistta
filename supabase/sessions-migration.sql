-- =============================================
-- Sessions & Attribution Tracking
-- Run this migration in Supabase SQL Editor
-- =============================================

-- Sessions table for tracking visitor/user sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User identification
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_id TEXT NOT NULL,
  session_number INTEGER DEFAULT 1,

  -- UTM Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Traffic source
  referrer TEXT,
  landing_page TEXT,

  -- Geolocation
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,

  -- User agent info
  language TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON public.sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_source ON public.sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON public.sessions(country);

-- RLS Policies
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (for server-side inserts)
CREATE POLICY "Service role full access"
  ON public.sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow inserts from authenticated users (for their own sessions)
CREATE POLICY "Users can insert own sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous inserts (visitor tracking before login)
CREATE POLICY "Allow anonymous session inserts"
  ON public.sessions
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- =============================================
-- Useful Views for Analytics
-- =============================================

-- Attribution summary view
CREATE OR REPLACE VIEW public.attribution_summary AS
SELECT
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT user_id) as registered_users,
  DATE(created_at) as date
FROM public.sessions
GROUP BY utm_source, utm_medium, utm_campaign, DATE(created_at)
ORDER BY date DESC, total_sessions DESC;

-- Country distribution view
CREATE OR REPLACE VIEW public.geo_distribution AS
SELECT
  country,
  country_code,
  COUNT(*) as sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT user_id) as registered_users
FROM public.sessions
WHERE country IS NOT NULL
GROUP BY country, country_code
ORDER BY sessions DESC;

-- Device distribution view
CREATE OR REPLACE VIEW public.device_distribution AS
SELECT
  device_type,
  browser,
  os,
  COUNT(*) as sessions,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM public.sessions
WHERE device_type IS NOT NULL
GROUP BY device_type, browser, os
ORDER BY sessions DESC;

-- Grant access to views
GRANT SELECT ON public.attribution_summary TO authenticated;
GRANT SELECT ON public.geo_distribution TO authenticated;
GRANT SELECT ON public.device_distribution TO authenticated;

-- =============================================
-- Comments
-- =============================================
COMMENT ON TABLE public.sessions IS 'Tracks visitor and user sessions with attribution data';
COMMENT ON COLUMN public.sessions.visitor_id IS 'Anonymous visitor ID generated client-side';
COMMENT ON COLUMN public.sessions.session_number IS 'Number of sessions for this visitor';
COMMENT ON COLUMN public.sessions.utm_source IS 'Traffic source (google, facebook, direct, etc)';
COMMENT ON COLUMN public.sessions.utm_medium IS 'Marketing medium (cpc, email, social, etc)';
COMMENT ON COLUMN public.sessions.utm_campaign IS 'Campaign name';
