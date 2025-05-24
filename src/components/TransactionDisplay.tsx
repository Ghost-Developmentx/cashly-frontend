import React, { useState } from 'react';
import { Transaction, TransactionSummary } from '@/types/financial';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface TransactionDisplayProps {
    transactions: Transaction[];
    summary: TransactionSummary;
    onEditTransaction?: (transaction: Transaction) => void;
    onDeleteTransaction?: (transactionId: string) => void;
    onAddTransaction?: () => void;
}

export default function TransactionDisplay({
                                               transactions,
                                               summary,
                                               onEditTransaction,
                                               onDeleteTransaction,
                                               onAddTransaction
                                           }: TransactionDisplayProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showSummary, setShowSummary] = useState(true);
    const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Food & Dining': 'bg-orange-100 text-orange-800',
            'Transportation': 'bg-blue-100 text-blue-800',
            'Shopping': 'bg-purple-100 text-purple-800',
            'Entertainment': 'bg-pink-100 text-pink-800',
            'Bills & Utilities': 'bg-red-100 text-red-800',
            'Income': 'bg-green-100 text-green-800',
            'Healthcare': 'bg-teal-100 text-teal-800',
            'Groceries': 'bg-yellow-100 text-yellow-800',
            'Gas': 'bg-indigo-100 text-indigo-800',
            'Rent/Mortgage': 'bg-red-100 text-red-800',
            'Insurance': 'bg-gray-100 text-gray-800',
            'Business': 'bg-emerald-100 text-emerald-800',
            'Travel': 'bg-cyan-100 text-cyan-800',
            'Other': 'bg-gray-100 text-gray-800',
            'Uncategorized': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getTransactionTypeIcon = (amount: number) => {
        if (amount > 0) {
            return (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </div>
            );
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 my-4">
                <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-500 mb-4">No transactions match your search criteria.</p>
                    {onAddTransaction && (
                        <button
                            onClick={onAddTransaction}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add New Transaction
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg my-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-sm text-gray-500">{summary.date_range}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowSummary(!showSummary)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {showSummary ? 'Hide' : 'Show'} Summary
                        </button>
                        {onAddTransaction && (
                            <button
                                onClick={onAddTransaction}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                            >
                                Add Transaction
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary */}
            {showSummary && (
                <div className="px-6 py-4 bg-gray-25 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">Total Income</p>
                            <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(summary.total_income)}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-gray-600">Total Expenses</p>
                            <p className="text-lg font-semibold text-red-600">
                                {formatCurrency(summary.total_expenses)}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Net Change</p>
                            <p className={`text-lg font-semibold ${summary.net_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.net_change)}
                            </p>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    {summary?.category_breakdown && typeof summary.category_breakdown === 'object' && Object.keys(summary.category_breakdown).length > 0 &&
                        (
                        <div>
                            <button
                                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium mb-2"
                            >
                                <span>Category Breakdown</span>
                                <svg
                                    className={`w-4 h-4 ml-1 transform transition-transform ${showCategoryBreakdown ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showCategoryBreakdown && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {Object.entries(summary.category_breakdown)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 6)
                                        .map(([category, amount]) => (
                                            <div key={category} className="flex items-center justify-between p-2 bg-white rounded border">
                                                <span className="text-sm text-gray-700 truncate">{category}</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(amount)}
                                            </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Transaction List */}
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(selectedTransaction?.id === transaction.id ? null : transaction)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                {getTransactionTypeIcon(transaction.amount)}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {transaction.description}
                                        </p>
                                        {transaction.recurring && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                Recurring
                                            </span>
                                        )}
                                        {transaction.plaid_synced && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                Bank Synced
                                            </span>
                                        )}
                                        {transaction.ai_categorized && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                AI Categorized
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>{formatDate(transaction.date)}</span>
                                        {(transaction.account?.name || transaction.account_name) && (
                                            <span>• {transaction.account?.name || transaction.account_name}</span>
                                        )}
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                                            {transaction.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className={`text-lg font-semibold ${
                                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                    </p>
                                </div>

                                {transaction.editable && (
                                    <div className="flex items-center space-x-1">
                                        {onEditTransaction && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditTransaction(transaction);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                                title="Edit transaction"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                        {onDeleteTransaction && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteTransaction(transaction.id);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                                title="Delete transaction"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedTransaction?.id === transaction.id && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Transaction ID:</span>
                                        <p className="font-mono text-xs text-gray-700">{transaction.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Date:</span>
                                        <p className="text-gray-700">{new Date(transaction.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Category:</span>
                                        <p className="text-gray-700">{transaction.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Source:</span>
                                        <p className="text-gray-700">
                                            {transaction.plaid_synced ? 'Bank Import' : 'Manual Entry'}
                                        </p>
                                    </div>
                                </div>
                                {transaction.created_at && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        Added {formatDate(transaction.created_at)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        {summary.filters_applied && Object.keys(summary.filters_applied).length > 0 && (
                            <span className="ml-2 text-blue-600">
                                (filtered)
                            </span>
                        )}
                    </span>
                    <span>Period: {summary.date_range}</span>
                </div>

                {/* Applied Filters Display */}
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {summary.filters_applied && Object.entries(summary.filters_applied).some(([_, value]) => value) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(summary.filters_applied).map(([key, value]) => {
                            if (!value) return null;
                            return (
                                <span
                                    key={key}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {key}: {String(value)}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}