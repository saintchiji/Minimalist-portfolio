'use client';

const TOKEN_KEY = 'cine_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn('Failed to save admin token in storage:', e);
  }
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Failed to clear admin token from storage:', e);
  }
}

/**
 * Universal admin fetch helper that attaches the session Bearer token and x-admin-token
 * to requests, ensuring seamless authentication even when third-party cookies are blocked in cross-origin iframes.
 */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : {}));

  if (token) {
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('x-admin-token')) {
      headers.set('x-admin-token', token);
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

/**
 * Safe fetch interceptor initializer.
 * Never throws "Attempted to assign to readonly property" or breaks strict environments.
 */
export function initAdminFetchInterceptor(): void {
  // Safe no-op on client; adminFetch is used directly and safely across admin components
}
