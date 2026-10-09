'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminClient } from './admin-client';
import { PortfolioDatabase } from '@/lib/types';
import { getAdminToken, clearAdminToken } from '@/lib/client-auth';
import { Loader2, AlertCircle } from 'lucide-react';

interface AdminAuthGuardProps {
  initialData: PortfolioDatabase | null;
  serverAuthenticated: boolean;
}

export function AdminAuthGuard({ initialData, serverAuthenticated }: AdminAuthGuardProps) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioDatabase | null>(initialData);
  const [loading, setLoading] = useState(!serverAuthenticated || !initialData);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If server already authenticated and provided data, nothing more needed
    if (serverAuthenticated && initialData) {
      return;
    }

    // Otherwise (e.g. cross-site iframe blocking third-party cookies), verify via client token
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    const activeToken: string = token;
    let isMounted = true;

    async function verifyAndLoad() {
      try {
        const res = await fetch('/api/portfolio/admin', {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            'x-admin-token': activeToken,
          },
        });

        if (!res.ok) {
          throw new Error('Session invalid or expired');
        }

        const adminData = await res.json();
        if (isMounted) {
          setData(adminData);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          clearAdminToken();
          setAuthError('Authentication session expired. Redirecting to login...');
          setTimeout(() => {
            router.replace('/admin/login');
          }, 800);
        }
      }
    }

    verifyAndLoad();

    return () => {
      isMounted = false;
    };
  }, [serverAuthenticated, initialData, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
            Verifying Admin Credentials
          </p>
          <p className="text-[10px] font-mono text-neutral-400">
            Establishing secure session connection...
          </p>
        </div>
        {authError && (
          <div className="mt-4 p-3 border border-red-500/40 bg-red-950/20 text-red-400 text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <AdminClient initialData={data} />;
}
