import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { OnboardingData } from '@/app/onboarding/page';

interface ProfilePictureStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onComplete: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export default function ProfilePictureStep({
                                               data,
                                               updateData,
                                               onComplete,
                                               onBack,
                                               isSubmitting
                                           }: ProfilePictureStepProps) {
    const { user } = useUser();
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(
        user?.imageUrl || data.profilePicture || null
    );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsUploading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                updateData({ profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);

            // In a real app, you'd upload to Clerk here
            // await user?.setProfileImage({ file });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Add a Profile Picture</h2>
                    <p className="text-gray-600 mt-1">Help personalize your account with a photo</p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture Preview */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Upload Button */}
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {preview ? 'Change Photo' : 'Upload Photo'}
            </span>
                    </label>

                    <p className="text-xs text-gray-500">
                        JPG, PNG or GIF. Max size 5MB.
                    </p>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Account Summary</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                        <p>👤 {data.firstName} {data.lastName}</p>
                        <p>🏢 {data.businessName}</p>
                        <p>👥 {data.employeeCount} employees</p>
                        <p>🎯 Primary goal: {GOALS.find(g => g.id === data.primaryGoal)?.title}</p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        disabled={isSubmitting}
                    >
                        Back
                    </button>
                    <div className="space-x-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-6 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            disabled={isSubmitting}
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={isSubmitting || isUploading}
                        >
                            {isSubmitting ? 'Completing...' : 'Complete Setup'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

// Goals data for summary
const GOALS = [
    { id: 'cash_flow', title: 'Improve Cash Flow' },
    { id: 'expense_tracking', title: 'Track Expenses' },
    { id: 'financial_insights', title: 'Get Financial Insights' },
    { id: 'invoice_management', title: 'Manage Invoices' },
    { id: 'tax_preparation', title: 'Prepare for Taxes' },
    { id: 'growth_planning', title: 'Plan for Growth' },
];