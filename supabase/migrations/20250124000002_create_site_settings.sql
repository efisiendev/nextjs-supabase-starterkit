-- =============================================
-- Site Settings Table
-- =============================================
-- Store site-wide settings (home, about, etc.)
-- =============================================

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE CHECK (key IN ('home', 'about')),
  content JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_updated_at ON site_settings(updated_at DESC);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data from existing JSON files
INSERT INTO public.site_settings (key, content) VALUES
('home', '{
  "hero": {
    "badge": "Official Website HMJF UIN Alauddin Makassar",
    "title": "Himpunan Mahasiswa",
    "titleHighlight": "Jurusan Farmasi",
    "description": "HMJF UIN Alauddin Makassar siap mencetak farmasis unggul, berintegritas, dan berwawasan luas. Kami hadir sebagai pusat pengembangan potensi mahasiswa farmasi yang progresif dan berdaya saing.",
    "primaryCTA": {"text": "Lihat Event Kami", "link": "/events"},
    "secondaryCTA": {"text": "Tentang Kami", "link": "/about"},
    "stats": [
      {"value": "200+", "label": "Anggota Aktif"},
      {"value": "50+", "label": "Event per Tahun"},
      {"value": "8", "label": "Divisi"}
    ]
  },
  "features": {
    "title": "Apa yang Kami Lakukan?",
    "description": "Berbagai program unggulan kami hadirkan untuk mendukung pengembangan akademik dan profesionalisme Anda",
    "items": [
      {
        "icon": "GraduationCap",
        "title": "Pengembangan Akademik",
        "description": "Kami menyelenggarakan kajian ilmiah dan workshop untuk meningkatkan kompetensi kefarmasian",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Users",
        "title": "Kepemimpinan",
        "description": "Kami membentuk karakter pemimpin masa depan melalui regenerasi dan kaderisasi terstruktur",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Heart",
        "title": "Pengabdian Masyarakat",
        "description": "Kami terjun langsung memberikan kontribusi nyata bagi kesehatan masyarakat luas",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Sparkles",
        "title": "Networking",
        "description": "Kami membangun jejaring luas dengan alumni, praktisi, dan mahasiswa farmasi se-Indonesia",
        "color": "text-primary-700 bg-primary-50"
      }
    ]
  },
  "cta": {
    "title": "Kenali Lebih Dekat",
    "description": "Mari bersinergi dalam membangun farmasis profesional yang berakhlak mulia melalui pengembangan akademik dan pengabdian.",
    "primaryCTA": {"text": "Lihat Kepengurusan", "link": "/leadership"},
    "secondaryCTA": {"text": "Hubungi Kami", "phone": "+6281234567890"}
  }
}'::jsonb),

('about', '{
  "mission": "Mengembangkan potensi mahasiswa Farmasi melalui kegiatan akademik, pengabdian masyarakat, dan peningkatan soft skills untuk menjadi farmasis profesional yang berintegritas dan berkontribusi bagi kesehatan masyarakat.",
  "vision": "Menjadi organisasi mahasiswa Farmasi yang unggul, inovatif, dan terdepan dalam pengembangan kompetensi akademik dan non-akademik mahasiswa Farmasi di tingkat regional dan nasional.",
  "story": "Himpunan Mahasiswa Jurusan Farmasi (HMJF) UIN Alauddin Makassar adalah organisasi intra kampus yang mewadahi seluruh mahasiswa Jurusan Farmasi. Didirikan dengan semangat pengabdian dan pengembangan ilmu kefarmasian, HMJF telah menjadi rumah kedua bagi mahasiswa untuk mengembangkan potensi akademik dan non-akademik.",
  "values": [
    {"title": "Akademik", "description": "Mendorong keunggulan akademik melalui kajian ilmiah, seminar, dan workshop kefarmasian", "icon": "BookOpen"},
    {"title": "Kepemimpinan", "description": "Membentuk jiwa kepemimpinan yang amanah, profesional, dan bertanggung jawab", "icon": "Users"},
    {"title": "Pengabdian", "description": "Berkontribusi aktif dalam kegiatan sosial dan kesehatan masyarakat", "icon": "HeartHandshake"},
    {"title": "Profesionalisme", "description": "Mempersiapkan mahasiswa menjadi farmasis yang kompeten dan berintegritas", "icon": "Briefcase"}
  ],
  "timeline": [
    {"year": "2015", "title": "Pendirian HMJF", "description": "Resmi berdiri sebagai wadah mahasiswa Farmasi UIN Alauddin Makassar"},
    {"year": "2017", "title": "Pharmacy Camp Pertama", "description": "Menyelenggarakan Pharmacy Camp sebagai program unggulan pengembangan soft skills"},
    {"year": "2019", "title": "Kolaborasi Nasional", "description": "Menjalin kerjasama dengan berbagai organisasi farmasi tingkat nasional"},
    {"year": "2021", "title": "Digitalisasi Program", "description": "Adaptasi digital dalam kegiatan organisasi dan pelayanan anggota"},
    {"year": "2023", "title": "Prestasi Nasional", "description": "Meraih penghargaan sebagai HMJ Farmasi terbaik di berbagai kompetisi"}
  ]
}'::jsonb);
