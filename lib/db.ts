import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  PortfolioDatabase,
  Project,
  Category,
  HeroSection,
  AboutSection,
  ServiceItem,
  WorkflowStep,
  ContactSettings,
  Inquiry,
  BrandingSettings,
  NavigationSettings,
  SocialLink,
  AppearanceSettings,
  GeneralSettings,
  MediaItem,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.json');

// Helper to hash passwords securely using scrypt
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, generatedSalt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: generatedSalt,
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(keyBuffer, hashBuffer);
  } catch {
    return false;
  }
}

// Initial seed data with high-caliber cinematography & editing work
function getInitialData(): PortfolioDatabase {
  const { hash, salt } = hashPassword('cinematography2026');

  return {
    hero: {
      visible: true,
      alignment: 'left',
      headline: 'JULIAN KALE',
      professionalTitle: 'Professional Video Editor & Cinematographer',
      subtitle: 'Director of Photography & Senior Colorist',
      statement:
        'Crafting light, shadow, and kinetic rhythm. Specializing in high-contrast cinematic narratives, commercial precision, and documentary storytelling.',
      backgroundMedia: {
        type: 'none',
        url: '',
        opacity: 0.15,
      },
      showreelVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      showreelSource: 'direct',
      showreelPoster: 'https://picsum.photos/seed/showreel-poster/1920/1080',
      ctaPrimaryText: 'Watch Showreel',
      ctaPrimaryLink: '#showreel',
      ctaPrimaryVisible: true,
      ctaSecondaryText: 'Inquire Availability',
      ctaSecondaryLink: '#contact',
      ctaSecondaryVisible: true,
      stats: [
        { label: 'Years On Set', value: '10+' },
        { label: 'Commercial & Narrative Films', value: '140+' },
        { label: 'Festival Awards & Laurels', value: '18' },
        { label: 'Formats Mastered', value: '35mm / 65mm / Large Format' },
      ],
    },
    projects: [
      {
        id: 'proj-1',
        title: 'THE SILENT TUNDRA',
        slug: 'the-silent-tundra',
        category: 'long-form',
        categoryLabel: 'Long-Form Videos',
        genre: 'Documentary Feature',
        client: 'Nordic Heritage Film Board',
        role: 'Director of Photography & Lead Colorist',
        year: '2025',
        duration: '78:40',
        aspectRatio: '2.39:1 Anamorphic',
        videoSource: 'youtube',
        videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', // Big Buck Bunny 4k or sample
        thumbnailUrl: 'https://picsum.photos/seed/tundra-arctic-cine/1280/720',
        synopsis:
          'An intimate 6-week expedition into Svalbard during the perpetual twilight of the polar night. Shot in sub-zero conditions using natural luminescence and aurora flares to explore environmental fragility.',
        equipment: [
          'ARRI Alexa Mini LF',
          'Cooke Anamorphic/i Full Frame Plus',
          'Arri Skypanel S60-C',
          'Ronin 2 3-Axis Gimbal',
          'DaVinci Resolve Studio (ACEScct)',
        ],
        featured: true,
        status: 'published',
        order: 1,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      },
      {
        id: 'proj-2',
        title: 'MONOCHROME: THE COUTURE ARCHIVE',
        slug: 'monochrome-the-couture-archive',
        category: 'short-form',
        categoryLabel: 'Short-Form Videos',
        genre: 'High Fashion Film & 9:16 Social Campaign',
        client: 'Atelier Noir Paris',
        role: 'Cinematographer & Online Editor',
        year: '2026',
        duration: '01:45',
        aspectRatio: '9:16 Vertical',
        videoSource: 'direct',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://picsum.photos/seed/fashion-monochrome-noir/1280/720',
        synopsis:
          'High-speed monochrome fashion capture exploring architectural silhouette and fabric motion. Captured at 120fps with razor-sharp macro lenses and hard tungsten lighting.',
        equipment: [
          'RED V-Raptor 8K VV',
          'Leitz PRIMO Primes',
          'Phantom Flex 4K High-Speed',
          'Astera Titan Tubes',
        ],
        featured: true,
        status: 'published',
        order: 2,
        createdAt: '2026-02-10T12:00:00Z',
        updatedAt: '2026-02-10T12:00:00Z',
      },
      {
        id: 'proj-3',
        title: 'PORSCHE 911 GT3 // VELOCITY & PULSE',
        slug: 'porsche-gt3-velocity-pulse',
        category: 'commercial',
        categoryLabel: 'Commercial Projects',
        genre: 'Automotive Commercial',
        client: 'Porsche Central Europe',
        role: 'Director of Photography',
        year: '2025',
        duration: '01:15',
        aspectRatio: '2.39:1 Anamorphic',
        videoSource: 'youtube',
        videoUrl: 'https://www.youtube.com/watch?v=YE7VzlLtp-4',
        thumbnailUrl: 'https://picsum.photos/seed/porsche-track-cinematic/1280/720',
        synopsis:
          'A breathless track-side celebration of mechanical mastery. Shot on alpine mountain passes and closed GP circuits with pursuit vehicle crane rigs and low-angle tracking.',
        equipment: [
          'ARRI Alexa 35',
          'Hawk V-Lite 2x Anamorphic',
          'Russian Arm Pursuit Rig',
          'Freefly Systems Tero Car',
        ],
        featured: true,
        status: 'published',
        order: 3,
        createdAt: '2025-05-20T14:30:00Z',
        updatedAt: '2025-05-20T14:30:00Z',
      },
      {
        id: 'proj-4',
        title: 'ELENA & MATTEO // VILLA BALBIANELLO',
        slug: 'elena-matteo-lake-como',
        category: 'wedding',
        categoryLabel: 'Wedding Films',
        genre: 'Cinematic Destination Wedding',
        client: 'Private Commission',
        role: 'Lead Cinematographer & Senior Editor',
        year: '2025',
        duration: '08:24',
        aspectRatio: '16:9',
        videoSource: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview',
        thumbnailUrl: 'https://picsum.photos/seed/lake-como-film-wedding/1280/720',
        synopsis:
          'A deeply poetic 3-day celebration on the waters of Lake Como, Italy. Blended with authentic Kodak 16mm analog grain and organic golden-hour natural light.',
        equipment: [
          'ARRI Alexa Mini LF',
          'ARRIFLEX 416 Super 16mm (Kodak Vision3 250D)',
          'Zeiss Supreme Primes',
          'Sennheiser MKH 416 Boom Audio',
        ],
        featured: true,
        status: 'published',
        order: 4,
        createdAt: '2025-09-04T08:00:00Z',
        updatedAt: '2025-09-04T08:00:00Z',
      },
      {
        id: 'proj-5',
        title: 'SOLITUDE OF THE DEEP OCEAN',
        slug: 'solitude-of-the-deep-ocean',
        category: 'long-form',
        categoryLabel: 'Long-Form Videos',
        genre: 'Environmental Cinema / Feature Documentary',
        client: 'Oceanic Research Foundation',
        role: 'Underwater Cinematographer & Editor',
        year: '2024',
        duration: '52:10',
        aspectRatio: '2.00:1 Univisium',
        videoSource: 'direct',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl: 'https://picsum.photos/seed/ocean-deep-cinematography/1280/720',
        synopsis:
          'Submerged camera rigs operating at depths exceeding 40 meters. Exploring nocturnal bioluminescence in the Azores archipelago without disruptive artificial strobes.',
        equipment: [
          'Sony FX9 in Gates Underwater Housing',
          'Sigma Cine High-Speed Primes',
          'Keldan 8XR 20000 Lumen Video Lights',
        ],
        featured: false,
        status: 'published',
        order: 5,
        createdAt: '2024-11-12T16:00:00Z',
        updatedAt: '2024-11-12T16:00:00Z',
      },
      {
        id: 'proj-6',
        title: 'CHRONOS // SWISS HOROLOGY',
        slug: 'chronos-swiss-horology',
        category: 'commercial',
        categoryLabel: 'Commercial Projects',
        genre: 'Luxury Watch Brand Film',
        client: 'Vacheron & Cie',
        role: 'Director of Photography & Colorist',
        year: '2025',
        duration: '00:58',
        aspectRatio: '16:9',
        videoSource: 'other',
        videoUrl: 'https://player.vimeo.com/video/76979871',
        thumbnailUrl: 'https://picsum.photos/seed/horology-macro-watch/1280/720',
        synopsis:
          'Extreme optical macro cinematography capturing the tourbillon movement and gear trains of a bespoke grand complication timepiece in Geneva.',
        equipment: [
          'RED Monstro 8K VV',
          'Laowa 24mm f/14 2X Macro Probe Lens',
          'Motion Control Slider (eMotimo Spectrum ST4)',
        ],
        featured: false,
        status: 'published',
        order: 6,
        createdAt: '2025-07-22T11:20:00Z',
        updatedAt: '2025-07-22T11:20:00Z',
      },
      {
        id: 'proj-7',
        title: 'OVERCAST IN TOKYO // SOUND & LIGHT',
        slug: 'overcast-in-tokyo',
        category: 'short-form',
        categoryLabel: 'Short-Form Videos',
        genre: 'Experimental Cityscape Reel',
        client: 'Personal Cinema Essay',
        role: 'Director, DP & Sound Designer',
        year: '2026',
        duration: '02:30',
        aspectRatio: '2.39:1 Anamorphic',
        videoSource: 'x',
        videoUrl: 'https://x.com/cinematography/status/178901234567890',
        thumbnailUrl: 'https://picsum.photos/seed/tokyo-rain-cinematic/1280/720',
        synopsis:
          'A meditative sensory study of Shinjuku and Shibuya during monsoon rains. Highlighting neon reflections on wet asphalt with minimal ambient scoring.',
        equipment: [
          'Sony A1 & FX3 Rig',
          'Cooke Panchro/i Classic FF',
          'SmallHD Cine 7 Monitor',
        ],
        featured: false,
        status: 'published',
        order: 7,
        createdAt: '2026-03-01T15:00:00Z',
        updatedAt: '2026-03-01T15:00:00Z',
      },
      {
        id: 'proj-8',
        title: 'CLARA & SEBASTIAN // SANTORINI CLIFFS',
        slug: 'clara-sebastian-santorini',
        category: 'wedding',
        categoryLabel: 'Wedding Films',
        genre: 'Intimate Cliffside Wedding',
        client: 'Private Commission',
        role: 'Director of Photography',
        year: '2025',
        duration: '06:15',
        aspectRatio: '16:9',
        videoSource: 'instagram',
        videoUrl: 'https://www.instagram.com/p/C-cinematic-wedding',
        thumbnailUrl: 'https://picsum.photos/seed/santorini-wedding-sunset/1280/720',
        synopsis:
          'An intimate sunset ceremony suspended over the Aegean caldera. Captured with graceful camera movement and rich tonal separation.',
        equipment: [
          'Canon C500 Mark II',
          'Canon CN-E Cinema Primes',
          'DJI Inspire 3 Drone with 8K X9-Air Gimbal',
        ],
        featured: false,
        status: 'published',
        order: 8,
        createdAt: '2025-10-18T10:00:00Z',
        updatedAt: '2025-10-18T10:00:00Z',
      },
    ],
    categories: [
      {
        id: 'cat-long',
        name: 'Long-Form Videos',
        slug: 'long-form',
        description: 'Narrative feature films, independent documentaries, and televised pilots.',
        order: 1,
        enabled: true,
      },
      {
        id: 'cat-short',
        name: 'Short-Form Videos',
        slug: 'short-form',
        description: 'Music videos, high-concept visual essays, and vertical social cinema campaigns.',
        order: 2,
        enabled: true,
      },
      {
        id: 'cat-comm',
        name: 'Commercial Projects',
        slug: 'commercial',
        description: 'Brand narratives, automotive showcases, luxury goods, and architectural visual films.',
        order: 3,
        enabled: true,
      },
      {
        id: 'cat-wed',
        name: 'Wedding Films',
        slug: 'wedding',
        description: 'Bespoke destination wedding films, timeless Super 16mm captures, and emotional highlights.',
        order: 4,
        enabled: true,
      },
    ],
    about: {
      fullName: 'JULIAN KALE',
      title: 'Director of Photography & Senior Film Colorist',
      location: 'London / Berlin / Available Worldwide',
      bio: [
        'With over a decade behind the lens and in post-production suites, Julian Kale approaches filmmaking as an exacting dialogue between natural light, texture, and temporal rhythm.',
        'Having operated on set across 24 countries, his work spans Cannes-nominated independent features, high-octane automotive commercials for Porsche and Audi, and bespoke destination wedding films recorded on analog 16mm and large-format cinema cameras.',
        'Julian manages projects from initial visual treatment and test shooting through on-set lighting execution, camera operation, offline cutting, and ACES-calibrated HDR color grading.',
      ],
      philosophy:
        '“Every frame must possess an honest gravitational weight. We do not merely illuminate a subject; we sculpt what the shadows choose to conceal.”',
      portraitUrl: 'https://picsum.photos/seed/cinematographer-portrait-bw/900/1200',
      awards: [
        {
          id: 'aw-1',
          year: '2025',
          title: 'Best Cinematography in a Documentary',
          festival: 'Copenhagen International Film Festival',
          work: 'The Silent Tundra',
        },
        {
          id: 'aw-2',
          year: '2024',
          title: 'Silver Screen Award - Commercial Cinematography',
          festival: 'Berlin Commercial Festival',
          work: 'Porsche 911 GT3 // Velocity',
        },
        {
          id: 'aw-3',
          year: '2024',
          title: 'Outstanding Color Grading & Finishing',
          festival: 'European Cinematography Awards (ECA)',
          work: 'Solitude of the Deep Ocean',
        },
        {
          id: 'aw-4',
          year: '2023',
          title: 'Best Fashion Film Cinematography',
          festival: 'Milan Fashion Film Festival',
          work: 'Atelier Noir Series',
        },
      ],
      gearCategories: [
        {
          id: 'gear-1',
          category: 'Camera Systems',
          items: [
            'ARRI Alexa Mini LF (Large Format 4.5K)',
            'ARRI Alexa 35 (Super 35 4.6K)',
            'RED V-Raptor 8K VV',
            'ARRIFLEX 416 Super 16mm Film Body',
            'Sony FX3 B-Camera / Gimbal Body',
          ],
        },
        {
          id: 'gear-2',
          category: 'Lenses & Optical Glass',
          items: [
            'Cooke Anamorphic/i Full Frame Plus (32, 40, 50, 75, 100mm)',
            'Leitz PRIMO Prime Set (T1.4)',
            'Zeiss Supreme Primes Full Frame',
            'Angénieux Optimo Ultra 12x Cine Zoom',
            'Laowa 24mm f/14 2X Macro Probe',
          ],
        },
        {
          id: 'gear-3',
          category: 'Lighting & Grip Support',
          items: [
            'ARRI Skypanel S60-C & S30-C Fixtures',
            'Aputure 1200d Pro & 600c Pro Daylight/RGB',
            'Astera Titan & Helios Wireless LED Tubes (8-Tube Kit)',
            'DJI Ronin 2 3-Axis Gimbal System',
            'Easyrig Vario 5 with Serene Arm',
          ],
        },
        {
          id: 'gear-4',
          category: 'Post-Production & Monitoring',
          items: [
            'Apple Mac Studio M2 Ultra (128GB Unified Memory)',
            'Sony BVM-HX310 4K HDR Reference Master Monitor',
            'DaVinci Resolve Advanced Panel',
            'Calibrated ACES / Rec.709 / P3-D65 Monitoring Environment',
            'SmallHD Cine 7 & Teradek Bolt 4K Wireless Video',
          ],
        },
      ],
    },
    services: [
      {
        id: 'srv-1',
        title: 'Cinematography & Directing Photography',
        tagline: 'Principal camera operation, optical design & lighting execution',
        description:
          'Full-scale visual direction for narrative films, commercials, music videos, and cinematic events. Comprehensive camera package selection, lens test management, look creation, and on-set team leadership.',
        deliverables: [
          'Pre-production moodboards & optical look development',
          'Location lighting plans & equipment logistics',
          'Principal photography on ARRI or RED camera packages',
          'Full RAW / ProRes source footage delivery & DIT logging',
        ],
        turnaround: 'Project-dependent / Half-day to multi-week productions',
        order: 1,
      },
      {
        id: 'srv-2',
        title: 'Post-Production & Editorial',
        tagline: 'Narrative pacing, rhythmic montage & story assembly',
        description:
          'Offline and online editing with deep attention to cadence, emotional arc, sound design integration, and visual pacing. Seamless handling of high-resolution RAW footage.',
        deliverables: [
          'Assembly, rough cut, and director’s cut iterations',
          'Sound design prep and temp mixing',
          'Picture lock online conform and master export',
          'Multi-aspect ratio exports (16:9, 9:16 vertical, 1:1, 2.39:1)',
        ],
        turnaround: '3 to 14 business days depending on project scope',
        order: 2,
      },
      {
        id: 'srv-3',
        title: 'Color Grading & Finishing',
        tagline: 'ACES-calibrated color science & distinctive visual tonality',
        description:
          'High-end color grading performed in DaVinci Resolve Studio on reference-grade Sony HDR monitors. Custom look development, film emulation, skin-tone isolation, and high dynamic range mastering.',
        deliverables: [
          'Show LUT and preview look generation',
          'Scene-to-scene matching & dynamic shot balancing',
          'Custom analog 35mm / 16mm grain and halation emulation',
          'HDR10, Dolby Vision, and SDR Web master deliveries',
        ],
        turnaround: '2 to 5 business days per project',
        order: 3,
      },
      {
        id: 'srv-4',
        title: 'Aerial & Specialty Camera Operation',
        tagline: 'Drone cinematography, pursuit tracking & high-speed capture',
        description:
          'Licensed commercial drone operations, precision pursuit vehicle tracking, underwater cinematography, and ultra-high-speed recording up to 1000fps for automotive and sports.',
        deliverables: [
          'DJI Inspire 3 (8K RAW CinemaDNG) aerial capture',
          'Sub-surface underwater camera housing recording',
          'High-speed Phantom or RED 120+ fps specialty clips',
          'FAA / EASA certified flight logs and insurance clearance',
        ],
        turnaround: 'Available alongside primary DP commissions',
        order: 4,
      },
    ],
    workflow: [
      {
        id: 'wf-1',
        step: '01',
        title: 'Concept & Visual Treatment',
        description:
          'We establish the visual language, contrast ratio, optical characteristics, and color palette through comprehensive lookbooks and lens tests.',
      },
      {
        id: 'wf-2',
        step: '02',
        title: 'Production & Lighting Sculpting',
        description:
          'On-set execution with precision lighting, calibrated camera movement, and meticulous exposure control to protect every shadow and highlight.',
      },
      {
        id: 'wf-3',
        step: '03',
        title: 'Editorial & Rhythm Assembly',
        description:
          'Cutting the footage to uncover the rhythm of every scene, balancing kinetic energy with breathing room and emotive sound design.',
      },
      {
        id: 'wf-4',
        step: '04',
        title: 'Color Science & Master Delivery',
        description:
          'Final pass in the DaVinci Resolve suite, ensuring consistent skin fidelity, deep blacks, rich highlights, and pristine delivery in all required exhibition formats.',
      },
    ],
    contact: {
      email: 'julian@kalecinema.com',
      phone: '+44 (0) 20 7946 0912',
      location: 'London, United Kingdom (Available Worldwide)',
      timezone: 'GMT / BST (London)',
      agent: 'United Cinematographers Agency — rep: Marcus Vance (marcus@unitedcinemareps.com)',
      availabilityStatus: 'Currently Booking Q4 2026 & Spring 2027 Commissions',
      inquiries: [
        {
          id: 'inq-sample-1',
          name: 'Sophia Laurent',
          email: 'sophia@luxurymedia.fr',
          company: 'Laurent Studio Paris',
          projectType: 'Commercial Campaign',
          timeline: 'November 2026',
          budget: '€15,000 - €30,000',
          message:
            'Hello Julian, we love your monochrome work on Atelier Noir. We have an upcoming autumn commercial campaign for a luxury fragrance brand shooting in Paris and Milan. Would love to discuss DP availability and look development.',
          status: 'read',
          createdAt: '2026-09-28T14:22:00Z',
        },
        {
          id: 'inq-sample-2',
          name: 'David Sterling',
          email: 'david@sterlingpictures.com',
          company: 'Sterling Pictures',
          projectType: 'Narrative Feature',
          timeline: 'Q1 2027',
          budget: '$50,000+',
          message:
            'We are currently in pre-production on an independent neo-noir thriller set in Berlin. We need a DP who understands deep shadows and anamorphic glass. Would you be open to reading the script treatment?',
          status: 'unread',
          createdAt: '2026-10-06T09:15:00Z',
        },
      ],
    },
    branding: {
      siteTitle: 'JULIAN KALE // CINEMATOGRAPHY',
      monogram: 'JK // CINE',
      logoUrl: '',
      logoHeight: 28,
      showTitleAlongsideLogo: true,
      faviconUrl: '',
    },
    navigation: {
      items: [
        { id: 'nav-1', label: 'Work', href: '#work', enabled: true, order: 1 },
        { id: 'nav-2', label: 'About', href: '#about', enabled: true, order: 2 },
        { id: 'nav-3', label: 'Services', href: '#services', enabled: true, order: 3 },
        { id: 'nav-4', label: 'Contact', href: '#contact', enabled: true, order: 4 },
      ],
      footerCopyright: '© 2026 Julian Kale. All rights reserved.',
      footerStatement: 'Cinematography, Direction of Photography & Color Grading.',
    },
    socials: [
      { id: 'soc-1', platform: 'vimeo', label: 'Vimeo', url: 'https://vimeo.com', enabled: true },
      { id: 'soc-2', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com', enabled: true },
      { id: 'soc-3', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
      { id: 'soc-4', platform: 'x', label: 'X (Twitter)', url: 'https://x.com', enabled: true },
      { id: 'soc-5', platform: 'imdb', label: 'IMDb', url: 'https://imdb.com', enabled: true },
      { id: 'soc-6', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
    ],
    appearance: {
      defaultTheme: 'dark',
      defaultLayout: 'cinematic',
      typographyStyle: 'sans',
      spacingDensity: 'comfortable',
      autoplayOnMute: false,
      showTechnicalSpecs: true,
      sections: [
        { id: 'sec-hero', key: 'hero', label: 'Hero Section', enabled: true, order: 1 },
        { id: 'sec-work', key: 'work', label: 'Work Portfolio Gallery', enabled: true, order: 2 },
        { id: 'sec-about', key: 'about', label: 'About Section', enabled: true, order: 3 },
        { id: 'sec-services', key: 'services', label: 'Services Section', enabled: true, order: 4 },
        { id: 'sec-contact', key: 'contact', label: 'Contact Information', enabled: true, order: 5 },
      ],
    },
    general: {
      siteName: 'Julian Kale — Cinematographer & Film Editor',
      siteDescription:
        'Portfolio of professional Director of Photography, Cinematographer, and Film Editor Julian Kale. Featuring narrative features, commercial films, high-concept fashion reels, and destination wedding cinema.',
      keywords:
        'cinematographer portfolio, director of photography, film editor, colorist, ARRI alexa, anamorphic, commercial cinema, wedding films, davinci resolve',
      adminEmail: 'admin@cinematography.com',
      adminPasswordHash: hash,
      salt: salt,
    },
    media: [
      {
        id: 'med-1',
        filename: 'showreel-poster.jpg',
        url: 'https://picsum.photos/seed/showreel-poster/1920/1080',
        type: 'image',
        size: 1420500,
        uploadedAt: '2026-01-01T12:00:00Z',
      },
      {
        id: 'med-2',
        filename: 'tundra-arctic.jpg',
        url: 'https://picsum.photos/seed/tundra-arctic-cine/1280/720',
        type: 'image',
        size: 1240000,
        uploadedAt: '2026-01-05T10:00:00Z',
      },
      {
        id: 'med-3',
        filename: 'monochrome-fashion.jpg',
        url: 'https://picsum.photos/seed/fashion-monochrome-noir/1280/720',
        type: 'image',
        size: 980000,
        uploadedAt: '2026-01-10T11:00:00Z',
      },
    ],
  };
}

// In-memory cache for fast read operations
let memoryDb: PortfolioDatabase | null = null;

// Ensure database file exists with safe serverless and remote sync fallback
export function getDb(): PortfolioDatabase {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {}
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as PortfolioDatabase;
      memoryDb = parsed;
      return parsed;
    }

    // Check /tmp fallback in serverless environments
    const tmpFile = path.join('/tmp', 'portfolio.json');
    if (fs.existsSync(tmpFile)) {
      const content = fs.readFileSync(tmpFile, 'utf-8');
      const parsed = JSON.parse(content) as PortfolioDatabase;
      memoryDb = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // If not found or error, initialize
  const initial = getInitialData();
  saveDb(initial);
  memoryDb = initial;
  return initial;
}

export function saveDb(data: PortfolioDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {}
    }

    // Atomic write to local file
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch {
      // In read-only serverless disk (Vercel lambda), write to /tmp
      const tmpFile = path.join('/tmp', 'portfolio.json');
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    }

    memoryDb = data;

    // Asynchronously sync to external persistent DB (Supabase / Vercel KV) if configured
    import('./storage')
      .then(({ syncSaveRemote }) => {
        syncSaveRemote(data).catch(() => {});
      })
      .catch(() => {});
  } catch (err) {
    console.error('Error saving database:', err);
    memoryDb = data;
  }
}

// CRUD helpers
export function getProjects(includeDrafts = false): Project[] {
  const db = getDb();
  if (includeDrafts) {
    return [...db.projects].sort((a, b) => a.order - b.order);
  }
  return db.projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const db = getDb();
  return db.projects.find((p) => p.slug === slug);
}

export function saveProject(project: Project): Project {
  const db = getDb();
  const index = db.projects.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    db.projects[index] = { ...project, updatedAt: now };
  } else {
    const newProject: Project = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      order: project.order ?? db.projects.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    db.projects.push(newProject);
  }

  saveDb(db);
  return index >= 0 ? db.projects[index] : db.projects[db.projects.length - 1];
}

export function deleteProject(id: string): boolean {
  const db = getDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

export function reorderProjects(orderedIds: string[]): Project[] {
  const db = getDb();
  const map = new Map(db.projects.map((p) => [p.id, p]));
  const reordered: Project[] = [];

  orderedIds.forEach((id, index) => {
    const p = map.get(id);
    if (p) {
      p.order = index + 1;
      reordered.push(p);
      map.delete(id);
    }
  });

  // Append any leftovers
  map.forEach((p) => {
    p.order = reordered.length + 1;
    reordered.push(p);
  });

  db.projects = reordered;
  saveDb(db);
  return db.projects;
}

// Section updates
export function updateHero(hero: HeroSection): HeroSection {
  const db = getDb();
  db.hero = { ...hero };
  saveDb(db);
  return db.hero;
}

export function updateAbout(about: AboutSection): AboutSection {
  const db = getDb();
  db.about = { ...about };
  saveDb(db);
  return db.about;
}

export function updateServices(services: ServiceItem[], workflow?: WorkflowStep[]): { services: ServiceItem[]; workflow: WorkflowStep[] } {
  const db = getDb();
  db.services = [...services];
  if (workflow) {
    db.workflow = [...workflow];
  }
  saveDb(db);
  return { services: db.services, workflow: db.workflow };
}

export function updateContactSettings(settings: Partial<ContactSettings>): ContactSettings {
  const db = getDb();
  db.contact = {
    ...db.contact,
    ...settings,
    inquiries: db.contact.inquiries, // preserve inquiries
  };
  saveDb(db);
  return db.contact;
}

export function addInquiry(inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Inquiry {
  const db = getDb();
  const newInq: Inquiry = {
    ...inquiry,
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  db.contact.inquiries.unshift(newInq);
  saveDb(db);
  return newInq;
}

export function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'archived'): boolean {
  const db = getDb();
  const inq = db.contact.inquiries.find((i) => i.id === id);
  if (inq) {
    inq.status = status;
    saveDb(db);
    return true;
  }
  return false;
}

export function deleteInquiry(id: string): boolean {
  const db = getDb();
  const initLen = db.contact.inquiries.length;
  db.contact.inquiries = db.contact.inquiries.filter((i) => i.id !== id);
  if (db.contact.inquiries.length !== initLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function updateBranding(branding: BrandingSettings): BrandingSettings {
  const db = getDb();
  db.branding = { ...branding };
  saveDb(db);
  return db.branding;
}

export function updateNavigation(navigation: NavigationSettings): NavigationSettings {
  const db = getDb();
  db.navigation = { ...navigation };
  saveDb(db);
  return db.navigation;
}

export function updateSocials(socials: SocialLink[]): SocialLink[] {
  const db = getDb();
  db.socials = [...socials];
  saveDb(db);
  return db.socials;
}

export function updateAppearance(appearance: AppearanceSettings): AppearanceSettings {
  const db = getDb();
  db.appearance = { ...appearance };
  saveDb(db);
  return db.appearance;
}

export function updateCategories(categories: Category[]): Category[] {
  const db = getDb();
  db.categories = [...categories];
  saveDb(db);
  return db.categories;
}

export function updateGeneralSettings(general: Partial<GeneralSettings>): GeneralSettings {
  const db = getDb();
  db.general = { ...db.general, ...general };
  saveDb(db);
  return db.general;
}

export function addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
  const db = getDb();
  const newItem: MediaItem = {
    ...item,
    id: `med-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };
  db.media.unshift(newItem);
  saveDb(db);
  return newItem;
}

export function deleteMediaItem(id: string): boolean {
  const db = getDb();
  const initial = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== initial) {
    saveDb(db);
    return true;
  }
  return false;
}

export function resetToDefaults(): PortfolioDatabase {
  const initial = getInitialData();
  saveDb(initial);
  return initial;
}
