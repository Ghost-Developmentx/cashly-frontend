'use client';

import { useState } from 'react';

interface Props {
    user: any;
}

export default function BillingSettings({ user }: Props) {
    const [selectedPlan, setSelectedPlan] = useState('pro');

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: 9,
            description: 'Perfect for freelancers and small businesses',
            features: [
                '50 conversations/month',
                'Basic financial insights',
                '1 connected bank account',
                'Email support'
            ],
            current: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 29,
            description: 'For growing businesses with advanced needs',
            features: [
                'Unlimited conversations',
                'Advanced analytics & forecasting',
                'Unlimited bank accounts',
                'Priority support',
                'Invoice management',
                'Team collaboration'
            ],
            current: true,
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            description: 'Custom solutions for large organizations',
            features: [
                'Everything in Pro',
                'Custom integrations',
                'Dedicated account manager',
                'SLA guarantee',
                'Advanced security features',
                'Custom reporting'
            ],
            current: false
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing & Subscription</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your subscription plan and payment methods
                </p>
            </div>

            {/* Current Plan Overview */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h3 className="text-2xl font-bold">Pro Plan</h3>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                        <p className="mt-2 text-blue-100">
                            Unlimited conversations, advanced analytics, and priority support
                        </p>
                        <div className="mt-4 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold">$29</span>
                            <span className="text-blue-100">/month</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-blue-100">Next billing date</p>
                        <p className="text-lg font-semibold">January 15, 2025</p>
                    </div>
                </div>
            </div>

            {/* Available Plans */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-lg border-2 p-6 ${
                                plan.current
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {plan.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    ${plan.price}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">/month</span>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                    plan.current
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Update
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• 4242
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Expires 12/2025
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            Default
                        </span>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing History</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Download All
                    </button>
                </div>
                <div className="overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                                Date
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                                Description
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                                Amount
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                                Status
                            </th>
                            <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">
                                Invoice
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                            { date: 'Dec 15, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'Paid' },
                            { date: 'Nov 15, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'Paid' },
                            { date: 'Oct 15, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'Paid' },
                            { date: 'Sep 15, 2024', description: 'Pro Plan - Monthly', amount: '$29.00', status: 'Paid' },
                        ].map((invoice, index) => (
                            <tr key={index}>
                                <td className="py-3 text-sm text-gray-900 dark:text-white">
                                    {invoice.date}
                                </td>
                                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {invoice.description}
                                </td>
                                <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                                    {invoice.amount}
                                </td>
                                <td className="py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            {invoice.status}
                                        </span>
                                </td>
                                <td className="py-3 text-right">
                                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Current Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">147</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conversations</div>
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400">Unlimited</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">2.3GB</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Storage Used</div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">of 10GB</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team Members</div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">of 10</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">API Calls (k)</div>
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400">Unlimited</div>
                    </div>
                </div>
            </div>
        </div>
    );
}