-- Create a test teacher account in Supabase
-- Note: This is for development purposes only

-- First, create the test users in the auth schema
-- We need to create these using auth.users for Supabase authentication
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
)
VALUES (
  'e9a12b66-4f25-4df2-a483-a1de48398a7b', -- Valid UUID format
  'teacher@example.com',
  '$2a$10$nK2fg9WcaHjVEbFpM8UyO.YJi5xNJch1XbhP1BpxPESHvEVADZTMG', -- This is 'password123' encrypted
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test Teacher", "role": "teacher"}',
  NOW(),
  NOW(),
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
)
VALUES (
  '21c3f5f3-8d8f-49b9-bfc2-7d01ea11f145', -- Valid UUID format
  'student@example.com',
  '$2a$10$nK2fg9WcaHjVEbFpM8UyO.YJi5xNJch1XbhP1BpxPESHvEVADZTMG', -- This is 'password123' encrypted
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test Student", "role": "student"}',
  NOW(),
  NOW(),
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Now create the user profiles
INSERT INTO public.user_profiles (
  user_id, 
  email, 
  role, 
  display_name, 
  created_at, 
  subscription_type, 
  custom_sets_count, 
  max_custom_sets
)
VALUES (
  'e9a12b66-4f25-4df2-a483-a1de48398a7b', -- Teacher ID
  'teacher@example.com', 
  'teacher', 
  'Test Teacher', 
  NOW(), 
  'premium', 
  0, 
  100
)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_profiles (
  user_id, 
  email, 
  role, 
  display_name, 
  created_at, 
  subscription_type, 
  custom_sets_count, 
  max_custom_sets
)
VALUES (
  '21c3f5f3-8d8f-49b9-bfc2-7d01ea11f145', -- Student ID
  'student@example.com', 
  'student', 
  'Test Student', 
  NOW(), 
  'free', 
  0, 
  10
)
ON CONFLICT (user_id) DO NOTHING;

-- Create a couple of classes for the teacher
INSERT INTO public.classes (
  id,
  name,
  teacher_id,
  description,
  created_at,
  level
)
VALUES
  (
    'f2a1e3c4-d5b6-47c8-8d9e-0f1a2b3c4d5e', -- Valid UUID format
    'Beginner English',
    'e9a12b66-4f25-4df2-a483-a1de48398a7b',
    'A class for English language beginners',
    NOW(),
    'beginner'
  ),
  (
    'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f', -- Valid UUID format
    'Intermediate Spanish',
    'e9a12b66-4f25-4df2-a483-a1de48398a7b',
    'A class for intermediate Spanish learners',
    NOW(),
    'intermediate'
  )
ON CONFLICT (id) DO NOTHING;

-- Create a couple of wordlists for the teacher
INSERT INTO public.custom_wordlists (
  id,
  name,
  creator_id,
  description,
  is_public,
  words,
  created_at
)
VALUES
  (
    'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6', -- Valid UUID format
    'Basic Greetings',
    'e9a12b66-4f25-4df2-a483-a1de48398a7b',
    'Common greetings and introductions',
    TRUE,
    '[{"term": "hello", "definition": "hola"}, {"term": "goodbye", "definition": "adiós"}, {"term": "good morning", "definition": "buenos días"}]'::jsonb,
    NOW()
  ),
  (
    'd7e8f9a0-b1c2-d3e4-f5a6-b7c8d9e0f1a2', -- Valid UUID format
    'Food Vocabulary',
    'e9a12b66-4f25-4df2-a483-a1de48398a7b',
    'Words related to food and dining',
    TRUE,
    '[{"term": "apple", "definition": "manzana"}, {"term": "bread", "definition": "pan"}, {"term": "water", "definition": "agua"}]'::jsonb,
    NOW()
  )
ON CONFLICT (id) DO NOTHING; 