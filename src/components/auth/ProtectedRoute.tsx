'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireOnboarding?: boolean;
}

export default function ProtectedRoute({
                                           children,
                                           requireOnboarding = true
                                       }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded: userLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (!userLoaded) return;

            if (!isSignedIn) {
                router.push('/sign-in');
                return;
            }

            if (!requireOnboarding) {
                setCheckingOnboarding(false);
                return;
            }

            try {
                const token = await getToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setIsOnboarded(userData.onboarding_completed);

                    if (!userData.onboarding_completed) {
                        router.push('/onboarding');
                    }
                } else {
                    router.push('/sign-in');
                }
            } catch (error) {
                console.error('Error checking onboarding:', error);
                router.push('/sign-in');
            } finally {
                setCheckingOnboarding(false);
            }
        };

        checkStatus();
    }, [userLoaded, isSignedIn, requireOnboarding, router, getToken]);

    // Show loading state
    if (!userLoaded || checkingOnboarding) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything while redirecting
    if (!isSignedIn || (requireOnboarding && !isOnboarded)) {
        return null;
    }

    return <>{children}</>;
}