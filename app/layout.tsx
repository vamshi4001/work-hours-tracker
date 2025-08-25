import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Work Hours Tracker - Free Time Tracking App',
  description: 'Free, open-source work hours tracker with weekly and monthly views. Track your time locally in your browser with no sign-up required. Perfect for freelancers, contractors, and professionals.',
  keywords: 'hours tracker, time tracking, work hours, timesheet, freelancer tools, productivity, weekly tracker, monthly tracker, open source',
  authors: [{ name: 'Vamshi' }],
  creator: 'Vamshi',
  publisher: 'Vamshi',
  robots: 'index, follow',
  openGraph: {
    title: 'Work Hours Tracker - Free Time Tracking App',
    description: 'Free, open-source work hours tracker with weekly and monthly views. Track your time locally in your browser with no sign-up required.',
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/vamshi4001/work-hours-tracker',
    siteName: 'Work Hours Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Work Hours Tracker - Free Time Tracking App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours Tracker - Free Time Tracking App',
    description: 'Free, open-source work hours tracker with weekly and monthly views. Track your time locally in your browser.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
