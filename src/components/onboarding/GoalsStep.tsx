import React, { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';

interface GoalsStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const GOALS = [
    {
        id: 'cash_flow',
        title: 'Improve Cash Flow',
        description: 'Better manage incoming and outgoing money',
        icon: '💰',
    },
    {
        id: 'expense_tracking',
        title: 'Track Expenses',
        description: 'Monitor and categorize business spending',
        icon: '📊',
    },
    {
        id: 'financial_insights',
        title: 'Get Financial Insights',
        description: 'Understand your business performance',
        icon: '📈',
    },
    {
        id: 'invoice_management',
        title: 'Manage Invoices',
        description: 'Send invoices and track payments',
        icon: '📄',
    },
    {
        id: 'tax_preparation',
        title: 'Prepare for Taxes',
        description: 'Organize finances for tax season',
        icon: '📋',
    },
    {
        id: 'growth_planning',
        title: 'Plan for Growth',
        description: 'Forecast and plan business expansion',
        icon: '🚀',
    },
];

export default function GoalsStep({ data, updateData, onNext, onBack }: GoalsStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleGoal = (goalId: string) => {
        const currentGoals = [...data.goals];
        const index = currentGoals.indexOf(goalId);

        if (index > -1) {
            currentGoals.splice(index, 1);
        } else {
            currentGoals.push(goalId);
        }

        updateData({ goals: currentGoals });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (data.goals.length === 0) {
            newErrors.goals = 'Please select at least one goal';
        }
        if (!data.primaryGoal && data.goals.length > 0) {
            updateData({ primaryGoal: data.goals[0] });
        }

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
                    <h2 className="text-xl font-semibold text-gray-900">What are your goals?</h2>
                    <p className="text-gray-600 mt-1">Select all that apply - we&#39;ll customize Cashly to help you achieve them</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GOALS.map(goal => (
                        <button
                            key={goal.id}
                            type="button"
                            onClick={() => toggleGoal(goal.id)}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                                data.goals.includes(goal.id)
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="text-2xl">{goal.icon}</span>
                                <div className="flex-1">
                                    <h3 className={`font-medium ${
                                        data.goals.includes(goal.id) ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                        {goal.title}
                                    </h3>
                                    <p className={`text-sm mt-1 ${
                                        data.goals.includes(goal.id) ? 'text-blue-700' : 'text-gray-600'
                                    }`}>
                                        {goal.description}
                                    </p>
                                </div>
                                {data.goals.includes(goal.id) && (
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {errors.goals && (
                    <p className="text-red-500 text-sm text-center">{errors.goals}</p>
                )}

                {data.goals.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            What&#39;s your primary goal right now?
                        </label>
                        <select
                            value={data.primaryGoal}
                            onChange={(e) => updateData({ primaryGoal: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {data.goals.map(goalId => {
                                const goal = GOALS.find(g => g.id === goalId);
                                return (
                                    <option key={goalId} value={goalId}>
                                        {goal?.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}

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