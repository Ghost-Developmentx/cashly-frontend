import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';

export interface Invoice {
    id: string;
    client_name: string;
    client_email: string;
    amount: number;
    status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
    due_date: string;
    invoice_number?: string;
    description?: string;
    payment_url?: string;
    stripe_invoice_id?: string;
}

interface InvoiceDisplayProps {
    invoices: Invoice[];
    onEdit?: (invoice: Invoice) => void;
    onSendReminder?: (invoice: Invoice) => void;
    onMarkPaid?: (invoice: Invoice) => void;
    onCreateNew?: () => void;
    onSendInvoice?: (invoice: Invoice) => void; // Add this prop
}

export default function InvoiceDisplay({
                                           invoices,
                                           onEdit,
                                           onSendReminder,
                                           onMarkPaid,
                                           onCreateNew,
                                           onSendInvoice // Add this
                                       }: InvoiceDisplayProps) {

    const getStatusColor = (status: string) => {
        const colors = {
            'draft': 'bg-gray-100 text-gray-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-green-100 text-green-800',
            'overdue': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-500'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusDisplay = (status: string) => {
        const displays = {
            'draft': { text: 'Draft', icon: '📝' },
            'pending': { text: 'Sent', icon: '📧' },
            'paid': { text: 'Paid', icon: '✅' },
            'overdue': { text: 'Overdue', icon: '⚠️' },
            'cancelled': { text: 'Cancelled', icon: '❌' }
        };
        return displays[status as keyof typeof displays] || { text: status, icon: '•' };
    };

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (invoices.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 my-4">
                <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                    <p className="text-gray-500 mb-4">Start creating invoices to track your payments.</p>
                    {onCreateNew && (
                        <button
                            onClick={onCreateNew}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Create New Invoice
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Calculate summary stats
    const totalPending = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
    const draftCount = invoices.filter(inv => inv.status === 'draft').length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg my-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {invoices.length} Invoice{invoices.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                            {overdueCount > 0 && (
                                <p className="text-sm text-red-600">
                                    ⚠️ {overdueCount} overdue
                                </p>
                            )}
                            {draftCount > 0 && (
                                <p className="text-sm text-gray-600">
                                    📝 {draftCount} draft{draftCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    {onCreateNew && (
                        <button
                            onClick={onCreateNew}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700 transition-colors"
                        >
                            New Invoice
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="px-6 py-4 bg-purple-50 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Pending</p>
                        <p className="text-lg font-semibold text-yellow-600">
                            {formatCurrency(totalPending)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Paid</p>
                        <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(totalPaid)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-lg font-semibold text-purple-600">
                            {formatCurrency(totalPending + totalPaid)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoice List */}
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {invoices.map((invoice) => {
                    const daysUntilDue = getDaysUntilDue(invoice.due_date);
                    const isOverdue = invoice.status === 'pending' && daysUntilDue < 0;
                    const statusDisplay = getStatusDisplay(invoice.status);

                    return (
                        <div
                            key={invoice.id}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {invoice.invoice_number || `INV-${invoice.id.slice(-6)}`}
                                        </h4>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                            {statusDisplay.icon} {statusDisplay.text}
                                        </span>
                                        {isOverdue && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Overdue by {Math.abs(daysUntilDue)} days
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>{invoice.client_name}</span>
                                        <span>•</span>
                                        <span>{invoice.client_email}</span>
                                        <span>•</span>
                                        <span>Due {formatDate(invoice.due_date)}</span>
                                        {invoice.description && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-xs">{invoice.description}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(invoice.amount)}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {/* Draft invoice - show Send button */}
                                        {invoice.status === 'draft' && onSendInvoice && (
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Send invoice to ${invoice.client_name} at ${invoice.client_email}?`)) {
                                                        onSendInvoice(invoice);
                                                    }
                                                }}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                                                title="Send invoice"
                                            >
                                                Send Invoice
                                            </button>
                                        )}

                                        {/* Pending invoice - show reminder option */}
                                        {invoice.status === 'pending' && onSendReminder && (
                                            <button
                                                onClick={() => onSendReminder(invoice)}
                                                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                                                title="Send reminder"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Pending invoice - mark as paid option */}
                                        {invoice.status === 'pending' && onMarkPaid && (
                                            <button
                                                onClick={() => onMarkPaid(invoice)}
                                                className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
                                                title="Mark as paid"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Edit option for draft invoices */}
                                        {invoice.status === 'draft' && onEdit && (
                                            <button
                                                onClick={() => onEdit(invoice)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                                title="Edit invoice"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Draft Invoice Notice */}
                            {invoice.status === 'draft' && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        📝 This invoice is a draft. Review the details and send it when ready.
                                    </p>
                                </div>
                            )}

                            {/* Overdue Alert */}
                            {isOverdue && onSendReminder && (
                                <div className="mt-3 p-3 bg-red-50 rounded-md flex items-center justify-between">
                                    <p className="text-sm text-red-800">
                                        This invoice is {Math.abs(daysUntilDue)} days overdue. Would you like to send a reminder?
                                    </p>
                                    <button
                                        onClick={() => onSendReminder(invoice)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                                    >
                                        Send Reminder
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}