import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import {
    StripeConnectStatus
} from '@/types/financial'

interface StripeConnectSetupProps {
    onSuccess: (status: StripeConnectStatus) => void;
    onError: (error: string) => void;
    currentStatus?: StripeConnectStatus;
}

export default function StripeConnectSetup({
                                               onSuccess,
                                               onError,
                                               currentStatus
                                           }: StripeConnectSetupProps) {
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showBusinessTypeForm, setShowBusinessTypeForm] = useState(false);
    const [businessType, setBusinessType] = useState<string>('individual');
    const [country, setCountry] = useState<string>('US');

    const handleOpenDashboard = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/stripe_connect/dashboard_link`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                window.open(response.data.dashboard_url, '_blank');
                onSuccess(currentStatus || { connected: true, can_accept_payments: true });
            } else {
                onError(response.data.error || 'Failed to open dashboard');
            }
        } catch (error) {
            console.error('Error opening Stripe dashboard:', error);
            onError('Failed to open Stripe dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueOnboarding = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/stripe_connect/create_onboarding_link`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                window.location.href = response.data.onboarding_url;
            } else {
                onError(response.data.error || 'Failed to continue onboarding');
            }
        } catch (error) {
            console.error('Error continuing onboarding:', error);
            onError('Failed to continue onboarding');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupConnect = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/stripe_connect/setup`,
                {
                    business_type: businessType,
                    country: country
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                // Redirect to Stripe onboarding
                window.location.href = response.data.onboarding_url;
            } else {
                onError(response.data.error || 'Failed to create Stripe Connect account');
            }
        } catch (error) {
            console.error('Error setting up Stripe Connect:', error);
            onError('Failed to set up Stripe Connect');
        } finally {
            setIsLoading(false);
        }
    };

    // If already connected and can accept payments, show a dashboard link
    if (currentStatus?.connected && currentStatus?.can_accept_payments) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-green-900">Stripe Connect Active</h3>
                        <p className="text-sm text-green-700 mt-1">
                            Your Stripe Connect account is set up and ready to accept payments!
                            Platform fee: {currentStatus.platform_fee_percentage}%
                        </p>

                        <div className="mt-4">
                            <button
                                onClick={handleOpenDashboard}
                                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Opening...' : 'Open Stripe Dashboard'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If connected but onboarding incomplete
    if (currentStatus?.connected && !currentStatus?.onboarding_complete) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-900">Complete Stripe Setup</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            Your Stripe Connect account needs to be completed before you can accept payments.
                        </p>

                        <div className="mt-4">
                            <button
                                onClick={handleContinueOnboarding}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Continue Setup'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Initial setup form
    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-purple-900">Set Up Stripe Connect</h3>
                    <p className="text-sm text-purple-700 mt-1">
                        Enable payment processing for your invoices with Stripe Connect. This allows you to:
                    </p>
                    <ul className="text-sm text-purple-700 mt-2 list-disc list-inside space-y-1">
                        <li>Accept credit card and bank payments</li>
                        <li>Send professional invoices with payment links</li>
                        <li>Track payments automatically</li>
                        <li>Get paid faster with instant notifications</li>
                        <li>Benefit from Stripe&#39;s fraud protection</li>
                    </ul>

                    <div className="mt-4 p-3 bg-purple-100 rounded-md">
                        <p className="text-sm text-purple-800">
                            <strong>Platform Fee:</strong> 2.9% + Stripe&#39;s processing fees
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                            This covers payment processing, fraud protection, and platform maintenance.
                        </p>
                    </div>

                    {!showBusinessTypeForm ? (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowBusinessTypeForm(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                            >
                                Set Up Stripe Connect
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-2">
                                    Business Type
                                </label>
                                <select
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="individual">Individual</option>
                                    <option value="company">Company</option>
                                    <option value="non_profit">Non-Profit</option>
                                    <option value="government_entity">Government Entity</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-2">
                                    Country
                                </label>
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    {/* Add more countries as needed */}
                                </select>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowBusinessTypeForm(false)}
                                    className="text-sm text-purple-600 hover:text-purple-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSetupConnect}
                                    disabled={isLoading}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating Account...' : 'Continue to Stripe'}
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-purple-600 mt-3">
                        🔒 Powered by Stripe Connect. Your financial data is encrypted and secure.
                    </p>
                </div>
            </div>
        </div>
    );
}