import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSiteUrl } from '../lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const GA_ID = 'G-2WJNDRV8W2';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Work Hours Tracker — Free Browser-Based Timesheet',
    template: '%s | Work Hours Tracker',
  },
  description:
    'No company timesheet? Bookmark this page and use it weekly or monthly to track hours—fast, private, and local. Ideal when your employer, vendor, or client does not provide a time-tracking tool.',
  keywords: [
    'hours tracker',
    'timesheet',
    'work hours',
    'time tracking',
    'browser timesheet',
    'freelancer',
    'contractor',
    'IndexedDB',
    'local storage',
    'privacy',
    'no login',
    'open source',
  ],
  authors: [{ name: 'Vamshi' }],
  creator: 'Vamshi',
  publisher: 'Vamshi',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Work Hours Tracker — Free Browser-Based Timesheet',
    description:
      'Track your hours when your employer, vendor, or client does not give you a tool. Data stays in your browser—no accounts, no servers.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Work Hours Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Work Hours Tracker — weekly and monthly timesheet views',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours Tracker — Free Browser-Based Timesheet',
    description:
      'Bookmark it and log hours weekly or monthly. Weekly & monthly views, autosave—your data never leaves this browser.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  category: 'productivity',
  applicationName: 'Work Hours Tracker',
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#faf5ff] font-sans text-slate-900 antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
