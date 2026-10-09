'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Project, Category, VideoSource } from '@/lib/types';
import { adminFetch } from '@/lib/client-auth';
import { VideoPlayer } from '@/components/video-player';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Film,
  Upload,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Check,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
  categories: Category[];
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
  isModalOpenInitially?: boolean;
}

interface ValidationState {
  valid: boolean;
  providerName: string;
  source: VideoSource;
  embedUrl: string;
  isEmbedSupported: boolean;
  warning?: string;
  suggestedThumbnail?: string;
  instructions?: string;
}

export function ProjectsTab({
  projects,
  categories,
  onSaveProject,
  onDeleteProject,
  onReorder,
  isModalOpenInitially = false,
}: ProjectsTabProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenInitially);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Video validation & preview state
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationState | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewingProject, setPreviewingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const emptyProject: Project = {
    id: '',
    title: '',
    slug: '',
    category: categories[0]?.slug || 'long-form',
    categoryLabel: categories[0]?.name || 'Long-Form Videos',
    genre: '',
    client: '',
    role: 'Director of Photography',
    year: new Date().getFullYear().toString(),
    duration: '02:30',
    aspectRatio: '2.39:1 Anamorphic',
    videoSource: 'direct',
    videoUrl: '',
    thumbnailUrl: '',
    synopsis: '',
    equipment: ['ARRI Alexa Mini LF', 'Cooke Anamorphic Primes'],
    featured: false,
    status: 'published',
    order: projects.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleCreateNew = () => {
    setEditingProject({ ...emptyProject, id: `proj-${Date.now()}` });
    setValidationResult(null);
    setShowLivePreview(false);
    setIsModalOpen(true);
  };

  const handleEdit = (p: Project) => {
    setEditingProject({ ...p });
    setValidationResult(null);
    setShowLivePreview(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this film project?')) return;
    try {
      await onDeleteProject(id);
      setFeedback({ type: 'success', message: 'Project deleted.' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete project.' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newOrder = [...projects];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const orderedIds = newOrder.map((p) => p.id);
    await onReorder(orderedIds);
  };

  const handleQuickToggleStatus = async (p: Project) => {
    const nextStatus: 'published' | 'draft' = p.status === 'published' ? 'draft' : 'published';
    try {
      await onSaveProject({ ...p, status: nextStatus });
      setFeedback({
        type: 'success',
        message: `"${p.title}" ${nextStatus === 'published' ? 'published to live portfolio' : 'unpublished (saved as draft)'}.`,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update publication status.' });
    }
  };

  const handleValidateVideo = async (urlToValidate?: string, sourceToValidate?: VideoSource) => {
    const targetUrl = urlToValidate ?? editingProject?.videoUrl;
    const targetSource = sourceToValidate ?? editingProject?.videoSource;

    if (!targetUrl || !targetUrl.trim()) {
      setValidationResult({
        valid: false,
        providerName: 'Unknown',
        source: targetSource || 'direct',
        embedUrl: '',
        isEmbedSupported: false,
        warning: 'Please enter a video URL or upload a file first.',
      });
      return;
    }

    setIsValidating(true);
    try {
      const res = await adminFetch('/api/video/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, source: targetSource }),
      });
      const data = await res.json();

      setValidationResult({
        valid: data.valid,
        providerName: data.providerName || 'Video Provider',
        source: data.source || 'direct',
        embedUrl: data.embedUrl || targetUrl,
        isEmbedSupported: data.isEmbedSupported,
        warning: data.warning,
        suggestedThumbnail: data.suggestedThumbnail,
        instructions: data.instructions,
      });

      // If user had not selected the right source, sync it
      if (editingProject && data.source && editingProject.videoSource !== data.source) {
        setEditingProject((prev) => (prev ? { ...prev, videoSource: data.source } : null));
      }
    } catch {
      setValidationResult({
        valid: false,
        providerName: 'Validation Service',
        source: targetSource || 'other',
        embedUrl: targetUrl,
        isEmbedSupported: true,
        warning: 'Validation check could not complete. URL may still be valid.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplySuggestedThumbnail = () => {
    if (editingProject && validationResult?.suggestedThumbnail) {
      setEditingProject({
        ...editingProject,
        thumbnailUrl: validationResult.suggestedThumbnail,
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'thumbnailUrl' | 'videoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (field === 'videoUrl') {
        const updated = {
          ...editingProject,
          videoUrl: data.url,
          videoSource: 'direct' as VideoSource,
        };
        setEditingProject(updated);
        handleValidateVideo(data.url, 'direct');
      } else {
        setEditingProject({
          ...editingProject,
          thumbnailUrl: data.url,
        });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const catObj = categories.find((c) => c.slug === editingProject.category);
      const updatedProj: Project = {
        ...editingProject,
        categoryLabel: catObj ? catObj.name : editingProject.category,
      };

      await onSaveProject(updatedProj);
      setIsModalOpen(false);
      setEditingProject(null);
      setValidationResult(null);
      setFeedback({ type: 'success', message: 'Project saved successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save project.' });
    }
  };

  const filtered = projects.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Portfolio Management
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Portfolio Projects ({projects.length})
          </h2>
        </div>
        <button
          onClick={handleCreateNew}
          type="button"
          className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center space-x-2 font-mono border ${
            feedback.type === 'success'
              ? 'border-neutral-400 text-black dark:text-white bg-neutral-100 dark:bg-neutral-900'
              : 'border-red-500 text-red-400 bg-red-950/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`text-xs font-mono uppercase px-3 py-1.5 border ${
              filterCategory === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                : 'border-neutral-300 dark:border-neutral-800 text-neutral-500'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.slug)}
              className={`text-xs font-mono uppercase px-3 py-1.5 border ${
                filterCategory === c.slug
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                  : 'border-neutral-300 dark:border-neutral-800 text-neutral-500'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, client, genre..."
          className="w-full sm:w-72 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-black dark:text-white"
        />
      </div>

      {/* Projects List Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono uppercase text-neutral-500">
            No projects found matching current criteria.
          </div>
        ) : (
          filtered.map((project, idx) => (
            <div
              key={project.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50 transition-colors"
            >
              {/* Left thumbnail & title */}
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-12 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Film className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="text-[10px] uppercase font-mono bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.2">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    {project.categoryLabel} · {project.genre} · {project.year} · Source: {project.videoSource}
                  </p>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                    project.status === 'published'
                      ? 'border-neutral-400 text-black dark:text-white'
                      : project.status === 'draft'
                      ? 'border-neutral-700 text-neutral-400'
                      : 'border-neutral-800 text-neutral-600'
                  }`}
                >
                  {project.status}
                </span>

                {/* Reorder Up/Down */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === filtered.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="p-1.5 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 border border-neutral-300 dark:border-neutral-800 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-white dark:bg-black text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold uppercase tracking-tight">
                {editingProject.id.startsWith('proj-') && !projects.find((p) => p.id === editingProject.id)
                  ? 'Add New Portfolio Project'
                  : `Edit: ${editingProject.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, ''),
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                    Slug (URL Identifier)
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Category & Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                    Portfolio Category *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                    Genre / Sub-Type (e.g. Narrative, Documentary, Automotive, Destination)
                  </label>
                  <input
                    type="text"
                    value={editingProject.genre}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, genre: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Client, Role, Year, Duration, Aspect Ratio */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                    Client
                  </label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, client: e.target.value })
                    }
                    placeholder="e.g. Porsche"
                    className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block">Role</label>
                  <input
                    type="text"
                    value={editingProject.role}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, role: e.target.value })
                    }
                    placeholder="DP / Colorist"
                    className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block">Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, year: e.target.value })
                    }
                    className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingProject.duration}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, duration: e.target.value })
                    }
                    placeholder="01:45"
                    className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                    Aspect Ratio
                  </label>
                  <select
                    value={editingProject.aspectRatio}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, aspectRatio: e.target.value })
                    }
                    className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  >
                    <option value="2.39:1 Anamorphic">2.39:1 Anamorphic</option>
                    <option value="16:9">16:9 Standard</option>
                    <option value="9:16 Vertical">9:16 Vertical</option>
                    <option value="2.00:1 Univisium">2.00:1 Univisium</option>
                    <option value="4:3">4:3 Academy</option>
                  </select>
                </div>
              </div>

              {/* UNIFIED VIDEO MANAGEMENT SYSTEM: EXACT SPECIFIED ORDER (1-6) */}
              <div className="p-5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white block">
                      Unified Video Management (Sources 1–6)
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      In-site playback prioritized with permission validation
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleValidateVideo()}
                      disabled={isValidating}
                      className="px-3 py-1.5 border border-neutral-400 dark:border-neutral-700 bg-white dark:bg-black text-[11px] font-mono uppercase flex items-center space-x-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isValidating ? 'animate-spin' : ''}`} />
                      <span>{isValidating ? 'Validating...' : 'Validate Link & Permissions'}</span>
                    </button>
                    {editingProject.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setShowLivePreview(!showLivePreview)}
                        className="px-3 py-1.5 border border-neutral-400 dark:border-neutral-700 text-[11px] font-mono uppercase hover:bg-neutral-200 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                      >
                        {showLivePreview ? 'Hide Preview' : 'Test Player'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Source Selection & URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                      Video Source (Strict Priority)
                    </label>
                    <select
                      value={editingProject.videoSource}
                      onChange={(e) => {
                        const newSource = e.target.value as VideoSource;
                        setEditingProject({ ...editingProject, videoSource: newSource });
                        handleValidateVideo(editingProject.videoUrl, newSource);
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-medium"
                    >
                      <option value="direct">1. Direct Upload</option>
                      <option value="drive">2. Google Drive</option>
                      <option value="youtube">3. YouTube</option>
                      <option value="instagram">4. Facebook & Instagram</option>
                      <option value="x">5. X (Twitter)</option>
                      <option value="other">6. Other Sources</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                      Video Stream URL / File Link
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editingProject.videoUrl}
                        onChange={(e) => {
                          setEditingProject({ ...editingProject, videoUrl: e.target.value });
                          setValidationResult(null);
                        }}
                        onBlur={() => {
                          if (editingProject.videoUrl) handleValidateVideo();
                        }}
                        placeholder={
                          editingProject.videoSource === 'direct'
                            ? '/uploads/film.mp4 or direct CDN URL'
                            : editingProject.videoSource === 'drive'
                            ? 'https://drive.google.com/file/d/...'
                            : editingProject.videoSource === 'youtube'
                            ? 'https://www.youtube.com/watch?v=...'
                            : editingProject.videoSource === 'instagram'
                            ? 'https://www.instagram.com/p/... or FB link'
                            : editingProject.videoSource === 'x'
                            ? 'https://x.com/user/status/...'
                            : 'https://player.vimeo.com/... or streaming URL'
                        }
                        className="flex-1 px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                      />
                      <label className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'videoUrl')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Validation Feedback & Permissions Diagnostic Panel */}
                {validationResult && (
                  <div
                    className={`p-3 border text-xs font-mono space-y-2 ${
                      validationResult.valid
                        ? 'border-neutral-400 dark:border-neutral-700 bg-white dark:bg-black'
                        : 'border-red-500/60 bg-red-950/20 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 font-bold">
                        {validationResult.valid ? (
                          <Check className="w-4 h-4 text-black dark:text-white" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span>
                          {validationResult.providerName} (In-Site Embed:{' '}
                          {validationResult.isEmbedSupported ? 'Supported' : 'Fallback'})
                        </span>
                      </span>

                      {validationResult.suggestedThumbnail && (
                        <button
                          type="button"
                          onClick={handleApplySuggestedThumbnail}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 border border-black dark:border-white text-[10px] uppercase font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Use Provider Thumbnail</span>
                        </button>
                      )}
                    </div>

                    {validationResult.warning && (
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-start space-x-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-500" />
                        <span>{validationResult.warning}</span>
                      </p>
                    )}

                    {validationResult.instructions && (
                      <p className="text-[10px] text-neutral-500">{validationResult.instructions}</p>
                    )}
                  </div>
                )}

                {/* Live Test In-Site Video Player in Modal */}
                {showLivePreview && editingProject.videoUrl && (
                  <div className="p-3 border border-neutral-300 dark:border-neutral-800 bg-neutral-900 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      Live In-Site Embedded Playback Test
                    </span>
                    <div className="max-w-xl mx-auto">
                      <VideoPlayer
                        url={editingProject.videoUrl}
                        source={editingProject.videoSource}
                        poster={editingProject.thumbnailUrl}
                        title={editingProject.title}
                        aspectRatio={editingProject.aspectRatio || '16:9'}
                        autoPlay={true}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail URL & Upload */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                  Poster Thumbnail URL *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingProject.thumbnailUrl}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })
                    }
                    placeholder="https://... or uploaded image path"
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                  />
                  <label className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'thumbnailUrl')}
                    />
                  </label>
                </div>
              </div>

              {/* Equipment list (comma separated) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                  Equipment Arsenal & Lenses (comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.equipment?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      equipment: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="ARRI Alexa 35, Cooke Anamorphic, DaVinci Resolve Studio"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                />
              </div>

              {/* Synopsis */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                  Project Synopsis & Notes
                </label>
                <textarea
                  rows={3}
                  value={editingProject.synopsis}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, synopsis: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono resize-none"
                />
              </div>

              {/* Status & Featured */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-mono uppercase text-neutral-500">Status:</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as 'published' | 'draft' | 'archived',
                        })
                      }
                      className="px-2 py-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <label className="flex items-center space-x-2 text-xs font-mono uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 accent-black dark:accent-white"
                    />
                    <span>Featured Film</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-800 text-xs font-mono uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-mono uppercase font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
