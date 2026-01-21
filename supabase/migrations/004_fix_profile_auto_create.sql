-- =============================================
-- FIX RLS POLICY FOR AUTO-CREATE PROFILE
-- Migration 004: Allow users to create their own profile
-- =============================================

-- Drop existing insert policy
DROP POLICY IF EXISTS "Super admin can insert profiles" ON profiles;

-- Allow users to create their own profile (first time only)
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    -- Ensure profile doesn't already exist
    AND NOT EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
    )
  );

-- Re-create super admin insert policy (for user management)
CREATE POLICY "Super admin can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid() AND p2.role = 'super_admin'
    )
  );
