'use client';

// Cashly – Enterprise‑grade sign‑up page (≤ 200 LOC)
// Next.js 14 + Tailwind CSS + Clerk
// Mirrors the refactored sign‑in layout for design consistency.

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

/** Re‑usable brand logo */
const BrandLogo = () => (
    <Link href="/" aria-label="Go to Cashly home" className="flex items-center gap-2 group">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 transition group-hover:rotate-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="h-6 w-6 text-white">
        <path d="M4 12h16M4 6h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
        <span className="sr-only">Cashly</span>
    </Link>
);

export default function SignUpPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="mx-auto w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden">
                {/* ───── Left brand / value panel (hidden < lg) */}
                <aside className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-10">
                    <BrandLogo />
                    <div>
                        <h2 className="text-4xl font-bold leading-tight">Create your Cashly account</h2>
                        <ul className="mt-6 space-y-3 text-emerald-100">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                Bank‑level encryption
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                No credit card required
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                Get started in minutes
                            </li>
                        </ul>
                    </div>
                    <p className="text-xs text-emerald-200">© {new Date().getFullYear()} Cashly</p>
                </aside>

                {/* ───── Right auth card */}
                <section className="w-full lg:w-1/2 bg-white dark:bg-gray-900 p-8 sm:p-12">
                    <div className="mb-8 lg:hidden">
                        <BrandLogo />
                    </div>
                    <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">Join Cashly</h1>

                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        forceRedirectUrl="/complete-auth"
                        afterSignUpUrl="/complete-auth"
                        appearance={{
                            variables: { colorPrimary: '#059669' },
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

                    <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
