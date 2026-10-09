'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HeroSection } from '@/lib/types';
import { VideoPlayer } from '../video-player';
import { Play, ArrowDown, X, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  hero: HeroSection;
}

export function Hero({ hero }: HeroProps) {
  const [showreelOpen, setShowreelOpen] = useState(false);

  // Visibility toggle check
  if (hero.visible === false) {
    return null;
  }

  const alignment = hero.alignment || 'left';
  const alignClasses =
    alignment === 'center'
      ? 'text-center items-center mx-auto'
      : alignment === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start';

  const gridAlignClasses =
    alignment === 'center'
      ? 'justify-center text-center'
      : alignment === 'right'
      ? 'justify-end text-right'
      : 'justify-start text-left';

  const buttonGroupAlign =
    alignment === 'center'
      ? 'justify-center sm:justify-center'
      : alignment === 'right'
      ? 'justify-end sm:justify-end'
      : 'justify-start sm:justify-start';

  const handlePrimaryClick = () => {
    if (!hero.ctaPrimaryLink || hero.ctaPrimaryLink === '#showreel' || hero.ctaPrimaryLink === '#') {
      setShowreelOpen(true);
    } else if (hero.ctaPrimaryLink.startsWith('#')) {
      const el = document.querySelector(hero.ctaPrimaryLink);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(hero.ctaPrimaryLink, '_blank', 'noopener,noreferrer');
    }
  };

  const isPrimaryVisible = hero.ctaPrimaryVisible !== false;
  const isSecondaryVisible = hero.ctaSecondaryVisible !== false;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* Background Media Layer */}
      {hero.backgroundMedia && hero.backgroundMedia.type !== 'none' && hero.backgroundMedia.url && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {hero.backgroundMedia.type === 'video' ? (
            <video
              src={hero.backgroundMedia.url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter grayscale contrast-125"
              style={{ opacity: hero.backgroundMedia.opacity ?? 0.15 }}
            />
          ) : (
            <Image
              src={hero.backgroundMedia.url}
              alt="Hero Background"
              fill
              className="object-cover filter grayscale contrast-125"
              style={{ opacity: hero.backgroundMedia.opacity ?? 0.15 }}
              priority
              referrerPolicy="no-referrer"
            />
          )}
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black opacity-80" />
        </div>
      )}

      <div className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col ${alignClasses}`}>
        {/* Professional Title & Subtitle Badge */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {hero.professionalTitle && (
            <span className="inline-block text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] font-semibold bg-black text-white dark:bg-white dark:text-black px-2.5 py-1">
              {hero.professionalTitle}
            </span>
          )}
          {hero.subtitle && (
            <span className="inline-block text-[11px] md:text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 border-b border-neutral-300 dark:border-neutral-800 pb-0.5">
              {hero.subtitle}
            </span>
          )}
        </div>

        {/* Main Monolithic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-black dark:text-white leading-[0.9] mb-8">
          {hero.headline || 'JULIAN KALE'}
        </h1>

        {/* Hero description & buttons */}
        <div className={`w-full max-w-4xl space-y-8 mb-14 ${alignment === 'center' ? 'mx-auto' : ''}`}>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {hero.statement ||
              'Crafting light, shadow, and kinetic rhythm. Specializing in high-contrast cinematic narratives, commercial precision, and documentary storytelling.'}
          </p>

          {(isPrimaryVisible || isSecondaryVisible) && (
            <div className={`flex flex-col sm:flex-row gap-3.5 ${buttonGroupAlign}`}>
              {isPrimaryVisible && (
                <button
                  onClick={handlePrimaryClick}
                  type="button"
                  className="inline-flex items-center justify-center space-x-3 bg-black dark:bg-white text-white dark:text-black px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{hero.ctaPrimaryText || 'Watch Showreel'}</span>
                </button>
              )}

              {isSecondaryVisible && (
                <a
                  href={hero.ctaSecondaryLink || '#contact'}
                  className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <span>{hero.ctaSecondaryText || 'Inquire Availability'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Cinematic Stats Matrix */}
        {hero.stats && hero.stats.length > 0 && (
          <div className={`w-full pt-8 border-t border-neutral-200 dark:border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-6 ${gridAlignClasses}`}>
            {hero.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-6 left-6 md:left-12 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-neutral-400">
        <ArrowDown className="w-3 h-3 animate-bounce" />
        <span>Scroll to Explore</span>
      </div>

      {/* Showreel Fullscreen Video Modal */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-black border border-neutral-800">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between text-white">
              <span className="text-xs uppercase tracking-widest font-mono">
                {hero.headline} · Official Showreel
              </span>
              <button
                onClick={() => setShowreelOpen(false)}
                type="button"
                className="p-1 hover:text-neutral-400 transition-colors cursor-pointer text-white"
                aria-label="Close Showreel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="p-2 sm:p-4">
              <VideoPlayer
                url={hero.showreelVideoUrl}
                source={hero.showreelSource}
                poster={hero.showreelPoster}
                title={`${hero.headline} Showreel`}
                aspectRatio="16:9"
                autoPlay={true}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
