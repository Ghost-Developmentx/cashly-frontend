import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface PlaidLinkProps {
    onSuccess: (accounts: any[]) => void;
    onError: (error: string) => void;
    onExit: () => void;
}

interface PlaidEventMetadata {
    [key: string]: unknown;
}

declare global {
    interface Window {
        Plaid: {
            create: (config: PlaidLinkConfig) => PlaidHandler;
        };
    }
}

interface PlaidLinkConfig {
    token: string;
    onSuccess: (publicToken: string, metadata: PlaidEventMetadata) => void;
    onExit: (err: Error | null, metadata: PlaidEventMetadata) => void;
    onEvent: (eventName: string, metadata: PlaidEventMetadata) => void;
}

interface PlaidHandler {
    open: () => void;
}

export default function PlaidChatLink({ onSuccess, onError, onExit }: PlaidLinkProps) {
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState<string | null>(null);

    useEffect(() => {
        // Load Plaid script
        const script = document.createElement('script');
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const createLinkToken = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/accounts/create_link_token`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                setLinkToken(response.data.link_token);
                initializePlaidLink(response.data.link_token);
            } else {
                onError('Failed to initialize bank connection');
            }
        } catch (error) {
            console.error('Error creating link token:', error);
            onError('Failed to connect to banking services');
        } finally {
            setIsLoading(false);
        }
    };

    const initializePlaidLink = (token: string) => {
        if (!window.Plaid) {
            setTimeout(() => initializePlaidLink(token), 100);
            return;
        }

        const handler = window.Plaid.create({
            token: token,
            onSuccess: async (public_token: string, metadata: any) => {
                console.log('Plaid connection successful');

                try {
                    const authToken = await getToken();
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/fin/accounts/connect_account`,
                        {
                            public_token: public_token,
                            metadata: metadata,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (response.data.success) {
                        onSuccess(response.data.accounts);
                    } else {
                        onError('Failed to connect bank account');
                    }
                } catch (error) {
                    console.error('Error connecting account:', error);
                    onError('Failed to save bank account connection');
                }
            },
            onExit: (err: any, metadata: PlaidEventMetadata) => {
                if (err != null) {
                    console.error('Plaid Link exit with error:', err);
                    onError('Bank connection was cancelled or failed');
                } else {
                    console.log('Plaid Link exited:', metadata);
                    onExit();
                }
            },
            onEvent: (eventName: string, metadata: PlaidEventMetadata) => {
                console.log('Plaid event:', eventName, metadata);
            },
        });

        handler.open();
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900">Connect Your Bank Account</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        I&#39;ll help you securely connect your bank account using Plaid. This allows me to:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                        <li>Track your spending and income automatically</li>
                        <li>Provide personalized financial insights</li>
                        <li>Create accurate budgets and forecasts</li>
                        <li>Alert you to unusual spending patterns</li>
                    </ul>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-green-700 font-medium">Bank-level security</span>
                        </div>

                        <button
                            onClick={createLinkToken}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <span>Connect Bank Account</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-blue-600 mt-2">
                        🔒 Your data is encrypted and never stored by Plaid. You can disconnect at any time.
                    </p>
                </div>
            </div>
        </div>
    );
}