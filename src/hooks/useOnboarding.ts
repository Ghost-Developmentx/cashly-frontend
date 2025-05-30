import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OnboardingStatus {
    isLoading: boolean;
    isOnboarded: boolean;
    needsOnboarding: boolean;
    userProfile: any;
}

export function useOnboarding() {
    const { user, isLoaded: userLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<OnboardingStatus>({
        isLoading: true,
        isOnboarded: false,
        needsOnboarding: false,
        userProfile: null,
    });

    useEffect(() => {
        async function checkOnboardingStatus() {
            if (!userLoaded || !user) {
                setStatus(prev => ({ ...prev, isLoading: false }));
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
                    const isOnboarded = userData.onboarding_completed;

                    setStatus({
                        isLoading: false,
                        isOnboarded,
                        needsOnboarding: !isOnboarded,
                        userProfile: userData,
                    });

                    // Update Clerk metadata if needed
                    if (isOnboarded && !user.unsafeMetadata?.onboardingCompleted) {
                        await user.update({
                            unsafeMetadata: {
                                onboardingCompleted: true,
                            },
                        });
                    }
                } else {
                    setStatus(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setStatus(prev => ({ ...prev, isLoading: false }));
            }
        }

        checkOnboardingStatus().then(r => r);
    }, [user, userLoaded, getToken]);

    const redirectToOnboarding = () => {
        router.push('/onboarding');
    };

    const completeOnboarding = async () => {
        await user?.update({
            unsafeMetadata: {
                onboardingCompleted: true,
            },
        });
        setStatus(prev => ({ ...prev, isOnboarded: true, needsOnboarding: false }));
    };

    return {
        ...status,
        redirectToOnboarding,
        completeOnboarding,
    };
}