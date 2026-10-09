'use client';

import React, { useState } from 'react';
import { AboutSection as AboutType, Award, GearCategory } from '@/lib/types';
import { adminFetch } from '@/lib/client-auth';
import { Save, Plus, Trash2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface AboutTabProps {
  about: AboutType;
  onSave: (updated: AboutType) => Promise<void>;
}

export function AboutTab({ about, onSave }: AboutTabProps) {
  const [formData, setFormData] = useState<AboutType>({ ...about });
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
      setFormData({ ...formData, portraitUrl: data.url });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddParagraph = () => {
    setFormData({ ...formData, bio: [...(formData.bio || []), ''] });
  };

  const handleBioChange = (idx: number, text: string) => {
    const nextBio = [...formData.bio];
    nextBio[idx] = text;
    setFormData({ ...formData, bio: nextBio });
  };

  const handleRemoveParagraph = (idx: number) => {
    setFormData({ ...formData, bio: formData.bio.filter((_, i) => i !== idx) });
  };

  // Awards
  const handleAddAward = () => {
    const newAward: Award = {
      id: `aw-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'Festival Award',
      festival: 'Film Festival',
      work: 'Title of Project',
    };
    setFormData({ ...formData, awards: [...(formData.awards || []), newAward] });
  };

  const handleAwardChange = (index: number, field: keyof Award, value: string) => {
    const nextAwards = [...(formData.awards || [])];
    nextAwards[index] = { ...nextAwards[index], [field]: value };
    setFormData({ ...formData, awards: nextAwards });
  };

  const handleRemoveAward = (index: number) => {
    setFormData({ ...formData, awards: formData.awards.filter((_, i) => i !== index) });
  };

  // Gear Categories
  const handleAddGearCat = () => {
    const newCat: GearCategory = {
      id: `gear-${Date.now()}`,
      category: 'Support & Accessories',
      items: ['Item 1', 'Item 2'],
    };
    setFormData({ ...formData, gearCategories: [...(formData.gearCategories || []), newCat] });
  };

  const handleGearCatChange = (index: number, field: 'category' | 'items', value: string | string[]) => {
    const nextGear = [...(formData.gearCategories || [])];
    if (field === 'items') {
      nextGear[index] = { ...nextGear[index], items: value as string[] };
    } else {
      nextGear[index] = { ...nextGear[index], category: value as string };
    }
    setFormData({ ...formData, gearCategories: nextGear });
  };

  const handleRemoveGearCat = (index: number) => {
    setFormData({
      ...formData,
      gearCategories: formData.gearCategories.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(formData);
      setFeedback({ type: 'success', message: 'About section updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update about section.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Biography & Equipment
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            About & Arsenal Settings
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

      {/* Basic details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">Full Name</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">Professional Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">Base / Location</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          />
        </div>
      </div>

      {/* Portrait photo */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono uppercase text-neutral-500 block">
          Portrait / Set Photo URL
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={formData.portraitUrl}
            onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
            className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          />
          <label className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs font-mono flex items-center space-x-1 shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Upload Portrait'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Bio Paragraphs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Biography Paragraphs
          </label>
          <button
            type="button"
            onClick={handleAddParagraph}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Paragraph</span>
          </button>
        </div>

        {formData.bio.map((paragraph, idx) => (
          <div key={idx} className="flex space-x-2">
            <textarea
              rows={2}
              value={paragraph}
              onChange={(e) => handleBioChange(idx, e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => handleRemoveParagraph(idx)}
              className="p-2 text-neutral-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono uppercase text-neutral-500 block">
          Philosophy / Director Statement
        </label>
        <textarea
          rows={2}
          value={formData.philosophy}
          onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono italic"
        />
      </div>

      {/* Awards */}
      <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Festival Awards & Honors
          </label>
          <button
            type="button"
            onClick={handleAddAward}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Honor</span>
          </button>
        </div>

        <div className="space-y-2">
          {formData.awards?.map((award, idx) => (
            <div
              key={award.id || idx}
              className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-2 sm:items-center"
            >
              <input
                type="text"
                placeholder="Year"
                value={award.year}
                onChange={(e) => handleAwardChange(idx, 'year', e.target.value)}
                className="w-20 px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Award Title"
                value={award.title}
                onChange={(e) => handleAwardChange(idx, 'title', e.target.value)}
                className="flex-1 px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
              />
              <input
                type="text"
                placeholder="Festival / Institution"
                value={award.festival}
                onChange={(e) => handleAwardChange(idx, 'festival', e.target.value)}
                className="flex-1 px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Film Work"
                value={award.work}
                onChange={(e) => handleAwardChange(idx, 'work', e.target.value)}
                className="flex-1 px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => handleRemoveAward(idx)}
                className="p-1 text-neutral-400 hover:text-red-500 self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Gear Categories */}
      <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Camera Systems & Arsenal
          </label>
          <button
            type="button"
            onClick={handleAddGearCat}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Equipment Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formData.gearCategories?.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) => handleGearCatChange(idx, 'category', e.target.value)}
                  placeholder="Category Name"
                  className="font-bold text-xs font-mono uppercase bg-transparent border-b border-neutral-300 dark:border-neutral-700 px-1 py-0.5"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGearCat(idx)}
                  className="text-neutral-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                rows={4}
                value={cat.items.join('\n')}
                onChange={(e) =>
                  handleGearCatChange(
                    idx,
                    'items',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                placeholder="One item per line..."
                className="w-full px-2 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
