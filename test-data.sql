-- Quick test to verify data exists and RLS policies are working
-- Run this in Supabase SQL Editor

-- 1. Check if salons exist
SELECT 'Salons check:' as test, COUNT(*) as count FROM public.salons;

-- 2. Check if stylists exist
SELECT 'Stylists check:' as test, COUNT(*) as count FROM public.stylists;

-- 3. Check if services exist
SELECT 'Services check:' as test, COUNT(*) as count FROM public.services;

-- 4. Check RLS policies on salons
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'salons';

-- 5. Try to select salons as anonymous user (this is what your app does)
SELECT id, name, city, state, rating, is_active FROM public.salons LIMIT 5;

-- 6. Check if is_active is true for all salons
SELECT id, name, is_active FROM public.salons;
