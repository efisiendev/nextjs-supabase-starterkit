-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: members
-- =============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  photo TEXT,
  batch TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'alumni')),
  division TEXT,
  position TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL,
  graduated_at TIMESTAMP WITH TIME ZONE,
  bio TEXT,
  interests TEXT[],
  achievements TEXT[],
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for members
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_batch ON members(batch);
CREATE INDEX idx_members_division ON members(division);
CREATE INDEX idx_members_name ON members(name);

-- Full-text search index
CREATE INDEX idx_members_search ON members USING GIN (to_tsvector('indonesian', name || ' ' || nim));

-- =============================================
-- TABLE: articles
-- =============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('post', 'blog', 'opinion', 'publication', 'info')),
  author JSONB NOT NULL,
  cover_image TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for articles
CREATE UNIQUE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- Full-text search
CREATE INDEX idx_articles_search ON articles USING GIN (
  to_tsvector('indonesian', title || ' ' || excerpt || ' ' || content)
);

-- =============================================
-- TABLE: events
-- =============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('seminar', 'workshop', 'community-service', 'competition', 'training', 'other')),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB NOT NULL,
  cover_image TEXT NOT NULL,
  images TEXT[],
  organizer JSONB NOT NULL,
  registration_url TEXT,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for events
CREATE UNIQUE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = true;

-- =============================================
-- TABLE: leadership
-- =============================================
CREATE TABLE leadership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('ketua', 'wakil-ketua', 'sekretaris', 'bendahara', 'coordinator', 'member')),
  division TEXT CHECK (division IN ('internal-affairs', 'external-affairs', 'academic', 'student-development', 'entrepreneurship', 'media-information', 'sports-arts', 'islamic-spirituality')),
  photo TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nim TEXT,
  batch TEXT,
  bio TEXT,
  social_media JSONB,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for leadership
CREATE INDEX idx_leadership_position ON leadership(position);
CREATE INDEX idx_leadership_division ON leadership(division);
CREATE INDEX idx_leadership_period ON leadership(period_start, period_end);
CREATE INDEX idx_leadership_order ON leadership("order");

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;

-- Phase 1: Public read access (no auth yet)
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read leadership" ON leadership FOR SELECT USING (true);

-- Phase 2 policies (commented out, to be enabled with auth):
-- CREATE POLICY "Admin full access members" ON members FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Kontributor write articles" ON articles FOR INSERT USING (auth.jwt() ->> 'role' IN ('admin', 'kontributor'));

-- =============================================
-- TRIGGERS (Auto-update updated_at)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leadership_updated_at BEFORE UPDATE ON leadership
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
