'use client';

import React from 'react';
import Link from 'next/link';
import { SocialLink, NavItem } from '@/lib/types';
import { ArrowUp, Mail, Phone, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  branding: {
    siteTitle: string;
    monogram: string;
  };
  navigation: {
    footerCopyright: string;
    footerStatement: string;
    items?: NavItem[];
  };
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  socials: SocialLink[];
}

export function Footer({ branding, navigation, contact, socials }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = (navigation.items || []).filter((i) => i.enabled);

  return (
    <footer className="py-16 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white border-t border-neutral-200 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main 3-column / split footer block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-neutral-200 dark:border-neutral-900">
          {/* Col 1: Branding & Philosophy */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold border border-black dark:border-white px-2 py-0.5 tracking-widest uppercase">
                {branding.monogram || 'C // K'}
              </span>
              <span className="text-xs tracking-[0.2em] uppercase font-semibold">
                {branding.siteTitle || 'JULIAN KALE'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono leading-relaxed max-w-sm">
              {navigation.footerStatement || 'Cinematography, Direction of Photography & Color Grading.'}
            </p>
          </div>

          {/* Col 2: Relevant Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
              Navigation
            </span>
            <ul className="space-y-1.5 text-xs font-mono uppercase">
              {navItems.length > 0 ? (
                navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#work" className="text-neutral-500 hover:text-black dark:hover:text-white">Work</a></li>
                  <li><a href="#about" className="text-neutral-500 hover:text-black dark:hover:text-white">About</a></li>
                  <li><a href="#services" className="text-neutral-500 hover:text-black dark:hover:text-white">Services</a></li>
                  <li><a href="#contact" className="text-neutral-500 hover:text-black dark:hover:text-white">Contact</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Configured Contact Information & Socials */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
              Contact & Inquiries
            </span>
            <div className="space-y-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {contact?.email && (
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-black dark:hover:text-white underline-offset-2 hover:underline">
                    {contact.email}
                  </a>
                </p>
              )}
              {contact?.phone && (
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{contact.phone}</span>
                </p>
              )}
              {contact?.location && (
                <p className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{contact.location}</span>
                </p>
              )}
            </div>

            {/* Social channels */}
            {socials && socials.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono uppercase">
                {socials
                  .filter((s) => s.enabled)
                  .map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>{navigation.footerCopyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>

          <div className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </Link>

            <button
              onClick={scrollToTop}
              type="button"
              className="flex items-center space-x-1.5 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
