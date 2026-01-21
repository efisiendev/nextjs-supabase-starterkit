-- =============================================
-- UPDATE ARTICLES TABLE FOR APPROVAL WORKFLOW
-- =============================================

-- Add status column for article approval
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users;

-- Add index for status queries
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);

-- =============================================
-- UPDATE EVENTS TABLE FOR APPROVAL WORKFLOW
-- =============================================

-- Add creator tracking
ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users;
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);

-- =============================================
-- RLS POLICIES FOR ARTICLES (RBAC)
-- =============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read articles" ON articles;

-- Public can only view published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Kontributor can view their own articles (any status)
CREATE POLICY "Kontributor can view own articles"
  ON articles FOR SELECT
  USING (
    auth.uid() = author_id
  );

-- Admin and Super Admin can view all articles
CREATE POLICY "Admin can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Kontributor can create articles (default status: draft)
CREATE POLICY "Kontributor can create articles"
  ON articles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'kontributor'
    )
  );

-- Kontributor can update own articles (only if not published)
CREATE POLICY "Kontributor can update own draft articles"
  ON articles FOR UPDATE
  USING (
    auth.uid() = author_id AND
    status IN ('draft', 'pending')
  );

-- Admin can update any article and change status to published
CREATE POLICY "Admin can update articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admin can delete articles
CREATE POLICY "Admin can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- RLS POLICIES FOR EVENTS (RBAC)
-- =============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read events" ON events;

-- Public can view all events
CREATE POLICY "Public can view events"
  ON events FOR SELECT
  USING (true);

-- Kontributor can create events
CREATE POLICY "Kontributor can create events"
  ON events FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'kontributor'
    )
  );

-- Kontributor can update own events
CREATE POLICY "Kontributor can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = creator_id);

-- Admin can update any event
CREATE POLICY "Admin can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admin can delete events
CREATE POLICY "Admin can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- RLS POLICIES FOR MEMBERS (ADMIN ONLY)
-- =============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read members" ON members;

-- Public can view active members
CREATE POLICY "Public can view active members"
  ON members FOR SELECT
  USING (true);

-- Only Admin and Super Admin can modify members
CREATE POLICY "Admin can create members"
  ON members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin can update members"
  ON members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin can delete members"
  ON members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- RLS POLICIES FOR LEADERSHIP (ADMIN ONLY)
-- =============================================

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public read leadership" ON leadership;

-- Public can view leadership
CREATE POLICY "Public can view leadership"
  ON leadership FOR SELECT
  USING (true);

-- Only Admin and Super Admin can modify leadership
CREATE POLICY "Admin can create leadership"
  ON leadership FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin can update leadership"
  ON leadership FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admin can delete leadership"
  ON leadership FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- UPDATE PROFILES POLICIES (IF NEEDED)
-- =============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
