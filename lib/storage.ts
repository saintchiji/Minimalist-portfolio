import fs from 'fs';
import path from 'path';
import { PortfolioDatabase } from './types';

/**
 * Universal Persistence Storage Engine
 * 
 * Supports:
 * 1. Supabase / External REST Database (when SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY are set)
 * 2. Vercel KV / Redis REST (when KV_REST_API_URL & KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL are set)
 * 3. File System (local environment and persistent disk backups)
 */

interface RemoteConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  kvUrl?: string;
  kvToken?: string;
}

function getRemoteConfig(): RemoteConfig {
  return {
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
    kvUrl: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    kvToken: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.json');

// Write to local disk cache/fallback safely
export function writeLocalDb(data: PortfolioDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // In serverless environments like Vercel read-only filesystem, /tmp is writable
    try {
      const tmpFile = path.join('/tmp', 'portfolio.json');
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      console.warn('Local filesystem write bypassed in serverless environment.');
    }
  }
}

// Read from local disk
export function readLocalDb(): PortfolioDatabase | null {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content) as PortfolioDatabase;
    }
  } catch {
    // try /tmp
    try {
      const tmpFile = path.join('/tmp', 'portfolio.json');
      if (fs.existsSync(tmpFile)) {
        const content = fs.readFileSync(tmpFile, 'utf-8');
        return JSON.parse(content) as PortfolioDatabase;
      }
    } catch {}
  }
  return null;
}

/**
 * Sync save to configured remote database (Supabase, Vercel KV, or Upstash)
 */
export async function syncSaveRemote(data: PortfolioDatabase): Promise<boolean> {
  const cfg = getRemoteConfig();

  // 1. Vercel KV / Upstash Redis
  if (cfg.kvUrl && cfg.kvToken) {
    try {
      const res = await fetch(`${cfg.kvUrl}/set/portfolio_data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([JSON.stringify(data)]),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.error('Failed to sync to KV storage:', e);
    }
  }

  // 2. Supabase Storage / Table
  if (cfg.supabaseUrl && cfg.supabaseKey) {
    try {
      // Upsert into portfolio_settings or portfolio table
      const endpoint = `${cfg.supabaseUrl}/rest/v1/portfolio_state?id=eq.default_singleton`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: cfg.supabaseKey,
          Authorization: `Bearer ${cfg.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: 'default_singleton',
          data,
          updated_at: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.error('Failed to sync to Supabase:', e);
    }
  }

  return false;
}

/**
 * Fetch from remote database if configured
 */
export async function fetchRemoteDb(): Promise<PortfolioDatabase | null> {
  const cfg = getRemoteConfig();

  // 1. Vercel KV / Upstash Redis
  if (cfg.kvUrl && cfg.kvToken) {
    try {
      const res = await fetch(`${cfg.kvUrl}/get/portfolio_data`, {
        headers: {
          Authorization: `Bearer ${cfg.kvToken}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
          return parsed as PortfolioDatabase;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from KV:', e);
    }
  }

  // 2. Supabase
  if (cfg.supabaseUrl && cfg.supabaseKey) {
    try {
      const endpoint = `${cfg.supabaseUrl}/rest/v1/portfolio_state?id=eq.default_singleton&select=data`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: cfg.supabaseKey,
          Authorization: `Bearer ${cfg.supabaseKey}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
          return rows[0].data as PortfolioDatabase;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase:', e);
    }
  }

  return null;
}

/**
 * Upload media directly to external cloud storage (Supabase Storage / S3) if configured,
 * returning the public CDN URL.
 */
export async function uploadRemoteMedia(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  const cfg = getRemoteConfig();

  if (cfg.supabaseUrl && cfg.supabaseKey) {
    try {
      const bucket = 'portfolio-media';
      const cleanPath = `uploads/${Date.now()}-${filename}`;
      const uploadEndpoint = `${cfg.supabaseUrl}/storage/v1/object/${bucket}/${cleanPath}`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          apikey: cfg.supabaseKey,
          Authorization: `Bearer ${cfg.supabaseKey}`,
          'Content-Type': contentType,
        },
        body: new Uint8Array(fileBuffer),
      });

      if (res.ok) {
        // Return public URL from Supabase Storage
        return `${cfg.supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
      }
    } catch (e) {
      console.warn('Remote Supabase storage upload failed:', e);
    }
  }

  return null;
}
