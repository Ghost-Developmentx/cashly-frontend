import React, { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';

interface PersonalInfoStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export default function PersonalInfoStep({ data, updateData, onNext }: PersonalInfoStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!data.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!data.address.line1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!data.address.city.trim()) newErrors.city = 'City is required';
        if (!data.address.state.trim()) newErrors.state = 'State is required';
        if (!data.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600 mt-1">We need some basic information to set up your account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={data.firstName}
                            onChange={(e) => updateData({ firstName: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={data.lastName}
                            onChange={(e) => updateData({ lastName: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => updateData({ phoneNumber: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(555) 123-4567"
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Business Address</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1
                        </label>
                        <input
                            type="text"
                            value={data.address.line1}
                            onChange={(e) => updateData({
                                address: { ...data.address, line1: e.target.value }
                            })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123 Main Street"
                        />
                        {errors.addressLine1 && (
                            <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                        </label>
                        <input
                            type="text"
                            value={data.address.line2}
                            onChange={(e) => updateData({
                                address: { ...data.address, line2: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Suite 100"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={data.address.city}
                                onChange={(e) => updateData({
                                    address: { ...data.address, city: e.target.value }
                                })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="New York"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <input
                                type="text"
                                value={data.address.state}
                                onChange={(e) => updateData({
                                    address: { ...data.address, state: e.target.value }
                                })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="NY"
                                maxLength={2}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                value={data.address.zipCode}
                                onChange={(e) => updateData({
                                    address: { ...data.address, zipCode: e.target.value }
                                })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="10001"
                            />
                            {errors.zipCode && (
                                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </form>
    );
}