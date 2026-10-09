'use client';

import React from 'react';
import { PortfolioDatabase, Project, Inquiry } from '@/lib/types';
import { Film, FileText, Mail, HardDrive, CheckCircle2, Clock, Plus, ExternalLink, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  data: PortfolioDatabase;
  onNavigateTab: (tab: string) => void;
  onOpenNewProject: () => void;
}

export function OverviewTab({ data, onNavigateTab, onOpenNewProject }: OverviewTabProps) {
  const totalProjects = data.projects.length;
  const publishedProjects = data.projects.filter((p) => p.status === 'published').length;
  const draftProjects = data.projects.filter((p) => p.status === 'draft').length;
  const unreadInquiries = (data.contact.inquiries || []).filter((i) => i.status === 'unread').length;
  const mediaCount = (data.media || []).length;

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 block mb-1">
            System Status // Live
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Executive Control Center
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewProject}
            type="button"
            className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Film</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border border-neutral-300 dark:border-neutral-800 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metric Cards Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 cursor-pointer hover:border-black dark:hover:border-white transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Total Projects</span>
            <Film className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold font-mono">{totalProjects}</p>
          <p className="text-[11px] text-neutral-500 font-mono">
            {publishedProjects} Published · {draftProjects} Drafts
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('contact')}
          className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 cursor-pointer hover:border-black dark:hover:border-white transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Client Inquiries</span>
            <Mail className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold font-mono">{data.contact.inquiries?.length || 0}</p>
          <p className="text-[11px] text-neutral-500 font-mono">
            {unreadInquiries} Unread messages
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('categories')}
          className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 cursor-pointer hover:border-black dark:hover:border-white transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Categories</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold font-mono">{data.categories.length}</p>
          <p className="text-[11px] text-neutral-500 font-mono">
            Long-Form, Short-Form, Commercial, Wedding
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('media')}
          className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 cursor-pointer hover:border-black dark:hover:border-white transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Media Assets</span>
            <HardDrive className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold font-mono">{mediaCount}</p>
          <p className="text-[11px] text-neutral-500 font-mono">
            Stored & linked assets
          </p>
        </div>
      </div>

      {/* Split Section: Recent Films & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
              Portfolio Films ({totalProjects})
            </h3>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white flex items-center space-x-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data.projects.slice(0, 5).map((project) => (
              <div key={project.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold uppercase tracking-wider text-black dark:text-white">
                    {project.title}
                  </p>
                  <p className="text-neutral-500 font-mono text-[11px]">
                    {project.categoryLabel} · {project.aspectRatio} · {project.videoSource}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                      project.status === 'published'
                        ? 'border-neutral-400 text-black dark:text-white'
                        : 'border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
              Recent Inquiries ({data.contact.inquiries?.length || 0})
            </h3>
            <button
              onClick={() => onNavigateTab('contact')}
              className="text-xs font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white flex items-center space-x-1"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {(!data.contact.inquiries || data.contact.inquiries.length === 0) ? (
            <p className="text-xs font-mono text-neutral-500 py-6 text-center">
              No inquiries received yet.
            </p>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {data.contact.inquiries.slice(0, 4).map((inq) => (
                <div key={inq.id} className="py-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black dark:text-white">{inq.name}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                        inq.status === 'unread'
                          ? 'border-black dark:border-white font-bold'
                          : 'border-neutral-700 text-neutral-500'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] font-mono">
                    {inq.projectType} · {inq.budget}
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-400 text-[11px] line-clamp-1">
                    “{inq.message}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
