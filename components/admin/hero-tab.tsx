'use client';

import React, { useState } from 'react';
import { HeroSection, VideoSource } from '@/lib/types';
import { adminFetch } from '@/lib/client-auth';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Upload, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface HeroTabProps {
  hero: HeroSection;
  onSave: (updated: HeroSection) => Promise<void>;
}

export function HeroTab({ hero, onSave }: HeroTabProps) {
  const [formData, setFormData] = useState<HeroSection>({
    visible: hero.visible !== false,
    alignment: hero.alignment || 'left',
    headline: hero.headline || '',
    professionalTitle: hero.professionalTitle || 'Professional Video Editor & Cinematographer',
    subtitle: hero.subtitle || '',
    statement: hero.statement || '',
    backgroundMedia: hero.backgroundMedia || {
      type: 'none',
      url: '',
      opacity: 0.15,
    },
    showreelVideoUrl: hero.showreelVideoUrl || '',
    showreelSource: hero.showreelSource || 'direct',
    showreelPoster: hero.showreelPoster || '',
    ctaPrimaryText: hero.ctaPrimaryText || 'Watch Showreel',
    ctaPrimaryLink: hero.ctaPrimaryLink || '#showreel',
    ctaPrimaryVisible: hero.ctaPrimaryVisible !== false,
    ctaSecondaryText: hero.ctaSecondaryText || 'Inquire Availability',
    ctaSecondaryLink: hero.ctaSecondaryLink || '#contact',
    ctaSecondaryVisible: hero.ctaSecondaryVisible !== false,
    stats: hero.stats || [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(formData);
      setFeedback({ type: 'success', message: 'Hero section updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'backgroundMedia' | 'showreelPoster') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await adminFetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (target === 'backgroundMedia') {
        const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(data.url);
        setFormData({
          ...formData,
          backgroundMedia: {
            type: isVideo ? 'video' : 'image',
            url: data.url,
            opacity: formData.backgroundMedia?.opacity ?? 0.15,
          },
        });
      } else {
        setFormData({ ...formData, showreelPoster: data.url });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
    const nextStats = [...formData.stats];
    nextStats[index] = { ...nextStats[index], [field]: value };
    setFormData({ ...formData, stats: nextStats });
  };

  const handleAddStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: 'New Metric', value: '10+' }],
    });
  };

  const handleRemoveStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Front-Facing Landing
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Hero Section Configuration
          </h2>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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

      {/* Visibility & Alignment Controls Bar */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Section Visibility */}
        <label className="flex items-center space-x-2.5 text-xs font-mono uppercase cursor-pointer">
          <input
            type="checkbox"
            checked={formData.visible !== false}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            className="w-4 h-4 accent-black dark:accent-white"
          />
          <span className="font-bold flex items-center space-x-1.5">
            {formData.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Hero Section Visible on Website</span>
          </span>
        </label>

        {/* Alignment */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase text-neutral-500">Alignment:</span>
          <div className="flex border border-neutral-300 dark:border-neutral-800">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => setFormData({ ...formData, alignment: align })}
                className={`px-3 py-1 text-xs font-mono uppercase flex items-center space-x-1 ${
                  formData.alignment === align
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-3 h-3" />}
                {align === 'center' && <AlignCenter className="w-3 h-3" />}
                {align === 'right' && <AlignRight className="w-3 h-3" />}
                <span>{align}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Title, Headline, Subtitle */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
            Professional Title / Intro Lead *
          </label>
          <input
            type="text"
            required
            value={formData.professionalTitle || ''}
            onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
            placeholder="e.g. Professional Video Editor & Cinematographer"
            className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
              Primary Headline (Filmmaker / Studio Name) *
            </label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm font-semibold tracking-wider text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
              Subtitle / Department Roles *
            </label>
            <input
              type="text"
              required
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
            />
          </div>
        </div>

        {/* Statement / Description */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
            Hero Description & Artistic Statement *
          </label>
          <textarea
            rows={3}
            required
            value={formData.statement}
            onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-sm text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white resize-none"
          />
        </div>
      </div>

      {/* Background Media Configuration */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white">
          Background Ambient Media
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">Media Type</label>
            <select
              value={formData.backgroundMedia?.type || 'none'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  backgroundMedia: {
                    type: e.target.value as 'none' | 'image' | 'video',
                    url: formData.backgroundMedia?.url || '',
                    opacity: formData.backgroundMedia?.opacity ?? 0.15,
                  },
                })
              }
              className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            >
              <option value="none">None (Clean Background)</option>
              <option value="image">Background Image</option>
              <option value="video">Looping Background Video</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Background Media URL / Upload
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="https://... or uploaded media URL"
                value={formData.backgroundMedia?.url || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    backgroundMedia: {
                      type: formData.backgroundMedia?.type || 'image',
                      url: e.target.value,
                      opacity: formData.backgroundMedia?.opacity ?? 0.15,
                    },
                  })
                }
                className="flex-1 px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
              <label className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'backgroundMedia')}
                />
              </label>
            </div>
          </div>
        </div>

        {formData.backgroundMedia?.type !== 'none' && (
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Background Opacity: {Math.round((formData.backgroundMedia?.opacity ?? 0.15) * 100)}%
            </label>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={formData.backgroundMedia?.opacity ?? 0.15}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  backgroundMedia: {
                    type: formData.backgroundMedia?.type || 'image',
                    url: formData.backgroundMedia?.url || '',
                    opacity: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-black dark:accent-white"
            />
          </div>
        )}
      </div>

      {/* Call to Action Buttons Configuration */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white">
          Hero Action Buttons
        </h3>

        {/* Primary Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Primary Button Text
            </label>
            <input
              type="text"
              value={formData.ctaPrimaryText}
              onChange={(e) => setFormData({ ...formData, ctaPrimaryText: e.target.value })}
              className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Target Link / Action
            </label>
            <input
              type="text"
              value={formData.ctaPrimaryLink || '#showreel'}
              onChange={(e) => setFormData({ ...formData, ctaPrimaryLink: e.target.value })}
              placeholder="#showreel or URL"
              className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>
          <div className="flex items-center pt-4">
            <label className="flex items-center space-x-1.5 text-xs font-mono uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ctaPrimaryVisible !== false}
                onChange={(e) => setFormData({ ...formData, ctaPrimaryVisible: e.target.checked })}
                className="w-3.5 h-3.5 accent-black dark:accent-white"
              />
              <span>Button Visible</span>
            </label>
          </div>
        </div>

        {/* Secondary Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={formData.ctaSecondaryText}
              onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
              className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Target Link / Action
            </label>
            <input
              type="text"
              value={formData.ctaSecondaryLink || '#contact'}
              onChange={(e) => setFormData({ ...formData, ctaSecondaryLink: e.target.value })}
              placeholder="#contact or URL"
              className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>
          <div className="flex items-center pt-4">
            <label className="flex items-center space-x-1.5 text-xs font-mono uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ctaSecondaryVisible !== false}
                onChange={(e) => setFormData({ ...formData, ctaSecondaryVisible: e.target.checked })}
                className="w-3.5 h-3.5 accent-black dark:accent-white"
              />
              <span>Button Visible</span>
            </label>
          </div>
        </div>
      </div>

      {/* Showreel Video Controls */}
      <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/40 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white">
          Featured Showreel Video Player
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2 sm:col-span-1">
            <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
              Video Source Provider
            </label>
            <select
              value={formData.showreelSource}
              onChange={(e) =>
                setFormData({ ...formData, showreelSource: e.target.value as VideoSource })
              }
              className="w-full px-3 py-2.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-black dark:text-white"
            >
              <option value="direct">1. Direct Upload (MP4 / WebM)</option>
              <option value="drive">2. Google Drive</option>
              <option value="youtube">3. YouTube</option>
              <option value="instagram">4. Facebook / Instagram</option>
              <option value="x">5. X (Twitter)</option>
              <option value="other">6. Other Sources (Vimeo, etc.)</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
              Showreel Video URL / Stream Link
            </label>
            <input
              type="text"
              value={formData.showreelVideoUrl}
              onChange={(e) => setFormData({ ...formData, showreelVideoUrl: e.target.value })}
              placeholder="https://commondatastorage.googleapis.com/... or YouTube/Vimeo/Drive link"
              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-black dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
            Showreel Poster / Thumbnail URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.showreelPoster}
              onChange={(e) => setFormData({ ...formData, showreelPoster: e.target.value })}
              placeholder="https://..."
              className="flex-1 px-4 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-black dark:text-white"
            />
            <label className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Poster</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'showreelPoster')}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
            Hero Stat Counters
          </label>
          <button
            type="button"
            onClick={handleAddStat}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Stat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formData.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center space-x-3"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 10+)"
                  className="w-full px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. Years on Set)"
                  className="w-full px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-[11px] font-mono text-neutral-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="p-1.5 text-neutral-400 hover:text-red-500"
                title="Remove Stat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
