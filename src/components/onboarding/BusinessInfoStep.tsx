import React, { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';

interface BusinessInfoStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const BUSINESS_TYPES = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'non_profit', label: 'Non-Profit' },
];

const EMPLOYEE_COUNTS = [
    { value: '1', label: 'Just me' },
    { value: '2-5', label: '2-5 employees' },
    { value: '6-10', label: '6-10 employees' },
    { value: '11-25', label: '11-25 employees' },
    { value: '26-50', label: '26-50 employees' },
    { value: '50+', label: 'More than 50' },
];

const INDUSTRIES = [
    'Retail',
    'Restaurant/Food Service',
    'Healthcare',
    'Professional Services',
    'Construction',
    'Real Estate',
    'Technology',
    'Manufacturing',
    'Education',
    'Entertainment',
    'Transportation',
    'Other',
];

export default function BusinessInfoStep({ data, updateData, onNext, onBack }: BusinessInfoStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!data.industry) newErrors.industry = 'Please select an industry';

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
                    <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
                    <p className="text-gray-600 mt-1">Tell us about your business</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                    </label>
                    <input
                        type="text"
                        value={data.businessName}
                        onChange={(e) => updateData({ businessName: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.businessName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Acme Corporation"
                    />
                    {errors.businessName && (
                        <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                    </label>
                    <select
                        value={data.businessType}
                        onChange={(e) => updateData({ businessType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {BUSINESS_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Employees
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {EMPLOYEE_COUNTS.map(count => (
                            <button
                                key={count.value}
                                type="button"
                                onClick={() => updateData({ employeeCount: count.value })}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                    data.employeeCount === count.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {count.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                    </label>
                    <select
                        value={data.industry}
                        onChange={(e) => updateData({ industry: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.industry ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select an industry</option>
                        {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry.toLowerCase().replace(/\s+/g, '_')}>
                                {industry}
                            </option>
                        ))}
                    </select>
                    {errors.industry && (
                        <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Back
                    </button>
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