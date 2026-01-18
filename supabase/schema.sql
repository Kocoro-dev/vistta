-- VISTTA Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- GENERATIONS TABLE
-- ============================================
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE public.generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Original image
  original_image_url TEXT NOT NULL,
  original_image_path TEXT NOT NULL,

  -- Generated image
  generated_image_url TEXT,
  generated_image_path TEXT,

  -- Generation parameters
  prompt TEXT,
  style TEXT NOT NULL,

  -- Replicate tracking
  replicate_prediction_id TEXT,
  status generation_status DEFAULT 'pending',
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Generations policies
CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
  ON public.generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
  ON public.generations FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX generations_user_id_idx ON public.generations(user_id);
CREATE INDEX generations_status_idx ON public.generations(status);
CREATE INDEX generations_created_at_idx ON public.generations(created_at DESC);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage

-- Create buckets (run in SQL or via Dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('originals', 'originals', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('generations', 'generations', true);

-- Storage policies for 'originals' bucket
CREATE POLICY "Users can upload their own originals"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'originals' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own originals"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'originals' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own originals"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'originals' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for 'generations' bucket (public read)
CREATE POLICY "Users can upload to generations"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'generations' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view generations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generations');

CREATE POLICY "Users can delete their own generations"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'generations' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- REALTIME
-- ============================================
-- Enable realtime for generations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.generations;
