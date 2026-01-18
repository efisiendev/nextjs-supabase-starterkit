export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'HMJF UIN Alauddin',
  fullName: 'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar - Wadah organisasi mahasiswa farmasi untuk pengembangan akademik, soft skills, dan pengabdian masyarakat',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
  email: 'hmjf@uin-alauddin.ac.id',
  instagram: '@hmjf.uinalauddin',
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  articles: '/articles',
  events: '/events',
  leadership: '/leadership',
  members: '/members',
  gallery: '/gallery',
} as const;

export const ARTICLE_CATEGORIES = {
  post: 'Post',
  blog: 'Blog',
  opinion: 'Opinion',
  publication: 'Publication',
  info: 'Info',
} as const;

export const EVENT_CATEGORIES = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  'community-service': 'Pengabdian Masyarakat',
  competition: 'Kompetisi',
  training: 'Pelatihan',
  other: 'Lainnya',
} as const;

export const DIVISIONS = {
  'internal-affairs': 'Dalam Negeri',
  'external-affairs': 'Luar Negeri',
  academic: 'Keilmuan',
  'student-development': 'Pengembangan Mahasiswa',
  entrepreneurship: 'Kewirausahaan',
  'media-information': 'Media dan Informasi',
  'sports-arts': 'Olahraga dan Seni',
  'islamic-spirituality': 'Kerohanian Islam',
} as const;

export const GALLERY_CATEGORIES = {
  activities: 'Aktivitas',
  events: 'Event',
  facilities: 'Fasilitas',
  organization: 'Organisasi',
} as const;
