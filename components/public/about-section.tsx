'use client';

import React from 'react';
import Image from 'next/image';
import { AboutSection as AboutType } from '@/lib/types';
import { Award as AwardIcon, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  about: AboutType;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white border-b border-neutral-200 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block mb-2">
            The Filmmaker // Philosophy & Biography
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            About {about.fullName || 'Julian Kale'}
          </h2>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full border border-neutral-200 dark:border-neutral-800 bg-neutral-900 overflow-hidden">
              <Image
                src={about.portraitUrl || 'https://picsum.photos/seed/dp-portrait/900/1200'}
                alt={about.fullName || 'Cinematographer'}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover filter grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-xs uppercase tracking-widest font-mono">{about.title}</p>
                <p className="text-[11px] text-neutral-400 font-mono">{about.location}</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bio Paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              {about.bio && about.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Philosophy quote */}
            {about.philosophy && (
              <blockquote className="border-l-2 border-black dark:border-white pl-6 py-2 my-6 italic text-lg sm:text-xl text-black dark:text-white font-serif">
                {about.philosophy}
              </blockquote>
            )}

            {/* Awards & Recognition */}
            {about.awards && about.awards.length > 0 && (
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 flex items-center space-x-2">
                  <AwardIcon className="w-4 h-4" />
                  <span>Festival Selections & Honors</span>
                </h3>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-900 border-y border-neutral-200 dark:border-neutral-900">
                  {about.awards.map((award) => (
                    <div key={award.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div className="space-y-0.5">
                        <span className="font-bold uppercase tracking-wider text-black dark:text-white">
                          {award.title}
                        </span>
                        <p className="text-neutral-500 font-mono">{award.festival} — “{award.work}”</p>
                      </div>
                      <span className="font-mono text-neutral-400">{award.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Arsenal & Gear */}
        {about.gearCategories && about.gearCategories.length > 0 && (
          <div className="pt-12 border-t border-neutral-200 dark:border-neutral-900 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block mb-2">
                Technical Specifications & Equipment
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Camera Systems & Optical Arsenal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.gearCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-5 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3"
                >
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    {cat.category}
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
