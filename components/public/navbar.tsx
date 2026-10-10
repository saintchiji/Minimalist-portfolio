'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrandingSettings, NavItem } from '@/lib/types';
import { ThemeToggle } from '../theme-toggle';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  branding: BrandingSettings;
  navItems: NavItem[];
}

export function Navbar({ branding, navItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeNavItems = (navItems || [])
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md border-neutral-200 dark:border-neutral-900 py-3.5 shadow-xs'
          : 'bg-white dark:bg-black border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 text-black dark:text-white group focus:outline-hidden"
        >
          {branding.logoUrl ? (
            <div className="relative" style={{ height: `${branding.logoHeight || 28}px` }}>
              <Image
                src={branding.logoUrl}
                alt={branding.siteTitle || 'Cinematographer'}
                width={120}
                height={branding.logoHeight || 28}
                className="h-full w-auto object-contain dark:invert"
                priority
              />
            </div>
          ) : (
            <span className="font-mono text-xs tracking-widest uppercase font-bold border border-black dark:border-white px-2 py-0.5">
              {branding.monogram || 'C // K'}
            </span>
          )}

          {(!branding.logoUrl || branding.showTitleAlongsideLogo) && (
            <span className="text-xs tracking-[0.25em] uppercase font-semibold text-black dark:text-white hidden sm:inline-block">
              {branding.siteTitle || 'JULIAN KALE'}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {activeNavItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Controls: Theme toggle */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-900 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-4">
            {activeNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm tracking-[0.2em] uppercase font-medium text-black dark:text-white hover:text-neutral-500 transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
