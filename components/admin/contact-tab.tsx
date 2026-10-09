'use client';

import React, { useState } from 'react';
import { ContactSettings, Inquiry } from '@/lib/types';
import {
  Save,
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ContactTabProps {
  contact: ContactSettings;
  onSaveSettings: (settings: Partial<ContactSettings>) => Promise<void>;
  onUpdateInquiryStatus: (id: string, status: 'unread' | 'read' | 'archived') => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

export function ContactTab({
  contact,
  onSaveSettings,
  onUpdateInquiryStatus,
  onDeleteInquiry,
}: ContactTabProps) {
  const [settings, setSettings] = useState({
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    timezone: contact.timezone,
    agent: contact.agent,
    availabilityStatus: contact.availabilityStatus,
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>([...(contact.inquiries || [])]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSaveSettings(settings);
      setFeedback({ type: 'success', message: 'Contact settings updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update contact settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (inq: Inquiry) => {
    const nextStatus: 'unread' | 'read' = inq.status === 'unread' ? 'read' : 'unread';
    try {
      await onUpdateInquiryStatus(inq.id, nextStatus);
      const nextList: Inquiry[] = inquiries.map((i) => (i.id === inq.id ? { ...i, status: nextStatus } : i));
      setInquiries(nextList);
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry({ ...selectedInquiry, status: nextStatus });
      }
    } catch {
      alert('Failed to update inquiry status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await onDeleteInquiry(id);
      setInquiries(inquiries.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch {
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
              Commissions & Availability
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              Contact & Booking Details
            </h2>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Direct Contact Email *
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Phone / Signal Contact
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Base Location / Travel Radius
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-neutral-500 block">
              Current Availability Badge
            </label>
            <input
              type="text"
              value={settings.availabilityStatus}
              onChange={(e) => setSettings({ ...settings, availabilityStatus: e.target.value })}
              placeholder="e.g. Currently Booking Q4 2026"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-neutral-500 block">
            Agent Representation / Booking Agency
          </label>
          <input
            type="text"
            value={settings.agent}
            onChange={(e) => setSettings({ ...settings, agent: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
          />
        </div>
      </form>

      {/* Inquiries Inbox */}
      <div className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
              Client Correspondence
            </span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Inquiries Inbox ({inquiries.length})
            </h3>
          </div>

          <div className="flex space-x-2">
            {(['all', 'unread', 'read'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`text-xs font-mono uppercase px-3 py-1 border ${
                  filterStatus === st
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:border-neutral-800 max-h-[500px] overflow-y-auto">
            {filteredInquiries.length === 0 ? (
              <p className="p-8 text-center text-xs font-mono text-neutral-500 uppercase">
                No inquiries in this folder.
              </p>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-neutral-100 dark:bg-neutral-900'
                      : inq.status === 'unread'
                      ? 'bg-neutral-50/80 dark:bg-neutral-950 font-semibold'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-black dark:text-white truncate">{inq.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 border ${
                        inq.status === 'unread'
                          ? 'border-black dark:border-white font-bold'
                          : 'border-neutral-700 text-neutral-500'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 truncate">
                    {inq.projectType} · {inq.company || inq.email}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-1">
                    {inq.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-7 border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50/40 dark:bg-neutral-950/40">
            {selectedInquiry ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-tight text-black dark:text-white">
                      {selectedInquiry.name}
                    </h4>
                    <p className="text-xs font-mono text-neutral-500">
                      {selectedInquiry.email} {selectedInquiry.company ? `· ${selectedInquiry.company}` : ''}
                    </p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">
                      Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedInquiry)}
                      className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono uppercase hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      Mark as {selectedInquiry.status === 'unread' ? 'Read' : 'Unread'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-1 text-neutral-400 hover:text-red-500"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono p-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Project Format:</span>
                    <span className="font-bold text-black dark:text-white">
                      {selectedInquiry.projectType}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Budget Window:</span>
                    <span className="font-bold text-black dark:text-white">
                      {selectedInquiry.budget}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Target Timeline:</span>
                    <span className="font-bold text-black dark:text-white">
                      {selectedInquiry.timeline}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Project Message / Scope
                  </span>
                  <div className="p-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: Inquiry - ${selectedInquiry.projectType}`}
                    className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-mono uppercase font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs font-mono text-neutral-400 uppercase">
                Select an inquiry on the left to read full details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
