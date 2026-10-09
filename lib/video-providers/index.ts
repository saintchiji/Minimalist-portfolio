import { VideoSource } from '../types';

export interface VideoValidationResult {
  valid: boolean;
  source: VideoSource;
  providerName: string;
  videoId?: string;
  embedUrl: string;
  originalUrl: string;
  isEmbedSupported: boolean;
  warning?: string;
  suggestedThumbnail?: string;
  instructions?: string;
}

export interface VideoProvider {
  id: VideoSource;
  name: string;
  order: number;
  description: string;
  matches: (url: string) => boolean;
  extractId: (url: string) => string | null;
  getEmbedUrl: (id: string, originalUrl: string) => string;
  validate: (url: string) => VideoValidationResult;
}

// 1. Direct Upload Provider
export const DirectUploadProvider: VideoProvider = {
  id: 'direct',
  name: 'Direct Upload',
  order: 1,
  description: 'Hosted video files (.mp4, .webm, .mov, .m3u8 adaptive stream) stored locally or on cloud storage',
  matches: (url: string) => {
    const clean = url.trim().toLowerCase();
    return (
      clean.startsWith('/uploads/') ||
      clean.startsWith('/api/media/') ||
      /\.(mp4|webm|mov|m4v|ogg|m3u8)(\?.*)?$/i.test(clean)
    );
  },
  extractId: (url: string) => {
    const clean = url.trim();
    const parts = clean.split('/');
    return parts[parts.length - 1] || 'direct-video';
  },
  getEmbedUrl: (_id: string, originalUrl: string) => originalUrl.trim(),
  validate: (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      return {
        valid: false,
        source: 'direct',
        providerName: 'Direct Upload',
        embedUrl: '',
        originalUrl: '',
        isEmbedSupported: true,
        warning: 'Video URL or file path is required.',
      };
    }

    const isDirect = DirectUploadProvider.matches(trimmed);
    return {
      valid: true,
      source: 'direct',
      providerName: 'Direct Upload',
      videoId: DirectUploadProvider.extractId(trimmed) || undefined,
      embedUrl: trimmed,
      originalUrl: trimmed,
      isEmbedSupported: true,
      warning: isDirect
        ? undefined
        : 'URL does not end in standard video extension (.mp4, .webm, .m3u8), but will attempt HTML5 playback.',
      instructions: 'Supported formats: H.264/AAC MP4, WebM, ProRes MOV, or HLS .m3u8 adaptive streams.',
    };
  },
};

// 2. Google Drive Provider
export const GoogleDriveProvider: VideoProvider = {
  id: 'drive',
  name: 'Google Drive',
  order: 2,
  description: 'Google Drive video files shared via preview link with in-site embedded player',
  matches: (url: string) => {
    const clean = url.trim().toLowerCase();
    return clean.includes('drive.google.com') || clean.includes('docs.google.com');
  },
  extractId: (url: string) => {
    const clean = url.trim();
    const m1 = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m1 && m1[1]) return m1[1];
    const m2 = clean.match(/id=([a-zA-Z0-9_-]+)/);
    if (m2 && m2[1]) return m2[1];
    const m3 = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m3 && m3[1]) return m3[1];
    return null;
  },
  getEmbedUrl: (id: string) => {
    return `https://drive.google.com/file/d/${id}/preview`;
  },
  validate: (url: string) => {
    const trimmed = url.trim();
    const id = GoogleDriveProvider.extractId(trimmed);

    if (!id) {
      return {
        valid: false,
        source: 'drive',
        providerName: 'Google Drive',
        embedUrl: '',
        originalUrl: trimmed,
        isEmbedSupported: true,
        warning: 'Could not extract valid Google Drive file ID from link.',
        instructions: 'Paste a standard Google Drive share link like: https://drive.google.com/file/d/YOUR_FILE_ID/view',
      };
    }

    const embedUrl = GoogleDriveProvider.getEmbedUrl(id, trimmed);
    return {
      valid: true,
      source: 'drive',
      providerName: 'Google Drive',
      videoId: id,
      embedUrl,
      originalUrl: trimmed,
      isEmbedSupported: true,
      warning: 'Ensure Drive sharing settings are set to "Anyone with the link can view".',
      suggestedThumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1280`,
      instructions: 'Permissions requirement: The file must have General access set to "Anyone with the link" as Viewer.',
    };
  },
};

// 3. YouTube Provider
export const YouTubeProvider: VideoProvider = {
  id: 'youtube',
  name: 'YouTube',
  order: 3,
  description: 'YouTube videos, Shorts, and unlisted cinematographic showcases',
  matches: (url: string) => {
    const clean = url.trim().toLowerCase();
    return clean.includes('youtube.com') || clean.includes('youtu.be');
  },
  extractId: (url: string) => {
    const clean = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = clean.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    return null;
  },
  getEmbedUrl: (id: string) => {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  },
  validate: (url: string) => {
    const trimmed = url.trim();
    const id = YouTubeProvider.extractId(trimmed);

    if (!id) {
      return {
        valid: false,
        source: 'youtube',
        providerName: 'YouTube',
        embedUrl: '',
        originalUrl: trimmed,
        isEmbedSupported: true,
        warning: 'Invalid YouTube URL or video ID not found.',
        instructions: 'Supports standard videos (watch?v=...), short links (youtu.be/...), and Shorts (shorts/...).',
      };
    }

    const embedUrl = YouTubeProvider.getEmbedUrl(id, trimmed);
    return {
      valid: true,
      source: 'youtube',
      providerName: 'YouTube',
      videoId: id,
      embedUrl,
      originalUrl: trimmed,
      isEmbedSupported: true,
      suggestedThumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      instructions: 'Embed uses privacy-enhanced mode (youtube-nocookie.com) with branding minimized.',
    };
  },
};

// 4. Facebook and Instagram Provider
export const FacebookInstagramProvider: VideoProvider = {
  id: 'instagram',
  name: 'Facebook & Instagram',
  order: 4,
  description: 'Meta platforms official embedding for Instagram Reels, Posts, and Facebook Videos',
  matches: (url: string) => {
    const clean = url.trim().toLowerCase();
    return clean.includes('instagram.com') || clean.includes('facebook.com') || clean.includes('fb.watch');
  },
  extractId: (url: string) => {
    const clean = url.trim();
    if (clean.includes('instagram.com')) {
      const match = clean.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
      return match && match[1] ? match[1] : null;
    }
    return 'meta-video';
  },
  getEmbedUrl: (id: string, originalUrl: string) => {
    if (originalUrl.includes('instagram.com') && id && id !== 'meta-video') {
      return `https://www.instagram.com/p/${id}/embed`;
    }
    // Facebook
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      originalUrl
    )}&show_text=0&autoplay=1`;
  },
  validate: (url: string) => {
    const trimmed = url.trim();
    const isInstagram = trimmed.includes('instagram.com');
    const isFacebook = trimmed.includes('facebook.com') || trimmed.includes('fb.watch');

    if (!isInstagram && !isFacebook) {
      return {
        valid: false,
        source: 'instagram',
        providerName: 'Facebook & Instagram',
        embedUrl: '',
        originalUrl: trimmed,
        isEmbedSupported: true,
        warning: 'Must be an instagram.com or facebook.com URL.',
      };
    }

    if (isInstagram) {
      const id = FacebookInstagramProvider.extractId(trimmed);
      if (!id || id === 'meta-video') {
        return {
          valid: false,
          source: 'instagram',
          providerName: 'Instagram',
          embedUrl: '',
          originalUrl: trimmed,
          isEmbedSupported: true,
          warning: 'Could not extract Instagram post/reel code.',
          instructions: 'Use post link format: https://www.instagram.com/p/CODE/ or https://www.instagram.com/reel/CODE/',
        };
      }
      return {
        valid: true,
        source: 'instagram',
        providerName: 'Instagram Reel/Post',
        videoId: id,
        embedUrl: FacebookInstagramProvider.getEmbedUrl(id, trimmed),
        originalUrl: trimmed,
        isEmbedSupported: true,
        warning: 'The Instagram account and post must be public for embed playback to load.',
        instructions: 'Official Instagram iframe embed will render on the website.',
      };
    }

    // Facebook
    return {
      valid: true,
      source: 'instagram',
      providerName: 'Facebook Video',
      videoId: 'fb-video',
      embedUrl: FacebookInstagramProvider.getEmbedUrl('meta-video', trimmed),
      originalUrl: trimmed,
      isEmbedSupported: true,
      warning: 'The Facebook video must be set to Public by the page/author to allow embed.',
      instructions: 'Official Facebook video player plugin will embed directly on the site.',
    };
  },
};

// 5. X (Twitter) Provider
export const XTwitterProvider: VideoProvider = {
  id: 'x',
  name: 'X (Twitter)',
  order: 5,
  description: 'X platform video posts embedded via official player widget',
  matches: (url: string) => {
    const clean = url.trim().toLowerCase();
    return clean.includes('x.com') || clean.includes('twitter.com');
  },
  extractId: (url: string) => {
    const clean = url.trim();
    const match = clean.match(/(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/);
    return match && match[3] ? match[3] : null;
  },
  getEmbedUrl: (id: string) => {
    return `https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=dark`;
  },
  validate: (url: string) => {
    const trimmed = url.trim();
    const id = XTwitterProvider.extractId(trimmed);

    if (!id) {
      return {
        valid: false,
        source: 'x',
        providerName: 'X (Twitter)',
        embedUrl: '',
        originalUrl: trimmed,
        isEmbedSupported: true,
        warning: 'Could not extract Tweet ID from X/Twitter URL.',
        instructions: 'Format: https://x.com/username/status/1234567890',
      };
    }

    return {
      valid: true,
      source: 'x',
      providerName: 'X (Twitter)',
      videoId: id,
      embedUrl: XTwitterProvider.getEmbedUrl(id, trimmed),
      originalUrl: trimmed,
      isEmbedSupported: true,
      instructions: 'Official X dark-mode embedded card will render video directly in-site.',
    };
  },
};

// 6. Other Sources Provider (Vimeo, Cloudinary, AWS S3, Custom CDN, Wistia, Streamable)
export const OtherSourcesProvider: VideoProvider = {
  id: 'other',
  name: 'Other Sources',
  order: 6,
  description: 'Vimeo, Wistia, Streamable, Cloudinary, AWS S3, and custom streaming services',
  matches: (_url: string) => true, // Fallback catch-all
  extractId: (url: string) => {
    const clean = url.trim();
    if (clean.includes('vimeo.com')) {
      const match = clean.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
      if (match && match[1]) return match[1];
    }
    if (clean.includes('streamable.com')) {
      const match = clean.match(/streamable\.com\/([a-zA-Z0-9]+)/);
      if (match && match[1]) return match[1];
    }
    if (clean.includes('wistia.com')) {
      const match = clean.match(/wistia\.(?:com|net)\/(?:medias|embed)\/([a-zA-Z0-9]+)/);
      if (match && match[1]) return match[1];
    }
    return null;
  },
  getEmbedUrl: (id: string, originalUrl: string) => {
    const clean = originalUrl.trim();
    if (clean.includes('vimeo.com') && id) {
      return `https://player.vimeo.com/video/${id}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
    }
    if (clean.includes('streamable.com') && id) {
      return `https://streamable.com/e/${id}`;
    }
    if (clean.includes('wistia.com') && id) {
      return `https://fast.wistia.net/embed/iframe/${id}`;
    }
    return clean;
  },
  validate: (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      return {
        valid: false,
        source: 'other',
        providerName: 'Other Sources',
        embedUrl: '',
        originalUrl: '',
        isEmbedSupported: false,
        warning: 'URL is required.',
      };
    }

    if (trimmed.includes('vimeo.com')) {
      const id = OtherSourcesProvider.extractId(trimmed);
      if (id) {
        return {
          valid: true,
          source: 'other',
          providerName: 'Vimeo Cinema Player',
          videoId: id,
          embedUrl: OtherSourcesProvider.getEmbedUrl(id, trimmed),
          originalUrl: trimmed,
          isEmbedSupported: true,
          instructions: 'Full in-site Vimeo HD/4K playback supported with monochrome controls.',
        };
      }
    }

    if (trimmed.includes('streamable.com')) {
      const id = OtherSourcesProvider.extractId(trimmed);
      if (id) {
        return {
          valid: true,
          source: 'other',
          providerName: 'Streamable',
          videoId: id,
          embedUrl: OtherSourcesProvider.getEmbedUrl(id, trimmed),
          originalUrl: trimmed,
          isEmbedSupported: true,
        };
      }
    }

    if (trimmed.includes('wistia.com')) {
      const id = OtherSourcesProvider.extractId(trimmed);
      if (id) {
        return {
          valid: true,
          source: 'other',
          providerName: 'Wistia',
          videoId: id,
          embedUrl: OtherSourcesProvider.getEmbedUrl(id, trimmed),
          originalUrl: trimmed,
          isEmbedSupported: true,
        };
      }
    }

    // Direct streaming or generic URL
    const isDirectVideo = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(trimmed);
    return {
      valid: true,
      source: 'other',
      providerName: isDirectVideo ? 'Direct CDN Stream' : 'External Web Stream',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isEmbedSupported: true,
      warning: isDirectVideo
        ? undefined
        : 'Ensure this provider allows third-party iframe embedding without strict X-Frame-Options blocking.',
    };
  },
};

// Unified Registry in Exact Priority Order 1 to 6
export const VIDEO_PROVIDERS_IN_ORDER: VideoProvider[] = [
  DirectUploadProvider,       // 1. Direct Upload
  GoogleDriveProvider,        // 2. Google Drive
  YouTubeProvider,            // 3. YouTube
  FacebookInstagramProvider,  // 4. Facebook and Instagram
  XTwitterProvider,           // 5. X (Twitter)
  OtherSourcesProvider,       // 6. Other Sources
];

export function getProviderBySource(source: VideoSource): VideoProvider {
  switch (source) {
    case 'direct':
      return DirectUploadProvider;
    case 'drive':
      return GoogleDriveProvider;
    case 'youtube':
      return YouTubeProvider;
    case 'instagram':
      return FacebookInstagramProvider;
    case 'x':
      return XTwitterProvider;
    case 'other':
    default:
      return OtherSourcesProvider;
  }
}

export function autoDetectProvider(url: string): VideoProvider {
  const clean = (url || '').trim();
  if (DirectUploadProvider.matches(clean)) return DirectUploadProvider;
  if (GoogleDriveProvider.matches(clean)) return GoogleDriveProvider;
  if (YouTubeProvider.matches(clean)) return YouTubeProvider;
  if (FacebookInstagramProvider.matches(clean)) return FacebookInstagramProvider;
  if (XTwitterProvider.matches(clean)) return XTwitterProvider;
  return OtherSourcesProvider;
}

export function validateVideo(url: string, explicitSource?: VideoSource): VideoValidationResult {
  const provider = explicitSource ? getProviderBySource(explicitSource) : autoDetectProvider(url);
  return provider.validate(url);
}
