-- Complete Database Setup for Bellanour Mobile App
-- This script ensures all tables exist with correct structure
-- Run this FIRST in Supabase SQL Editor before running seed-data.sql

-- Note: Profiles table already exists, skipping it

-- ============================================================================
-- Drop and recreate all tables to ensure clean state
-- ============================================================================

-- Drop existing tables (cascade will remove dependent objects)
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.stylists CASCADE;
DROP TABLE IF EXISTS public.salons CASCADE;

-- ============================================================================
-- SALONS TABLE
-- ============================================================================

CREATE TABLE public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  google_place_id TEXT UNIQUE,
  cover_image TEXT,
  images TEXT[],
  business_hours JSONB,
  amenities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active salons"
  ON public.salons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Salon owners can manage their salons"
  ON public.salons FOR ALL
  USING (auth.uid() = owner_id);

CREATE INDEX idx_salons_owner_id ON public.salons(owner_id);
CREATE INDEX idx_salons_city ON public.salons(city);
CREATE INDEX idx_salons_is_active ON public.salons(is_active);

-- ============================================================================
-- STYLISTS TABLE
-- ============================================================================

CREATE TABLE public.stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[],
  avatar_url TEXT,
  portfolio_images TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  years_experience INTEGER,
  instagram_handle TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active stylists"
  ON public.stylists FOR SELECT
  USING (is_active = true);

CREATE POLICY "Salon owners can manage their stylists"
  ON public.stylists FOR ALL
  USING (
    salon_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.salons
      WHERE salons.id = stylists.salon_id
      AND salons.owner_id = auth.uid()
    )
  );

CREATE INDEX idx_stylists_salon_id ON public.stylists(salon_id);
CREATE INDEX idx_stylists_is_active ON public.stylists(is_active);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Salon owners can manage services"
  ON public.services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.salons
      WHERE salons.id = services.salon_id
      AND salons.owner_id = auth.uid()
    )
  );

CREATE INDEX idx_services_salon_id ON public.services(salon_id);
CREATE INDEX idx_services_is_active ON public.services(is_active);

-- ============================================================================
-- Success message
-- ============================================================================

SELECT 'Database schema created successfully!' as message,
       'Run seed-data.sql next to populate with sample data' as next_step;
