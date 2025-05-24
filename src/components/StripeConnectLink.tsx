import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface StripeConnectLinkProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

export default function StripeConnectLink({ onSuccess, onError }: StripeConnectLinkProps) {
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    const handleConnect = async () => {
        if (!apiKey.trim()) {
            onError('Please enter your Stripe API key');
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/stripe/connect`,
                { api_key: apiKey },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                onSuccess();
            } else {
                onError(response.data.error || 'Failed to connect Stripe');
            }
        } catch (error) {
            console.error('Error connecting Stripe:', error);
            onError('Failed to connect to Stripe');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-purple-900">Connect Your Stripe Account</h3>
                    <p className="text-sm text-purple-700 mt-1">
                        I&#39;ll help you connect your Stripe account to send invoices and track payments. This allows me to:
                    </p>
                    <ul className="text-sm text-purple-700 mt-2 list-disc list-inside space-y-1">
                        <li>Create and send professional invoices</li>
                        <li>Track payment status in real-time</li>
                        <li>Send automatic payment reminders</li>
                        <li>Generate financial reports with payment data</li>
                    </ul>

                    {!showKeyInput ? (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowKeyInput(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                            >
                                Connect Stripe Account
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    Stripe API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk_live_..."
                                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <p className="text-xs text-purple-600 mt-1">
                                    You can find your API key in your Stripe dashboard under Developers → API keys
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setShowKeyInput(false)}
                                    className="text-sm text-purple-600 hover:text-purple-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConnect}
                                    disabled={isLoading || !apiKey.trim()}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Connecting...' : 'Connect Account'}
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-purple-600 mt-3">
                        🔒 Your API key is encrypted and stored securely. You can disconnect at any time.
                    </p>
                </div>
            </div>
        </div>
    );
}