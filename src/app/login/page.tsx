'use client';
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <SignIn path="/login" routing='path' forceRedirectUrl="/complete-auth" />
            <Link href="/sign-up" className="text-sm text-blue-600 hover:underline">
                Don’t have an account? Sign up
            </Link>
        </div>
    );
}