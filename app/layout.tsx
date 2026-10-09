import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'MONOCHROME // Cinematographer & Video Editor Portfolio',
  description:
    'Minimalist, modern portfolio and management system for professional cinematographers and video editors.',
  openGraph: {
    title: 'MONOCHROME // Cinematographer & Video Editor Portfolio',
    description:
      'Minimalist, modern portfolio and management system for professional cinematographers and video editors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONOCHROME // Cinematographer & Video Editor Portfolio',
    description:
      'Minimalist, modern portfolio and management system for professional cinematographers and video editors.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('cine_portfolio_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
