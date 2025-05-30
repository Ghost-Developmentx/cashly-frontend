'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PersonalInfoStep from '@/components/onboarding/PersonalInfoStep';
import BusinessInfoStep from '@/components/onboarding/BusinessInfoStep';
import GoalsStep from '@/components/onboarding/GoalsStep';
import ProfilePictureStep from '@/components/onboarding/ProfilePictureStep';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';

export interface OnboardingData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    businessName: string;
    businessType: string;
    employeeCount: string;
    industry: string;
    goals: string[];
    primaryGoal: string;
    profilePicture?: string;
}

const INITIAL_DATA: OnboardingData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    },
    businessName: '',
    businessType: 'sole_proprietorship',
    employeeCount: '1-5',
    industry: '',
    goals: [],
    primaryGoal: '',
};

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalSteps = 4;

    const updateFormData = (data: Partial<OnboardingData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            // Update user metadata in Clerk
            await user?.update({
                unsafeMetadata: {
                    onboardingCompleted: true,
                    businessInfo: {
                        businessName: formData.businessName,
                        businessType: formData.businessType,
                        employeeCount: formData.employeeCount,
                        industry: formData.industry,
                    },
                    goals: formData.goals,
                    primaryGoal: formData.primaryGoal,
                },
            });

            // Save to your backend
            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error completing onboarding:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoaded || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome to Cashly!</h1>
                    <p className="text-gray-600 mt-2">Let&#39;s get your account set up in just a few minutes</p>
                </div>

                {/* Progress Bar */}
                <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

                {/* Form Steps */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                    {currentStep === 1 && (
                        <PersonalInfoStep
                            data={formData}
                            updateData={updateFormData}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 2 && (
                        <BusinessInfoStep
                            data={formData}
                            updateData={updateFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 3 && (
                        <GoalsStep
                            data={formData}
                            updateData={updateFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 4 && (
                        <ProfilePictureStep
                            data={formData}
                            updateData={updateFormData}
                            onComplete={handleComplete}
                            onBack={handleBack}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}