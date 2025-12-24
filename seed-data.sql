-- Seed data for Bellanour Mobile App
-- Run this in Supabase SQL Editor

-- First, run setup-database.sql to create tables

-- Create a test user if none exists
DO $$
DECLARE
  test_user_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Check if any users exist
  SELECT EXISTS(SELECT 1 FROM auth.users LIMIT 1) INTO user_exists;
  
  IF NOT user_exists THEN
    -- Create a test user
    test_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      test_user_id,
      '00000000-0000-0000-0000-000000000000',
      'test@bellanour.com',
      crypt('testpassword123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test User"}',
      false,
      'authenticated'
    );
    
    RAISE NOTICE 'Created test user with ID: %', test_user_id;
    RAISE NOTICE 'Email: test@bellanour.com';
    RAISE NOTICE 'Password: testpassword123';
  ELSE
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    RAISE NOTICE 'Using existing user ID: %', test_user_id;
  END IF;
END $$;

-- Insert Sample Salons
INSERT INTO public.salons (id, owner_id, name, description, address, city, state, zip_code, phone, email, rating, review_count, cover_image)
SELECT 
  id, 
  (SELECT id FROM auth.users LIMIT 1) as owner_id,
  name,
  description,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  rating,
  review_count,
  cover_image
FROM (VALUES
  (
    '11111111-1111-1111-1111-111111111111'::UUID,
    'Star Hair Ltd.',
    'Premium hair salon specializing in modern cuts, color treatments, and styling. Our expert team delivers personalized service.',
    '3660 W Quail Kansas City',
    'Alabama',
    'AL',
    '35004',
    '(323) 555-0100',
    'info@starhair.com',
    5.0::DECIMAL,
    127,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'
  ),
  (
    '22222222-2222-2222-2222-222222222222'::UUID,
    'Wade Warren Salon',
    'Trendy salon offering cutting-edge styles, vibrant color work, and expert barbering services. Walk-ins welcome!',
    '9758 Wyatt Drive',
    'Alabama',
    'AL',
    '35005',
    '(718) 555-0200',
    'hello@wadewarren.com',
    4.0::DECIMAL,
    203,
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800'
  ),
  (
    '33333333-3333-3333-3333-333333333333'::UUID,
    'Razor Hair Ltd.',
    'Full-service salon offering hair, nails, and wellness treatments. Experience luxury and transformation.',
    '5 Albert road, Serroldwick',
    'New York',
    'NY',
    '10001',
    '(512) 555-0300',
    'contact@razorhair.com',
    5.0::DECIMAL,
    342,
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800'
  ),
  (
    '44444444-4444-4444-4444-444444444444'::UUID,
    'Elite Cuts Studio',
    'Modern barbershop and styling studio. Expert in fades, beard grooming, and contemporary hairstyles.',
    '2847 Michigan Avenue',
    'California',
    'CA',
    '90210',
    '(415) 555-0400',
    'info@elitecuts.com',
    4.7::DECIMAL,
    156,
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800'
  ),
  (
    '55555555-5555-5555-5555-555555555555'::UUID,
    'Glamour Studio',
    'High-end salon specializing in bridal hair, makeup, and special occasion styling.',
    '1523 Fashion Boulevard',
    'Florida',
    'FL',
    '33101',
    '(305) 555-0500',
    'bookings@glamourstudio.com',
    4.9::DECIMAL,
    289,
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800'
  ),
  (
    '66666666-6666-6666-6666-666666666666'::UUID,
    'The Barber Shop',
    'Traditional barbershop with modern techniques. Specializing in classic cuts and hot towel shaves.',
    '892 Main Street',
    'Texas',
    'TX',
    '75001',
    '(214) 555-0600',
    'hello@thebarbershop.com',
    4.5::DECIMAL,
    198,
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800'
  )
) AS salons(id, name, description, address, city, state, zip_code, phone, email, rating, review_count, cover_image)
ON CONFLICT (id) DO NOTHING;

-- Insert Stylists (both salon-based and independent)
INSERT INTO public.stylists (id, salon_id, name, bio, specialties, rating, review_count, years_experience, avatar_url, is_active)
VALUES
  -- Stylists for Star Hair Ltd.
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Isabella Martinez',
    'Master colorist with 12 years of experience. Specializing in balayage and color correction.',
    ARRAY['Hair Coloring', 'Balayage', 'Color Correction'],
    4.9,
    89,
    12,
    'https://i.pravatar.cc/300?img=1',
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'James Chen',
    'Award-winning stylist known for precision cuts and modern styling.',
    ARRAY['Precision Cuts', 'Modern Styling', 'Mens Cuts'],
    4.8,
    67,
    8,
    'https://i.pravatar.cc/300?img=13',
    true
  ),
  -- Stylists for Wade Warren Salon
  (
    'b1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Marcus Johnson',
    'Expert barber specializing in fades, tapers, and beard sculpting.',
    ARRAY['Barbering', 'Fades', 'Beard Grooming'],
    4.7,
    142,
    10,
    'https://i.pravatar.cc/300?img=12',
    true
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Emma Rodriguez',
    'Creative colorist passionate about vivid colors and unique styles.',
    ARRAY['Creative Coloring', 'Fashion Colors', 'Vivid Hues'],
    4.6,
    95,
    6,
    'https://i.pravatar.cc/300?img=5',
    true
  ),
  -- Stylists for Razor Hair
  (
    'c1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Sophie Laurent',
    'Celebrity stylist specializing in bridal hair and special occasion styling.',
    ARRAY['Bridal Styling', 'Updos', 'Special Occasions'],
    5.0,
    124,
    15,
    'https://i.pravatar.cc/300?img=9',
    true
  ),
  -- Independent Stylists (salon_id is NULL)
  (
    'd1111111-1111-1111-1111-111111111111',
    NULL,
    'Alex Thompson',
    'Mobile stylist bringing salon-quality service to your home. Specializing in cuts and styling.',
    ARRAY['Mobile Styling', 'Haircuts', 'Styling'],
    4.8,
    78,
    7,
    'https://i.pravatar.cc/300?img=33',
    true
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    NULL,
    'Maria Santos',
    'Independent colorist offering personalized color consultations and treatments.',
    ARRAY['Hair Coloring', 'Color Consultation', 'Highlights'],
    4.9,
    156,
    11,
    'https://i.pravatar.cc/300?img=20',
    true
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    NULL,
    'David Kim',
    'Freelance barber specializing in modern mens cuts and grooming.',
    ARRAY['Mens Grooming', 'Mens Cuts', 'Barbering'],
    4.7,
    203,
    9,
    'https://i.pravatar.cc/300?img=52',
    true
  ),
  (
    'd4444444-4444-4444-4444-444444444444',
    NULL,
    'Rachel Green',
    'Extension specialist and hair care expert. Creating natural-looking transformations.',
    ARRAY['Hair Extensions', 'Hair Care', 'Natural Looks'],
    4.8,
    89,
    6,
    'https://i.pravatar.cc/300?img=24',
    true
  ),
  (
    'd5555555-5555-5555-5555-555555555555',
    NULL,
    'Chris Anderson',
    'Texture specialist for curly and textured hair. Embracing natural beauty.',
    ARRAY['Curly Hair', 'Textured Hair', 'Natural Hair'],
    4.9,
    134,
    12,
    'https://i.pravatar.cc/300?img=60',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Services
INSERT INTO public.services (id, salon_id, name, description, price, duration_minutes, category)
VALUES
  -- Star Hair Ltd. Services
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Signature Haircut', 'Precision cut with consultation and styling', 85, 60, 'haircut'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Balayage Full', 'Hand-painted highlights for natural dimension', 250, 180, 'coloring'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Blowout & Style', 'Professional blow dry and styling', 65, 45, 'styling'),
  -- Wade Warren Salon Services
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Mens Cut & Style', 'Contemporary mens haircut with styling', 45, 45, 'haircut'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Beard Trim', 'Precision beard shaping and grooming', 25, 20, 'grooming'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Creative Color', 'Fashion colors and vivid hues', 180, 150, 'coloring'),
  -- Razor Hair Services
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Bridal Package', 'Hair and makeup for your special day', 350, 240, 'special'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Updo Styling', 'Elegant updo for special occasions', 120, 90, 'styling'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Deep Conditioning', 'Intensive treatment for damaged hair', 75, 60, 'treatment')
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully!' as message,
       (SELECT COUNT(*) FROM public.salons) as total_salons,
       (SELECT COUNT(*) FROM public.stylists) as total_stylists,
       (SELECT COUNT(*) FROM public.services) as total_services;
