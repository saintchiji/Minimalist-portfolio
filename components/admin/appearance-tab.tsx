'use client';

import React, { useState } from 'react';
import { AppearanceSettings, SectionVisibilityOrder } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Eye, EyeOff, Layout, Type, Move } from 'lucide-react';

interface AppearanceTabProps {
  appearance: AppearanceSettings;
  onSave: (app: AppearanceSettings) => Promise<void>;
}

const DEFAULT_SECTIONS: SectionVisibilityOrder[] = [
  { id: 'sec-hero', key: 'hero', label: 'Hero Section', enabled: true, order: 1 },
  { id: 'sec-work', key: 'work', label: 'Work Portfolio Gallery', enabled: true, order: 2 },
  { id: 'sec-about', key: 'about', label: 'About Section', enabled: true, order: 3 },
  { id: 'sec-services', key: 'services', label: 'Services Section', enabled: true, order: 4 },
  { id: 'sec-contact', key: 'contact', label: 'Contact Information', enabled: true, order: 5 },
];

export function AppearanceTab({ appearance, onSave }: AppearanceTabProps) {
  const [formData, setFormData] = useState<AppearanceSettings>({
    defaultTheme: appearance.defaultTheme || 'dark',
    defaultLayout: appearance.defaultLayout || 'cinematic',
    typographyStyle: appearance.typographyStyle || 'sans',
    spacingDensity: appearance.spacingDensity || 'comfortable',
    autoplayOnMute: appearance.autoplayOnMute ?? false,
    showTechnicalSpecs: appearance.showTechnicalSpecs ?? true,
    sections: appearance.sections && appearance.sections.length > 0 ? appearance.sections : DEFAULT_SECTIONS,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(formData);
      setFeedback({ type: 'success', message: 'Appearance, layout & section hierarchy saved!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update appearance settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionToggle = (index: number) => {
    const nextSections = [...(formData.sections || DEFAULT_SECTIONS)];
    nextSections[index] = {
      ...nextSections[index],
      enabled: !nextSections[index].enabled,
    };
    setFormData({ ...formData, sections: nextSections });
  };

  const handleSectionMove = (index: number, direction: 'up' | 'down') => {
    const sections = [...(formData.sections || DEFAULT_SECTIONS)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // re-assign orders
    const reordered = sections.map((sec, i) => ({
      ...sec,
      order: i + 1,
    }));

    setFormData({ ...formData, sections: reordered });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Interface Behavior & Hierarchy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Website Appearance & Layout
          </h2>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
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

      {/* SECTION VISIBILITY & ORDERING CONTROLS */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-black dark:text-white">
              Public Section Hierarchy & Visibility
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono">
              Reorder or toggle sections displayed on the portfolio homepage
            </p>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase">
            Top to Bottom
          </span>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
          {(formData.sections || DEFAULT_SECTIONS).map((sec, idx) => (
            <div
              key={sec.id || sec.key}
              className="p-3.5 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center space-x-3">
                <span className="text-neutral-400 w-6">0{idx + 1}</span>
                <span className={`font-semibold uppercase tracking-wider ${sec.enabled ? 'text-black dark:text-white' : 'text-neutral-400 line-through'}`}>
                  {sec.label}
                </span>
                <span className="text-[10px] text-neutral-500 hidden sm:inline-block">
                  (anchor: #{sec.key})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle(idx)}
                  className={`px-2.5 py-1 text-[11px] uppercase border cursor-pointer flex items-center space-x-1 ${
                    sec.enabled
                      ? 'border-neutral-400 text-black dark:text-white'
                      : 'border-neutral-700 text-neutral-500'
                  }`}
                >
                  {sec.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{sec.enabled ? 'Visible' : 'Hidden'}</span>
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleSectionMove(idx, 'up')}
                  className="p-1 border border-neutral-300 dark:border-neutral-800 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                  title="Move section up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === (formData.sections || DEFAULT_SECTIONS).length - 1}
                  onClick={() => handleSectionMove(idx, 'down')}
                  className="p-1 border border-neutral-300 dark:border-neutral-800 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                  title="Move section down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout, Typography & Spacing Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Default Theme for First-Time Visitors
          </label>
          <select
            value={formData.defaultTheme}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultTheme: e.target.value as 'system' | 'dark' | 'light',
              })
            }
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          >
            <option value="dark">Dark Mode (Cinematic Black #000000)</option>
            <option value="light">Light Mode (Minimalist White #FFFFFF)</option>
            <option value="system">System Preference Match</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Portfolio Gallery Default Layout
          </label>
          <select
            value={formData.defaultLayout}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultLayout: e.target.value as 'grid' | 'cinematic',
              })
            }
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          >
            <option value="cinematic">Cinematic 2-Column Wide Display</option>
            <option value="grid">3-Column Modern Grid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Typography Style Accent
          </label>
          <select
            value={formData.typographyStyle || 'sans'}
            onChange={(e) =>
              setFormData({
                ...formData,
                typographyStyle: e.target.value as 'sans' | 'mono',
              })
            }
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          >
            <option value="sans">Cinematic Modern Sans-Serif</option>
            <option value="mono">Technical Editorial Monospace</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Whitespace & Spacing Density
          </label>
          <select
            value={formData.spacingDensity || 'comfortable'}
            onChange={(e) =>
              setFormData({
                ...formData,
                spacingDensity: e.target.value as 'comfortable' | 'compact' | 'expansive',
              })
            }
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          >
            <option value="expansive">Expansive (Generous Cinematic Whitespace)</option>
            <option value="comfortable">Comfortable (Balanced Production Density)</option>
            <option value="compact">Compact (Tighter Grid Spacing)</option>
          </select>
        </div>
      </div>

      {/* Playback & Technical Specifications */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold block text-black dark:text-white">
          Playback & Technical Metadata Preferences
        </span>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 text-xs font-mono uppercase cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoplayOnMute}
              onChange={(e) => setFormData({ ...formData, autoplayOnMute: e.target.checked })}
              className="w-4 h-4 accent-black dark:accent-white"
            />
            <span>Autoplay Direct Video Streams on Mute (When In Viewport)</span>
          </label>

          <label className="flex items-center space-x-3 text-xs font-mono uppercase cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showTechnicalSpecs}
              onChange={(e) => setFormData({ ...formData, showTechnicalSpecs: e.target.checked })}
              className="w-4 h-4 accent-black dark:accent-white"
            />
            <span>Show Aspect Ratio & Camera Arsenal Specs on Portfolio Cards</span>
          </label>
        </div>
      </div>
    </form>
  );
}
