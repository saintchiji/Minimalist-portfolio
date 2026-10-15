'use client';

import React, { useState } from 'react';
import { ServiceItem, WorkflowStep } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ServicesTabProps {
  services: ServiceItem[];
  workflow: WorkflowStep[];
  onSave: (services: ServiceItem[], workflow: WorkflowStep[]) => Promise<void>;
}

export function ServicesTab({ services, workflow, onSave }: ServicesTabProps) {
  const [srvList, setSrvList] = useState<ServiceItem[]>([...services]);
  const [wfList, setWfList] = useState<WorkflowStep[]>([...workflow]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddService = () => {
    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: 'New Cinematography Service',
      tagline: 'Service subtitle',
      description: 'Comprehensive description of services and production capabilities.',
      deliverables: ['Deliverable 1', 'Deliverable 2'],
      turnaround: 'Project-dependent',
      order: srvList.length + 1,
    };
    setSrvList([...srvList, newSrv]);
  };

  const handleUpdateService = (index: number, field: keyof ServiceItem, value: unknown) => {
    const next = [...srvList];
    next[index] = { ...next[index], [field]: value };
    setSrvList(next);
  };

  const handleDeleteService = (index: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setSrvList(srvList.filter((_, i) => i !== index));
  };

  // Workflow updates
  const handleUpdateWf = (index: number, field: keyof WorkflowStep, value: string) => {
    const next = [...wfList];
    next[index] = { ...next[index], [field]: value };
    setWfList(next);
  };

  const handleAddWfStep = () => {
    const next: WorkflowStep = {
      id: `wf-${Date.now()}`,
      step: `0${wfList.length + 1}`,
      title: 'Workflow Stage',
      description: 'Stage description...',
    };
    setWfList([...wfList, next]);
  };

  const handleDeleteWfStep = (index: number) => {
    setWfList(wfList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSave(srvList, wfList);
      setFeedback({ type: 'success', message: 'Services & workflow updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update services.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Capabilities & Packages
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Services & Workflow Configuration
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

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Service Offerings ({srvList.length})
          </h3>
          <button
            type="button"
            onClick={handleAddService}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Service</span>
          </button>
        </div>

        {srvList.map((srv, idx) => (
          <div
            key={srv.id}
            className="p-5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Service 0{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteService(idx)}
                className="text-neutral-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={srv.title}
                onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                placeholder="Service Title"
                className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
              />
              <input
                type="text"
                value={srv.tagline}
                onChange={(e) => handleUpdateService(idx, 'tagline', e.target.value)}
                placeholder="Tagline"
                className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>

            <textarea
              rows={2}
              value={srv.description}
              onChange={(e) => handleUpdateService(idx, 'description', e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                  Deliverables (one per line)
                </label>
                <textarea
                  rows={3}
                  value={srv.deliverables?.join('\n') || ''}
                  onChange={(e) =>
                    handleUpdateService(
                      idx,
                      'deliverables',
                      e.target.value.split('\n').filter(Boolean)
                    )
                  }
                  className="w-full px-2 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                  Turnaround / Delivery Window
                </label>
                <input
                  type="text"
                  value={srv.turnaround}
                  onChange={(e) => handleUpdateService(idx, 'turnaround', e.target.value)}
                  placeholder="e.g. 5-7 business days"
                  className="w-full px-3 py-1.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Workflow */}
      <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Production Workflow Stages
          </h3>
          <button
            type="button"
            onClick={handleAddWfStep}
            className="text-xs font-mono uppercase text-black dark:text-white hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Workflow Step</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wfList.map((wf, idx) => (
            <div
              key={wf.id || idx}
              className="p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={wf.step}
                  onChange={(e) => handleUpdateWf(idx, 'step', e.target.value)}
                  className="w-14 px-2 py-0.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteWfStep(idx)}
                  className="text-neutral-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={wf.title}
                onChange={(e) => handleUpdateWf(idx, 'title', e.target.value)}
                placeholder="Stage Title"
                className="w-full px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono font-bold"
              />

              <textarea
                rows={2}
                value={wf.description}
                onChange={(e) => handleUpdateWf(idx, 'description', e.target.value)}
                placeholder="Stage Description"
                className="w-full px-2 py-1 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-xs font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
