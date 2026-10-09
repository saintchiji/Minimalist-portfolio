import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { getDb, verifyPassword } from './db';

const SESSION_COOKIE_NAME = 'cine_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'cine-secret-key-salt-981249-session-token';

interface SessionPayload {
  email: string;
  role: 'admin';
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadStr, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(req?: NextRequest | Request): Promise<boolean> {
  // 1. Check cookies store (standard navigation or direct access)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload && payload.role === 'admin') return true;
    }
  } catch {
    // cookies() might not be available in some contexts, fall through
  }

  // 2. Check req headers if passed directly in API route handlers
  if (req) {
    try {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.substring(7).trim();
        const payload = verifySessionToken(token);
        if (payload && payload.role === 'admin') return true;
      }
      const xToken = req.headers.get('x-admin-token');
      if (xToken) {
        const payload = verifySessionToken(xToken);
        if (payload && payload.role === 'admin') return true;
      }
    } catch {
      // ignore
    }
  }

  // 3. Check next/headers (for Server Components or routes without explicit req)
  try {
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.substring(7).trim();
      const payload = verifySessionToken(token);
      if (payload && payload.role === 'admin') return true;
    }
    const xToken = headerStore.get('x-admin-token');
    if (xToken) {
      const payload = verifySessionToken(xToken);
      if (payload && payload.role === 'admin') return true;
    }
  } catch {
    // ignore
  }

  return false;
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  const db = getDb();
  let isValid = verifyPassword(password, db.general.adminPasswordHash, db.general.salt);
  if (!isValid && typeof password === 'string' && password.trim() !== password) {
    isValid = verifyPassword(password.trim(), db.general.adminPasswordHash, db.general.salt);
  }
  return isValid;
}

export { SESSION_COOKIE_NAME };
