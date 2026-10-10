'use client';

import React, { useState } from 'react';
import { GeneralSettings } from '@/lib/types';
import { Save, Key, RotateCcw, CheckCircle2, AlertCircle, Download, Upload } from 'lucide-react';
import { adminFetch } from '@/lib/client-auth';

interface GeneralTabProps {
  general: Pick<GeneralSettings, 'siteName' | 'siteDescription' | 'keywords' | 'adminEmail'>;
  onSave: (data: Partial<GeneralSettings> & { newPassword?: string }) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

export function GeneralTab({ general, onSave, onResetDefaults }: GeneralTabProps) {
  const [formData, setFormData] = useState({
    siteName: general.siteName,
    siteDescription: general.siteDescription,
    keywords: general.keywords,
    adminEmail: general.adminEmail,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword) {
      if (newPassword.length < 6) {
        setFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({ type: 'error', message: 'Passwords do not match.' });
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        ...(newPassword ? { newPassword } : {}),
      });
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'General settings updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update general settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        'Warning: This will restore the entire portfolio (projects, hero, about, services) to initial sample data. Continue?'
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      await onResetDefaults();
      setFeedback({ type: 'success', message: 'Portfolio restored to default sample data!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to reset portfolio data.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
              Global Configuration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              General & Security Settings
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

        {/* SEO Meta */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Search Engine & Metadata
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-500 block">
                Website Meta Title
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-500 block">
                Meta Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.siteDescription}
                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-500 block">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Admin Credentials */}
        <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-black dark:text-white" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
              Administrative Credentials
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Admin Contact Email
            </label>
            <input
              type="email"
              required
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-500 block">
                Change Password (optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-500 block">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Zero-Key Persistence: One-Click JSON Backup & Restore */}
      <div className="p-6 border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Zero-Key Data Persistence & Backup
          </h3>
          <p className="text-xs text-neutral-500 pt-1">
            No API keys or credit cards required. Export your entire live portfolio (films, specs, categories, biography, and settings) as a portable snapshot, or import one at any time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await adminFetch('/api/portfolio/backup');
                if (!res.ok) throw new Error('Export failed');
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setFeedback({ type: 'success', message: 'Portfolio snapshot exported successfully!' });
              } catch {
                setFeedback({ type: 'error', message: 'Failed to export portfolio backup.' });
              }
            }}
            className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-mono uppercase font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Portfolio Snapshot</span>
          </button>

          <label className="inline-flex items-center space-x-2 border border-neutral-400 dark:border-neutral-700 px-4 py-2 text-xs font-mono uppercase cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Snapshot File</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const json = JSON.parse(text);
                  const res = await adminFetch('/api/portfolio/backup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(json),
                  });
                  if (!res.ok) throw new Error('Import failed');
                  setFeedback({ type: 'success', message: 'Snapshot imported! Reloading updated portfolio...' });
                  setTimeout(() => window.location.reload(), 1000);
                } catch {
                  setFeedback({ type: 'error', message: 'Failed to import JSON file. Please ensure valid format.' });
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="p-6 border border-neutral-300 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-neutral-600 dark:text-neutral-300">
          Reset Portfolio Data
        </h3>
        <p className="text-xs text-neutral-500">
          Restore all projects, showreel configurations, services, and categories to the default award-winning cinematographer seed collection.
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={isResetting}
          className="inline-flex items-center space-x-2 border border-neutral-400 dark:border-neutral-700 px-4 py-2 text-xs font-mono uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isResetting ? 'Restoring...' : 'Restore Default Sample Data'}</span>
        </button>
      </div>
    </div>
  );
}
