-- Script untuk membuat profile untuk user yang sudah ada di auth.users
-- Jalankan di Supabase SQL Editor

-- 1. Cek user yang belum punya profile
SELECT
  u.id,
  u.email,
  u.created_at,
  CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- 2. Buat profile untuk user yang belum punya profile
-- Ganti role sesuai kebutuhan: 'super_admin', 'admin', atau 'kontributor'
INSERT INTO profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'super_admin' -- GANTI ROLE DI SINI
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 3. Verifikasi profile sudah dibuat
SELECT
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at
FROM profiles p
ORDER BY p.created_at DESC;
