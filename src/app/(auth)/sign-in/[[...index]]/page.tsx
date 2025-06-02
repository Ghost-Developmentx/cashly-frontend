'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

const BrandLogo = () => (
    <Link
        href="/"
        aria-label="Go to Cashly home"
        className="flex items-center gap-2 group"
    >
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 transition group-hover:rotate-6">
      {/* Simple chevron bar logo – replace with SVG/Img if brand asset available */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6 text-white"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
        >
        <path d="M4 12h16M4 6h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
        <span className="sr-only">Cashly</span>
    </Link>
);

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            {/* Outer shell splits into 2‑column on lg screens for brand narrative */}
            <div className="mx-auto w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden">
                {/* ───────────────────────── Left / Marketing panel (lg+) */}
                <aside className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-10">
                    <BrandLogo />
                    <div>
                        <h2 className="text-4xl font-bold leading-tight">Welcome back</h2>
                        <p className="mt-4 text-lg text-emerald-100">
                            Sign in to manage your financial future with Cashly’s AI‑powered insights.
                        </p>
                    </div>
                    <p className="text-xs text-emerald-200">© {new Date().getFullYear()} Cashly. All rights reserved.</p>
                </aside>

                {/* ───────────────────────── Right / Auth card */}
                <section className="w-full lg:w-1/2 bg-white dark:bg-gray-900 p-8 sm:p-12">
                    {/* Logo shown on mobile / small screens */}
                    <div className="mb-8 lg:hidden">
                        <BrandLogo />
                    </div>

                    <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Sign in to Cashly
                    </h1>

                    {/* Clerk SignIn component */}
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        fallbackRedirectUrl="/complete-auth"
                        afterSignInUrl="/"
                        appearance={{
                            variables: {
                                colorPrimary: '#059669', // emerald‑600
                            },
                            elements: {
                                card: 'shadow-none p-0',
                                rootBox: 'space-y-6',
                                socialButtonsBlockButton:
                                    'w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg',
                                formFieldInput:
                                    'rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800',
                                formButtonPrimary:
                                    'bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg w-full',
                                footerActionLink:
                                    'text-emerald-600 hover:text-emerald-700 font-medium',
                            },
                        }}
                    />

                    {/* Alternate action */}
                    <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Sign up for free
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
