'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/lib/types';
import { adminFetch } from '@/lib/client-auth';
import { Upload, Trash2, Copy, Check, Film, FileImage, HardDrive } from 'lucide-react';

interface MediaTabProps {
  media: MediaItem[];
  onUploadSuccess: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => Promise<void>;
}

export function MediaTab({ media, onUploadSuccess, onDeleteMedia }: MediaTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload error');

      onUploadSuccess(data.media);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await onDeleteMedia(id);
    } catch {
      alert('Failed to delete media asset');
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 block">
            Storage & Assets
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
            Media Library ({media.length})
          </h2>
        </div>

        <label className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Uploading...' : 'Upload Media File'}</span>
          <input
            type="file"
            accept="image/*,video/*"
            disabled={isUploading}
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {media.length === 0 ? (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center text-xs font-mono uppercase text-neutral-500">
          No media files uploaded yet. Click above to upload video clips or stills.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 group flex flex-col justify-between overflow-hidden"
            >
              {/* Asset Preview */}
              <div className="relative aspect-video w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                {item.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-neutral-400 space-y-1">
                    <Film className="w-8 h-8" />
                    <span className="text-[10px] font-mono uppercase">Video</span>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    className="object-cover grayscale"
                  />
                )}
              </div>

              {/* Info & Action Controls */}
              <div className="p-3 space-y-2 text-xs font-mono">
                <div className="space-y-0.5">
                  <p className="font-bold truncate text-black dark:text-white" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {formatSize(item.size)} · {item.type}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="inline-flex items-center space-x-1 text-[10px] uppercase text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-black dark:text-white" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-neutral-400 hover:text-red-500 p-1"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
