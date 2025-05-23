import React from 'react';

interface Account {
    id: string;
    name: string;
    account_type: string;
    balance: number;
    institution: string;
    transaction_count?: number;
    last_synced?: string;
}

interface AccountDisplayProps {
    accounts: Account[];
    onDisconnect?: (accountId: string) => void;
}

export default function AccountDisplay({ accounts, onDisconnect }: AccountDisplayProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatAccountType = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const getAccountIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'checking':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            case 'savings':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                );
            case 'credit':
                return (
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
        }
    };

    if (accounts.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
                <div className="text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">No bank accounts connected</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Your Connected Accounts</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
        </span>
            </div>

            <div className="space-y-3">
                {accounts.map((account) => (
                    <div key={account.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    {getAccountIcon(account.account_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {account.name}
                                        </h4>
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                      {formatAccountType(account.account_type)}
                    </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {account.institution}
                                        {account.transaction_count && (
                                            <span> • {account.transaction_count} transactions</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(account.balance)}
                                </p>
                                {account.last_synced && (
                                    <p className="text-xs text-gray-500">
                                        Synced {new Date(account.last_synced).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {onDisconnect && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => onDisconnect(account.id)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Balance:</span>
                    <span className="text-lg font-bold text-gray-900">
            {formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}
          </span>
                </div>
            </div>
        </div>
    );
}