import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getDb } from '@/lib/db';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';
import { VideoPlayer } from '@/components/video-player';
import { FilmReelDistribution } from '@/components/public/film-reel-distribution';
import { ArrowLeft, Calendar, Clock, Film, Camera, User, Tag, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found // Portfolio',
    };
  }

  return {
    title: `${project.title} // ${project.categoryLabel || 'Cinematography'}`,
    description: project.synopsis || `Cinematography and editing by Julian Kale for ${project.client || project.title}.`,
    openGraph: {
      title: `${project.title} // Cinematography`,
      description: project.synopsis || `Cinematography and editing by Julian Kale.`,
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.status !== 'published') {
    notFound();
  }

  const db = getDb();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar branding={db.branding} navItems={db.navigation.items} />

      <main className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Navigation back */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-900">
          <Link
            href="/#work"
            className="inline-flex items-center space-x-2 text-xs uppercase font-mono tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio Gallery</span>
          </Link>

          <span className="text-xs font-mono uppercase tracking-widest border border-neutral-300 dark:border-neutral-800 px-3 py-1 text-neutral-500">
            Source: {project.videoSource}
          </span>
        </div>

        {/* Project Header */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <span className="border border-black dark:border-white px-2 py-0.5 font-semibold text-black dark:text-white">
              {project.categoryLabel}
            </span>
            <span>{project.genre}</span>
            {project.client && <span>· Client: {project.client}</span>}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            {project.title}
          </h1>
        </div>

        {/* Cinematic Video Player Container */}
        <div className="border border-neutral-200 dark:border-neutral-900 bg-neutral-950 p-2 sm:p-4 shadow-2xl">
          <VideoPlayer
            url={project.videoUrl}
            source={project.videoSource}
            poster={project.thumbnailUrl}
            title={project.title}
            aspectRatio={project.aspectRatio || '16:9'}
            autoPlay={true}
          />
        </div>

        {/* Technical Specs & Details Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Synopsis & Narrative Treatment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold">
                Director Treatment & Behind The Frame
              </h2>
              <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 font-light leading-relaxed whitespace-pre-wrap">
                {project.synopsis || 'No detailed treatment notes recorded for this film production.'}
              </p>
            </div>

            {/* Equipment Arsenal */}
            {project.equipment && project.equipment.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-900">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-neutral-400 flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-black dark:text-white" />
                  <span>Optical & Camera Arsenal</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono uppercase px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata Specs Panel */}
          <div className="lg:col-span-5 border border-neutral-200 dark:border-neutral-900 p-6 sm:p-8 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-6 h-fit">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] font-bold pb-3 border-b border-neutral-200 dark:border-neutral-900">
              Film Metadata & Specifications
            </h3>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-900 text-xs font-mono">
              <div className="py-3 flex justify-between items-center">
                <span className="text-neutral-500 uppercase">Primary Role</span>
                <span className="font-bold uppercase text-black dark:text-white">{project.role}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-neutral-500 uppercase">Production Year</span>
                <span className="font-bold text-black dark:text-white">{project.year}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-neutral-500 uppercase">Duration</span>
                <span className="font-bold text-black dark:text-white">{project.duration}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-neutral-500 uppercase">Aspect Ratio</span>
                <span className="font-bold text-black dark:text-white">{project.aspectRatio}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-neutral-500 uppercase">Category</span>
                <span className="font-bold uppercase text-black dark:text-white">{project.categoryLabel}</span>
              </div>
              {project.client && (
                <div className="py-3 flex justify-between items-center">
                  <span className="text-neutral-500 uppercase">Commission Client</span>
                  <span className="font-bold text-black dark:text-white">{project.client}</span>
                </div>
              )}
            </div>

            {/* Film Reel Role Distribution (Recharts) */}
            <FilmReelDistribution
              cinematographyCount={
                db.projects.filter(
                  (p) =>
                    p.status === 'published' &&
                    /cinematograph|dp|director of photography|camera/i.test(p.role)
                ).length
              }
              editingCount={
                db.projects.filter(
                  (p) =>
                    p.status === 'published' &&
                    /edit|color|post/i.test(p.role)
                ).length
              }
              totalFilms={db.projects.filter((p) => p.status === 'published').length}
            />

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-900">
              <Link
                href="/#contact"
                className="w-full inline-flex items-center justify-center py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Inquire For Similar Production
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer
        branding={{ siteTitle: db.branding.siteTitle, monogram: db.branding.monogram }}
        navigation={{
          footerCopyright: db.navigation.footerCopyright,
          footerStatement: db.navigation.footerStatement,
          items: db.navigation.items,
        }}
        contact={{
          email: db.contact.email,
          phone: db.contact.phone,
          location: db.contact.location,
        }}
        socials={db.socials}
      />
    </div>
  );
}
