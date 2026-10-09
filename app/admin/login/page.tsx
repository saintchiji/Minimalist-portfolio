'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { setAdminToken, getAdminToken } from '@/lib/client-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}`, 'x-admin-token': token },
      })
        .then((res) => {
          if (res.ok) {
            router.replace('/admin');
          }
        })
        .catch(() => {});
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        setAdminToken(data.token);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col justify-between p-6 md:p-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md mx-auto my-12 border border-neutral-300 dark:border-neutral-800 p-8 sm:p-10 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-8">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto border border-black dark:border-white flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-black dark:text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Admin Authentication</h1>
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
            Cinematography CMS & Controls
          </p>
        </div>

        {error && (
          <div className="p-3 border border-red-500/40 bg-red-950/20 text-red-300 text-xs flex items-center space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block">
              Administrative Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-sm focus:outline-hidden focus:border-black dark:focus:border-white transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>
      </div>

      <div className="text-center text-xs font-mono text-neutral-400">
        Strictly Monochrome // Encrypted Session
      </div>
    </div>
  );
}
