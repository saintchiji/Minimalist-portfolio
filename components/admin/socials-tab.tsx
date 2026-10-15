'use client';

import React, { useState } from 'react';
import { SocialLink } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SocialsTabProps {
  socials: SocialLink[];
  onSave: (socials: SocialLink[]) => Promise<void>;
}

export function SocialsTab({ socials, onSave }: SocialsTabProps) {
  const [list, setList] = useState<SocialLink[]>([...socials]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAdd = () => {
    const newItem: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: 'custom',
      label: 'New Platform',
      url: 'https://',
      enabled: true,
    };
    setList([...list, newItem]);
  };

  const handleUpdate = (index: number, field: keyof SocialLink, value: unknown) => {
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    setList(next);
  };

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(list);
      setFeedback({ type: 'success', message: 'Social channels saved successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update social channels.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            External Distribution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Social & Portfolio Links ({list.length})
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-xs font-mono uppercase text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Channel</span>
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
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

      <div className="space-y-3">
        {list.map((soc, idx) => (
          <div
            key={soc.id}
            className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-3 sm:items-center"
          >
            <input
              type="text"
              value={soc.label}
              onChange={(e) => handleUpdate(idx, 'label', e.target.value)}
              placeholder="Label (e.g. Vimeo)"
              className="w-full sm:w-44 px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
            />
            <input
              type="url"
              value={soc.url}
              onChange={(e) => handleUpdate(idx, 'url', e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
            <label className="flex items-center space-x-1.5 text-xs font-mono uppercase cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={soc.enabled}
                onChange={(e) => handleUpdate(idx, 'enabled', e.target.checked)}
                className="w-3.5 h-3.5 accent-black dark:accent-white"
              />
              <span>Enabled</span>
            </label>
            <button
              type="button"
              onClick={() => handleDelete(idx)}
              className="p-1 text-neutral-400 hover:text-red-500 self-end sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
