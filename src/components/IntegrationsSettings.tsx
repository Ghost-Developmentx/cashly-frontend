'use client';

import { useState } from 'react';

interface Props {
    user: any;
}

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    connected: boolean;
    lastSync?: string;
    accounts?: number;
}

export default function IntegrationsSettings({ user }: Props) {
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: 'plaid',
            name: 'Plaid',
            description: 'Connect your bank accounts for automatic transaction tracking',
            icon: '🏦',
            connected: true,
            lastSync: '2 hours ago',
            accounts: 3,
        },
        {
            id: 'stripe',
            name: 'Stripe Connect',
            description: 'Accept payments and send invoices',
            icon: '💳',
            connected: true,
            lastSync: '5 minutes ago',
        },
        {
            id: 'quickbooks',
            name: 'QuickBooks',
            description: 'Import accounting data and sync transactions',
            icon: '📊',
            connected: false,
        },
        {
            id: 'xero',
            name: 'Xero',
            description: 'Sync your Xero accounting data',
            icon: '📈',
            connected: false,
        },
        {
            id: 'slack',
            name: 'Slack',
            description: 'Get financial alerts and notifications in Slack',
            icon: '💬',
            connected: false,
        },
        {
            id: 'zapier',
            name: 'Zapier',
            description: 'Automate workflows with 5,000+ apps',
            icon: '⚡',
            connected: false,
        },
    ]);

    const handleToggleIntegration = (id: string) => {
        setIntegrations(prev =>
            prev.map(integration =>
                integration.id === id
                    ? { ...integration, connected: !integration.connected }
                    : integration
            )
        );
    };

    const connectedIntegrations = integrations.filter(i => i.connected);
    const availableIntegrations = integrations.filter(i => !i.connected);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Integrations</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Connect your favorite tools and services to Cashly
                </p>
            </div>

            {/* Connected Integrations */}
            {connectedIntegrations.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Connected</h3>
                    <div className="space-y-3">
                        {connectedIntegrations.map((integration) => (
                            <div
                                key={integration.id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                            {integration.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {integration.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {integration.description}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    ✓ Connected
                                                </span>
                                                {integration.lastSync && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Last sync: {integration.lastSync}
                                                    </span>
                                                )}
                                                {integration.accounts && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {integration.accounts} accounts
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                            Configure
                                        </button>
                                        <button
                                            onClick={() => handleToggleIntegration(integration.id)}
                                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Integrations */}
            {availableIntegrations.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Available Integrations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableIntegrations.map((integration) => (
                            <div
                                key={integration.id}
                                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                                            {integration.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {integration.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {integration.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleIntegration(integration.id)}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                    >
                                        Connect
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
