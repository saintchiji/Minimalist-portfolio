'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { parseVideoUrl } from '@/lib/video-utils';
import { VideoSource } from '@/lib/types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  source?: VideoSource;
  poster?: string;
  title?: string;
  aspectRatio?: string; // e.g. "2.39:1", "16:9", "9:16", "4:3", "2.00:1"
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  url,
  source,
  poster,
  title = 'Cinematography Film',
  aspectRatio = '16:9',
  autoPlay = false,
  className = '',
}: VideoPlayerProps) {
  // Thumbnail-first lazy loading: only mount the player once user activates or autoPlay is true
  const [isPlayerMounted, setIsPlayerMounted] = useState(autoPlay);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const videoInfo = parseVideoUrl(url, source);

  // Aspect ratio class mapper
  const getAspectRatioClass = (ratio: string) => {
    const clean = (ratio || '').toLowerCase();
    if (clean.includes('9:16') || clean.includes('vertical')) {
      return 'aspect-[9/16] max-w-sm mx-auto';
    }
    if (clean.includes('2.39:1') || clean.includes('anamorphic')) {
      return 'aspect-[2.39/1]';
    }
    if (clean.includes('4:3')) {
      return 'aspect-[4/3]';
    }
    if (clean.includes('2:1') || clean.includes('2.00:1') || clean.includes('univisium')) {
      return 'aspect-[2/1]';
    }
    return 'aspect-video'; // 16:9 default
  };

  const handleStartPlayback = () => {
    setIsPlayerMounted(true);
    setIsPlaying(true);
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!url) {
    return (
      <div
        className={`w-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center p-8 text-xs font-mono uppercase tracking-widest ${getAspectRatioClass(
          aspectRatio
        )} ${className}`}
      >
        No video stream configured for this project
      </div>
    );
  }

  // 1. THUMBNAIL-FIRST LAZY LOAD STATE:
  // Render high-res thumbnail with play overlay before iframe or video element is initialized
  if (!isPlayerMounted && !autoPlay) {
    return (
      <div
        onClick={handleStartPlayback}
        className={`relative group bg-neutral-950 overflow-hidden border border-neutral-200 dark:border-neutral-900 cursor-pointer ${getAspectRatioClass(
          aspectRatio
        )} ${className}`}
      >
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover filter grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-xs font-mono uppercase text-neutral-500 tracking-widest">
              {title}
            </span>
          </div>
        )}

        {/* Ambient Dark Overlay with Play Trigger */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/80 bg-black/70 flex items-center justify-center text-white backdrop-blur-xs group-hover:scale-110 transition-transform shadow-2xl">
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
          </div>
        </div>

        {/* Top Source Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-black/85 text-white px-2.5 py-1 border border-white/20">
            {videoInfo.sourceLabel}
          </span>
        </div>

        {/* Bottom Title Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs font-mono">
          <span className="truncate max-w-[70%] font-semibold uppercase tracking-wider">{title}</span>
          <span className="text-[11px] text-neutral-300 uppercase tracking-widest">Click to Play</span>
        </div>
      </div>
    );
  }

  // 2. DIRECT UPLOAD / STREAMING HOSTED PLAYER:
  if (videoInfo.embedType === 'direct') {
    return (
      <div
        ref={containerRef}
        className={`relative group bg-black overflow-hidden border border-neutral-200 dark:border-neutral-900 ${getAspectRatioClass(
          aspectRatio
        )} ${className}`}
      >
        <video
          ref={videoRef}
          src={videoInfo.embedUrl}
          poster={poster}
          playsInline
          autoPlay
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />

        {/* Custom Minimalist Monochrome Player Controls */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2 text-white text-xs font-mono">
          {/* Progress Scrubber */}
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-neutral-700 accent-white cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayToggle}
                type="button"
                className="p-1 hover:text-neutral-300 transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={handleMuteToggle}
                type="button"
                className="p-1 hover:text-neutral-300 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[10px] tracking-wider text-neutral-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <span className="text-[10px] tracking-widest uppercase text-neutral-400 border border-neutral-700 px-1.5 py-0.2 hidden sm:inline-block">
                Direct Stream
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleFullscreen}
                type="button"
                className="p-1 hover:text-neutral-300 transition-colors cursor-pointer"
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {hasError && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center text-white">
            <AlertCircle className="w-8 h-8 mb-2 text-neutral-400" />
            <p className="text-sm font-bold uppercase tracking-wider mb-1">Direct video stream unavailable</p>
            <p className="text-xs text-neutral-400 mb-4 max-w-sm font-mono">
              The direct video file could not be decoded. Ensure the file has public read access and standard H.264/AAC encoding.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-mono border border-white px-3 py-1.5 uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              Open raw file <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // 3. EMBEDDED IFRAME PLAYER (YouTube, Google Drive, Vimeo, Meta, X):
  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden border border-neutral-200 dark:border-neutral-900 ${getAspectRatioClass(
        aspectRatio
      )} ${className}`}
    >
      <iframe
        src={videoInfo.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 absolute inset-0"
        loading="lazy"
      />

      {/* Provider badge overlay */}
      <div className="absolute top-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase font-mono tracking-widest bg-black/80 text-white px-2 py-0.5 border border-white/20">
          {videoInfo.sourceLabel}
        </span>
      </div>
    </div>
  );
}
