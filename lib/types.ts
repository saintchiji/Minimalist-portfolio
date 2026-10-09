export type VideoSource = 'direct' | 'drive' | 'youtube' | 'instagram' | 'x' | 'other';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string; // e.g. 'long-form', 'short-form', 'commercial', 'wedding'
  categoryLabel: string;
  genre: string;
  client: string;
  role: string;
  year: string;
  duration: string;
  aspectRatio: string;
  videoSource: VideoSource;
  videoUrl: string;
  thumbnailUrl: string;
  synopsis: string;
  equipment: string[];
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  enabled: boolean;
}

export interface HeroSection {
  visible?: boolean;
  alignment?: 'left' | 'center' | 'right';
  headline: string;
  professionalTitle?: string;
  subtitle: string;
  statement: string;
  backgroundMedia?: {
    type: 'none' | 'image' | 'video';
    url: string;
    opacity: number; // 0 to 1
  };
  showreelVideoUrl: string;
  showreelSource: VideoSource;
  showreelPoster: string;
  ctaPrimaryText: string;
  ctaPrimaryLink?: string;
  ctaPrimaryVisible?: boolean;
  ctaSecondaryText: string;
  ctaSecondaryLink?: string;
  ctaSecondaryVisible?: boolean;
  stats: Array<{ label: string; value: string }>;
}

export interface Award {
  id: string;
  year: string;
  title: string;
  festival: string;
  work: string;
}

export interface GearCategory {
  id: string;
  category: string;
  items: string[];
}

export interface AboutSection {
  fullName: string;
  title: string;
  location: string;
  bio: string[];
  philosophy: string;
  portraitUrl: string;
  awards: Award[];
  gearCategories: GearCategory[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  order: number;
}

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  location: string;
  timezone: string;
  agent: string;
  availabilityStatus: string;
  inquiries: Inquiry[];
}

export interface BrandingSettings {
  siteTitle: string;
  monogram: string;
  logoUrl: string;
  logoHeight: number;
  showTitleAlongsideLogo: boolean;
  faviconUrl: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface NavigationSettings {
  items: NavItem[];
  footerCopyright: string;
  footerStatement: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface SectionVisibilityOrder {
  id: string;
  key: 'hero' | 'work' | 'about' | 'services' | 'contact';
  label: string;
  enabled: boolean;
  order: number;
}

export interface AppearanceSettings {
  defaultTheme: 'system' | 'dark' | 'light';
  defaultLayout: 'grid' | 'cinematic';
  typographyStyle?: 'sans' | 'mono';
  spacingDensity?: 'comfortable' | 'compact' | 'expansive';
  autoplayOnMute: boolean;
  showTechnicalSpecs: boolean;
  sections?: SectionVisibilityOrder[];
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  keywords: string;
  adminEmail: string;
  adminPasswordHash: string;
  salt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
}

export interface PortfolioDatabase {
  hero: HeroSection;
  projects: Project[];
  categories: Category[];
  about: AboutSection;
  services: ServiceItem[];
  workflow: WorkflowStep[];
  contact: ContactSettings;
  branding: BrandingSettings;
  navigation: NavigationSettings;
  socials: SocialLink[];
  appearance: AppearanceSettings;
  general: GeneralSettings;
  media: MediaItem[];
}
