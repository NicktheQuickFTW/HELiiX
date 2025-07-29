import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HELiiX-OS | AI-Powered Operations Platform',
  description:
    'Comprehensive AI-powered operations platform for the Big 12 Conference, managing real-time logistics, financial oversight, and operational intelligence across all 16 member institutions.',
  keywords: [
    'Big 12',
    'Conference',
    'Athletics',
    'Operations',
    'HELiiX',
    'Sports Management',
    'AI',
    'Platform',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Set theme based on system preference or stored value
                  const theme = localStorage.getItem('theme') || 'system';
                  const resolvedTheme = theme === 'system' 
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.setAttribute('data-theme', resolvedTheme);
                } catch (e) {
                  console.error('Failed to set theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-black antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
