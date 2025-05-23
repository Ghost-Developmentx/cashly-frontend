import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Transaction, Account, TransactionApiResponse } from '@/types/financial';

interface TransactionEditModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTransaction: Transaction) => void;
    onDelete?: (transactionId: string) => void;
    accounts: Account[];
    isNewTransaction?: boolean;
}

export default function TransactionEditModal({
                                                 transaction,
                                                 isOpen,
                                                 onClose,
                                                 onSave,
                                                 onDelete,
                                                 accounts,
                                                 isNewTransaction = false
                                             }: TransactionEditModalProps) {
    const { getToken } = useAuth();
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: '',
        category: '',
        account_id: '',
        recurring: false,
        transaction_type: 'expense' // 'income' or 'expense'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Income',
        'Business',
        'Travel',
        'Groceries',
        'Gas',
        'Rent/Mortgage',
        'Insurance',
        'Other'
    ]);

    useEffect(() => {
        if (transaction && isOpen) {
            setFormData({
                amount: Math.abs(transaction.amount).toString(),
                description: transaction.description,
                date: transaction.date,
                category: transaction.category || '',
                account_id: transaction.account?.id || '',
                recurring: transaction.recurring,
                transaction_type: transaction.amount >= 0 ? 'income' : 'expense'
            });
        } else if (isNewTransaction && isOpen) {
            // Reset form for a new transaction
            setFormData({
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                category: '',
                account_id: accounts[0]?.id || '',
                recurring: false,
                transaction_type: 'expense'
            });
        }
        setError(null);
    }, [transaction, isOpen, isNewTransaction, accounts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            // Prepare the transaction data
            const transactionData = {
                amount: formData.transaction_type === 'income'
                    ? parseFloat(formData.amount)
                    : -parseFloat(formData.amount),
                description: formData.description,
                date: formData.date,
                category: formData.category,
                account_id: formData.account_id,
                recurring: formData.recurring
            };

            let response: { data: TransactionApiResponse };
            if (isNewTransaction) {
                // Create a new transaction
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/fin/transactions`,
                    { transaction: transactionData },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Update existing transaction
                response = await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL}/fin/transactions/${transaction?.id}`,
                    { transaction: transactionData },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            if (response.data.success && response.data.transaction) {
                onSave(response.data.transaction);
                onClose();
            } else {
                setError(response.data.error || 'Failed to save transaction');
            }
        } catch (err: unknown) {
            console.error('Error saving transaction:', err);
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to save transaction'
                : 'Failed to save transaction';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!transaction || !onDelete) return;

        if (!confirm('Are you sure you want to delete this transaction?')) return;

        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/transactions/${transaction.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                onDelete(transaction.id);
                onClose();
            } else {
                setError(response.data.error || 'Failed to delete transaction');
            }
        } catch (err: unknown) {
            console.error('Error deleting transaction:', err);
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to delete transaction'
                : 'Failed to delete transaction';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {isNewTransaction ? 'Add New Transaction' : 'Edit Transaction'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Transaction Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transaction Type
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="expense"
                                    checked={formData.transaction_type === 'expense'}
                                    onChange={(e) => setFormData({...formData, transaction_type: e.target.value})}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Expense</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="income"
                                    checked={formData.transaction_type === 'income'}
                                    onChange={(e) => setFormData({...formData, transaction_type: e.target.value})}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Income</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter transaction description"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account *
                        </label>
                        <select
                            required
                            value={formData.account_id}
                            onChange={(e) => setFormData({...formData, account_id: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select an account</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name} ({account.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={formData.recurring}
                            onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                            className="mr-2"
                        />
                        <label htmlFor="recurring" className="text-sm text-gray-700">
                            This is a recurring transaction
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div>
                            {!isNewTransaction && onDelete && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                >
                                    Delete Transaction
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (isNewTransaction ? 'Add Transaction' : 'Save Changes')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}