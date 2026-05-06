import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Timesheet | Work Hours Tracker',
  description:
    'Log your work hours in a weekly or monthly calendar. Your entries stay in this browser only—nothing is sent to a server.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'My Timesheet | Work Hours Tracker',
    description: 'Local browser-based hours tracker — your data stays on this device.',
    url: '/tracker',
  },
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
