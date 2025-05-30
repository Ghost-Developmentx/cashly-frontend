'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireOnboarding?: boolean;
}

export default function ProtectedRoute({
                                           children,
                                           requireOnboarding = true
                                       }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useUser();
    const { isLoading, isOnboarded, needsOnboarding } = useOnboarding();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || isLoading) return;

        // Not signed in? Redirect to sign-in
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        // Needs onboarding? Redirect to onboarding
        if (requireOnboarding && needsOnboarding) {
            router.push('/onboarding');
            return;
        }
    }, [isLoaded, isLoading, isSignedIn, needsOnboarding, requireOnboarding, router]);

    // Show loading state
    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!isSignedIn || (requireOnboarding && needsOnboarding)) {
        return null;
    }

    // User is authenticated and onboarded (or onboarding not required)
    return <>{children}</>;
}