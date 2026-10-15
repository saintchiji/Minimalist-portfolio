'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface CategoriesTabProps {
  categories: Category[];
  onSave: (categories: Category[]) => Promise<void>;
}

export function CategoriesTab({ categories, onSave }: CategoriesTabProps) {
  const [list, setList] = useState<Category[]>([...categories]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAdd = () => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      id,
      name: 'New Category',
      slug: `category-${list.length + 1}`,
      description: 'Category description...',
      order: list.length + 1,
      enabled: true,
    };
    setList([...list, newCat]);
  };

  const handleUpdate = (index: number, field: keyof Category, value: unknown) => {
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    setList(next);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(list);
      setFeedback({ type: 'success', message: 'Categories saved successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update categories.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Taxonomy Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Categories & Genres ({list.length})
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-xs font-mono uppercase text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
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

      <div className="space-y-4">
        {list.map((cat, index) => (
          <div
            key={cat.id}
            className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Category 0{index + 1} · ID: {cat.id}
              </span>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1.5 text-xs font-mono uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cat.enabled}
                    onChange={(e) => handleUpdate(index, 'enabled', e.target.checked)}
                    className="w-3.5 h-3.5 accent-black dark:accent-white"
                  />
                  <span>Visible on Site</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-1 text-neutral-400 hover:text-red-500"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-500 block">Name</label>
                <input
                  type="text"
                  required
                  value={cat.name}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-500 block">Slug</label>
                <input
                  type="text"
                  required
                  value={cat.slug}
                  onChange={(e) => handleUpdate(index, 'slug', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                Description
              </label>
              <input
                type="text"
                value={cat.description}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
