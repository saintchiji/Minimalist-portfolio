'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, Category } from '@/lib/types';
import { ProjectModal } from './project-modal';
import { Play, Film, Clock, Lock } from 'lucide-react';

interface PortfolioSectionProps {
  projects: Project[];
  categories: Category[];
}

export function PortfolioSection({ projects, categories }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter(
          (p) =>
            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
            p.categoryLabel.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white border-b border-neutral-200 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div id="portfolio" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-900 scroll-mt-24">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block">
                Selected Works // 2024 — 2026
              </span>
              <Link
                href="/admin"
                className="opacity-40 hover:opacity-100 p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-opacity inline-flex items-center space-x-1"
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Cinematography & Films
            </h2>
          </div>

          {/* Category Filter Pills / Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              type="button"
              className={`text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold'
                  : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white'
              }`}
            >
              All Works ({projects.length})
            </button>
            {categories.map((cat) => {
              const count = projects.filter(
                (p) =>
                  p.category.toLowerCase() === cat.slug.toLowerCase() ||
                  p.category.toLowerCase() === cat.id.toLowerCase()
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  type="button"
                  className={`text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all cursor-pointer border ${
                    selectedCategory === cat.slug
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold'
                      : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-800 p-8">
            <p className="text-sm font-mono uppercase tracking-widest text-neutral-500">
              No films currently in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 hover:border-black dark:hover:border-white transition-all duration-300 flex flex-col"
              >
                {/* Poster / Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={project.thumbnailUrl || 'https://picsum.photos/seed/cine-thumb/1280/720'}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark subtle overlay with play icon on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-white bg-black/70 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-mono bg-black/85 text-white px-2 py-0.5 border border-white/20">
                      {project.categoryLabel || project.category}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-mono bg-black/85 text-neutral-300 px-1.5 py-0.5 border border-white/10">
                      Source: {project.videoSource}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    {project.aspectRatio && (
                      <span className="text-[10px] font-mono uppercase bg-black/80 text-white px-2 py-0.5 border border-white/20">
                        {project.aspectRatio}
                      </span>
                    )}
                    {project.duration && (
                      <span className="text-[10px] font-mono uppercase bg-black/80 text-white px-2 py-0.5 border border-white/20 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{project.duration}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Info Block */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      <span>{project.genre}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black dark:text-white group-hover:underline underline-offset-4">
                      {project.title}
                    </h3>
                    {project.client && (
                      <p className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                        Client: {project.client}
                      </p>
                    )}
                    {project.synopsis && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light line-clamp-2 leading-relaxed pt-1">
                        {project.synopsis}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-900 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400">
                      Role: {project.role}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest font-semibold flex items-center space-x-1 text-black dark:text-white group-hover:translate-x-1 transition-transform">
                      <span>View Film</span>
                      <Film className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal Detail View */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
