'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back to Cashly</h1>
                    <p className="text-gray-600 mt-2">Your AI-powered financial advisor</p>
                </div>

                {/* Sign In Component */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none p-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "w-full border border-gray-300 hover:bg-gray-50",
                                formFieldInput: "rounded-lg border-gray-300",
                                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                            }
                        }}
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        forceRedirectUrl="/dashboard"
                    />
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&#39;t have an account?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2024 Cashly. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );
}