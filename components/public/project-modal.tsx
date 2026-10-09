'use client';

import React, { useEffect } from 'react';
import { Project } from '@/lib/types';
import { VideoPlayer } from '../video-player';
import { X, Calendar, Clock, Film, Camera, User, Tag, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-6 md:p-10 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-black text-white border border-neutral-800 shadow-2xl">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 border border-neutral-800 px-2 py-0.5">
              {project.categoryLabel || project.category}
            </span>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider truncate">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-neutral-800 transition-colors text-white"
            aria-label="Close Project Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="bg-neutral-950 p-2 sm:p-4 border-b border-neutral-800">
          <VideoPlayer
            url={project.videoUrl}
            source={project.videoSource}
            poster={project.thumbnailUrl}
            title={project.title}
            aspectRatio={project.aspectRatio || '16:9'}
            autoPlay={true}
          />
        </div>

        {/* Project Details Matrix */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Title & Client */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-400 uppercase tracking-widest font-mono">
                {project.genre} {project.client ? `— ${project.client}` : ''}
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end items-start">
              <span className="text-xs uppercase tracking-widest font-mono border border-neutral-700 px-3 py-1.5 text-neutral-300">
                Source: {project.videoSource}
              </span>
            </div>
          </div>

          {/* Metadata Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-neutral-800 bg-neutral-900/40 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>Role</span>
              </span>
              <p className="font-medium text-white">{project.role || 'Cinematographer'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Year</span>
              </span>
              <p className="font-medium text-white">{project.year || '2026'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </span>
              <p className="font-medium text-white">{project.duration || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 flex items-center space-x-1">
                <Film className="w-3 h-3" />
                <span>Aspect Ratio</span>
              </span>
              <p className="font-medium text-white">{project.aspectRatio || '16:9'}</p>
            </div>
          </div>

          {/* Synopsis */}
          {project.synopsis && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Project Synopsis & Treatment
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-200 font-light">
                {project.synopsis}
              </p>
            </div>
          )}

          {/* Equipment Arsenal */}
          {project.equipment && project.equipment.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 flex items-center space-x-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Systems & Optics</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 text-neutral-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-3 justify-between items-center text-xs">
            <a
              href={`/work/${project.slug}`}
              className="text-neutral-400 hover:text-white flex items-center space-x-1.5 font-mono uppercase text-[11px]"
            >
              <span>Direct Project Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              type="button"
              className="border border-white text-white px-5 py-2 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
            >
              Close Film
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
