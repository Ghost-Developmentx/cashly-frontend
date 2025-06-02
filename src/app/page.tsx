'use client';

import Link from 'next/link';

/** Inline brand icon reused across pages */
const BrandLogo = () => (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        className="h-7 w-7 text-white"
    >
      <path d="M4 12h16M4 6h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default function HomePage() {
  return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Brand */}
        <BrandLogo />

        {/* Hero */}
        <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 max-w-3xl">
          AI‑powered financial clarity for <span className="text-emerald-600">small businesses</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl">
          Cashly turns raw transaction data into actionable insights so you can focus on growth—not bookkeeping.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
              href="/sign-up"
              className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-white font-medium shadow transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Get Started Free
          </Link>
          <Link
              href="/sign-in"
              className="inline-block rounded-lg border-2 border-emerald-600 px-8 py-3 text-emerald-600 font-medium transition hover:bg-emerald-50 dark:hover:bg-gray-800"
          >
            Sign In
          </Link>
        </div>

        {/* Social proof / badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
              />
            </svg>
            Bank‑level security
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 10.586l3.293 3.293a1 1 0 01-1.414 1.414L10 12.414l-1.879 1.879a1 1 0 11-1.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414L10 10.586z" />
            </svg>
            No credit card required
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Cashly. All rights reserved.
        </footer>
      </main>
  );
}
