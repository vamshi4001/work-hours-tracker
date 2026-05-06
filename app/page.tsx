import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'Work Hours Tracker — Free Browser-Based Timesheet',
  description:
    'No company time tool? Bookmark this page and use it every week or month to track your hours. Everything stays in your browser on this device—no cloud, no login.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Work Hours Tracker — Free Browser-Based Timesheet',
    description:
      'Bookmark and open it weekly or monthly to log hours. Weekly and monthly views, autosave, 100% local storage.',
    url: '/',
  },
};

const perks = [
  {
    emoji: '🎉',
    title: 'Zero signup theater',
    body: 'Jump in and start typing—no accounts, no “verify your email” boss battles.',
    bubble: 'from-violet-400 to-fuchsia-500',
  },
  {
    emoji: '🔒',
    title: 'Your browser is the vault',
    body: 'Hours live in IndexedDB on this machine only—not our servers, not anywhere else.',
    bubble: 'from-cyan-400 to-blue-500',
  },
  {
    emoji: '📱',
    title: 'This device, this browser',
    body: 'No magic sync across phones or laptops—by design. What you enter here stays here.',
    bubble: 'from-amber-400 to-orange-500',
  },
  {
    emoji: '✨',
    title: 'Free & open source',
    body: 'MIT-licensed—fork it, share it, make it yours.',
    bubble: 'from-pink-400 to-rose-500',
  },
];

const steps = [
  { step: '1', title: 'Pick your view', text: 'Monthly grid or a focused weekly lane—toggle anytime.' },
  { step: '2', title: 'Tap the weekdays', text: 'Type hours like 8, 7.5, or 6.25—tab between cells like a pro.' },
  { step: '3', title: 'Auto-save', text: 'Totals update live; everything saves as you go. Weekends are grayed out.' },
];

export default function HomePage() {
  const site = getSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Work Hours Tracker',
    description:
      'Free browser-based work hours tracker with weekly and monthly calendar views. Data stored locally in the user\'s browser (IndexedDB); no cross-device persistence.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: site,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-fuchsia-300/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[120%] -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-violet-200/60 blur-3xl"
        />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-violet-950 sm:text-2xl">
            WorkHours
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
              .fun
            </span>
          </Link>
          <Link
            href="/tracker"
            className="rounded-full bg-gradient-to-r from-violet-700 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:scale-105 hover:from-violet-800 hover:to-violet-600 hover:shadow-xl active:scale-100"
          >
            Open tracker
          </Link>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <section className="pt-4 pb-16 text-center sm:pt-8 sm:pb-20">
            <p className="mb-4 inline-flex flex-wrap items-center justify-center gap-2 font-sans text-sm font-semibold text-violet-900/80">
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-violet-100">
                First job? Freelance? Just exploring?
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-fuchsia-100">
                Timesheet zone: activated
              </span>
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Track your hours.
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Right in your browser.
              </span>
            </h1>

            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              <p>
                If your
                {' '}
                <strong className="text-slate-800">employer</strong>
                ,
                {' '}
                <strong className="text-slate-800">vendor</strong>
                , or
                {' '}
                <strong className="text-slate-800">client</strong>
                {' '}
                does not hand you a time-tracking tool, use this for
                {' '}
                <em>your</em>
                {' '}
                own records.
              </p>
              <p>
                <strong className="text-slate-800">Bookmark this page</strong>
                {' '}
                and open it each week or month to log your hours. Clear totals, no accounts, no clutter.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/tracker"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-700 to-violet-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-violet-600/30 transition hover:scale-[1.03] hover:from-violet-800 hover:to-violet-600 active:scale-100"
              >
                Start tracking — it&apos;s free
              </Link>
              <a
                href="#how-it-works"
                className="text-base font-semibold text-violet-700 underline decoration-dotted decoration-2 underline-offset-4 hover:text-violet-900"
              >
                How does this even work?
              </a>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((item) => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-violet-200/40 backdrop-blur"
              >
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.bubble} text-2xl shadow-md`}
                >
                  {item.emoji}
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </section>

          <section
            id="how-it-works"
            className="mt-20 scroll-mt-24 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50/80 to-cyan-50/80 p-8 shadow-xl sm:p-12"
          >
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              How it works
              <span className="text-fuchsia-600"> (the short version)</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
              Three quick steps from “I guess I should log hours” to “okay, I actually know what I worked.”
            </p>
            <ol className="mt-12 grid gap-8 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.step} className="relative flex flex-col items-center text-center">
                  <span className="font-display mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-black text-white shadow-lg">
                    {s.step}
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 rounded-[2rem] border-2 border-dashed border-violet-300 bg-white/90 p-8 shadow-inner sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="font-display text-sm font-bold uppercase tracking-widest text-violet-600">
                Privacy, but make it loud
              </span>
              <h2 className="font-display mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                Your data. Your browser.
                <span className="text-fuchsia-600"> Period.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Everything is stored with
                {' '}
                <strong className="text-slate-800">IndexedDB</strong>
                —think of it as a tiny database living inside
                {' '}
                <em>this</em>
                {' '}
                browser on
                {' '}
                <em>this</em>
                {' '}
                device. Bookmark this site and use it on a weekly or monthly rhythm—your entries stay put on this machine. Open it on another laptop or phone?
                {' '}
                <strong className="text-slate-800">Fresh start</strong>
                —that&apos;s not a bug; there&apos;s no account syncing your life to the cloud.
              </p>
              <Link
                href="/tracker"
                className="mt-10 inline-flex rounded-full bg-gradient-to-r from-violet-700 to-violet-500 px-8 py-3 font-display text-base font-bold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-800 hover:to-violet-600"
              >
                Alright, let me at the grid →
              </Link>
            </div>
          </section>

          <footer className="mt-16 border-t border-violet-100 pt-10 text-center text-sm text-slate-500">
            <p className="font-display font-semibold text-slate-700">
              Work Hours Tracker — free, local, private.
            </p>
            <p className="mt-2">
              Built with Next.js — see
              {' '}
              <a
                href="https://github.com/vamshi4001/work-hours-tracker"
                className="font-medium text-violet-600 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              {' '}
              for source &amp; license.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
