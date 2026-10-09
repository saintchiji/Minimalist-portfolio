'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandingSettings } from '@/lib/types';
import { adminFetch } from '@/lib/client-auth';
import { Save, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface BrandingTabProps {
  branding: BrandingSettings;
  onSave: (branding: BrandingSettings) => Promise<void>;
}

export function BrandingTab({ branding, onSave }: BrandingTabProps) {
  const [formData, setFormData] = useState<BrandingSettings>({ ...branding });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await adminFetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormData({ ...formData, logoUrl: data.url });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logoUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(formData);
      setFeedback({ type: 'success', message: 'Branding settings saved successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update branding.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Visual Identity
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Logo & Branding Configuration
          </h2>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
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

      {/* Site Title & Monogram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Site Header Brand Name *
          </label>
          <input
            type="text"
            required
            value={formData.siteTitle}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Text Monogram / Short Badge *
          </label>
          <input
            type="text"
            required
            value={formData.monogram}
            onChange={(e) => setFormData({ ...formData, monogram: e.target.value })}
            placeholder="e.g. C // K or JK // CINE"
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          />
        </div>
      </div>

      {/* Custom Graphic Logo */}
      <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold block text-black dark:text-white">
          Custom Logo Image (Optional)
        </span>
        <p className="text-xs text-neutral-500">
          Upload a transparent PNG or SVG logo. If set, this replaces the monogram badge in the header.
        </p>

        {formData.logoUrl ? (
          <div className="flex items-center space-x-6 p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
            <div className="relative p-2 border border-neutral-200 dark:border-neutral-800">
              <Image
                src={formData.logoUrl}
                alt="Logo preview"
                width={120}
                height={formData.logoHeight || 28}
                className="dark:invert object-contain"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-neutral-500 truncate max-w-sm">
                URL: {formData.logoUrl}
              </p>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="inline-flex items-center space-x-1 px-3 py-1 border border-neutral-300 dark:border-neutral-800 text-xs font-mono uppercase text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Custom Logo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter direct logo URL or upload below..."
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="flex-1 px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
            <label className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-500 block">
              Logo Display Height (px): {formData.logoHeight || 28}px
            </label>
            <input
              type="range"
              min="16"
              max="60"
              value={formData.logoHeight || 28}
              onChange={(e) =>
                setFormData({ ...formData, logoHeight: parseInt(e.target.value, 10) })
              }
              className="w-full accent-black dark:accent-white"
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showTitleAlongsideLogo}
                onChange={(e) =>
                  setFormData({ ...formData, showTitleAlongsideLogo: e.target.checked })
                }
                className="w-4 h-4 accent-black dark:accent-white"
              />
              <span>Show Title Alongside Logo</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
