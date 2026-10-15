'use client';

import React, { useState } from 'react';
import { NavigationSettings, NavItem } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavigationTabProps {
  navigation: NavigationSettings;
  onSave: (nav: NavigationSettings) => Promise<void>;
}

export function NavigationTab({ navigation, onSave }: NavigationTabProps) {
  const [items, setItems] = useState<NavItem[]>([...navigation.items]);
  const [footerCopyright, setFooterCopyright] = useState(navigation.footerCopyright);
  const [footerStatement, setFooterStatement] = useState(navigation.footerStatement);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '#section',
      enabled: true,
      order: items.length + 1,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof NavItem, value: unknown) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave({
        items,
        footerCopyright,
        footerStatement,
      });
      setFeedback({ type: 'success', message: 'Navigation & footer settings saved!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update navigation settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Site Hierarchy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Navigation & Footer Settings
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

      {/* Navigation Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Header Navigation Menu Links
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Navigation Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateItem(idx, 'label', e.target.value)}
                placeholder="Link Label (e.g. Work)"
                className="w-full sm:w-48 px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => handleUpdateItem(idx, 'href', e.target.value)}
                placeholder="URL or anchor (e.g. #work)"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
              <label className="flex items-center space-x-1.5 text-xs font-mono uppercase cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => handleUpdateItem(idx, 'enabled', e.target.checked)}
                  className="w-3.5 h-3.5 accent-black dark:accent-white"
                />
                <span>Active</span>
              </label>
              <button
                type="button"
                onClick={() => handleDeleteItem(idx)}
                className="p-1 text-neutral-400 hover:text-red-500 self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Content */}
      <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
          Footer Typography & Copyright
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Footer Copyright Notice
            </label>
            <input
              type="text"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Footer Tagline Statement
            </label>
            <input
              type="text"
              value={footerStatement}
              onChange={(e) => setFooterStatement(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
