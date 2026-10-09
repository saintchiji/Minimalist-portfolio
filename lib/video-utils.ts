import { VideoSource } from './types';
import {
  validateVideo,
  autoDetectProvider,
  getProviderBySource,
  VIDEO_PROVIDERS_IN_ORDER,
  VideoValidationResult,
} from './video-providers';

export interface VideoInfo {
  source: VideoSource;
  embedType: 'direct' | 'iframe' | 'external';
  embedUrl: string;
  originalUrl: string;
  sourceLabel: string;
  isPlayableDirectly: boolean;
  warning?: string;
  suggestedThumbnail?: string;
}

export function detectVideoSource(url: string, explicitSource?: VideoSource): VideoSource {
  if (explicitSource && explicitSource !== 'other') {
    return explicitSource;
  }
  const provider = autoDetectProvider(url);
  return provider.id;
}

export function parseVideoUrl(url: string, sourceOverride?: VideoSource): VideoInfo {
  const trimmed = (url || '').trim();
  const validation: VideoValidationResult = validateVideo(trimmed, sourceOverride);

  // If source is direct upload or direct video file
  if (validation.source === 'direct' || /\.(mp4|webm|mov|m4v|ogg|m3u8)(\?.*)?$/i.test(trimmed)) {
    return {
      source: 'direct',
      embedType: 'direct',
      embedUrl: validation.embedUrl,
      originalUrl: trimmed,
      sourceLabel: 'Direct Video',
      isPlayableDirectly: true,
      warning: validation.warning,
      suggestedThumbnail: validation.suggestedThumbnail,
    };
  }

  // All other supported providers embed via responsive iframe
  return {
    source: validation.source,
    embedType: 'iframe',
    embedUrl: validation.embedUrl,
    originalUrl: trimmed,
    sourceLabel: validation.providerName,
    isPlayableDirectly: validation.isEmbedSupported,
    warning: validation.warning,
    suggestedThumbnail: validation.suggestedThumbnail,
  };
}

export { validateVideo, VIDEO_PROVIDERS_IN_ORDER };
