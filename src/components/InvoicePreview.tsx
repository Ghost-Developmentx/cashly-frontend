import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';

export interface InvoicePreviewData {
    id: string;
    invoice_number?: string;
    client_name: string;
    client_email: string;
    amount: number;
    status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
    due_date: string;
    description?: string;
    currency?: string;
}

interface InvoicePreviewProps {
    invoice: InvoicePreviewData;
    onSend?: (invoiceId: string) => void;
    onEdit?: (invoice: InvoicePreviewData) => void;
    onCancel?: (invoiceId: string) => void;
}

export default function InvoicePreview({
                                           invoice,
                                           onSend,
                                           onEdit,
                                           onCancel
                                       }: InvoicePreviewProps) {
    const isDraft = invoice.status === 'draft';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm my-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Invoice Preview
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {invoice.invoice_number || `INV-${invoice.id.toString().padStart(5, '0')}`}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isDraft
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {isDraft ? '📝 Draft' : '✅ Ready'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Information */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Bill To
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-900">{invoice.client_name}</p>
                                <p className="text-gray-600 mt-1">{invoice.client_email}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {invoice.description && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    Description
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900">{invoice.description}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invoice Details */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Invoice Details
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Issue Date:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDate(invoice.issue_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Due Date:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDate(invoice.due_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Currency:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {invoice.currency || 'USD'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Total Amount
                            </h4>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(invoice.amount)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total Amount Due
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isDraft && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            This invoice is ready to send. Review the details above and send when ready.
                        </p>
                        <div className="flex items-center space-x-3">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(invoice)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                            {onCancel && (
                                <button
                                    onClick={() => onCancel(invoice.id)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            {onSend && (
                                <button
                                    onClick={() => onSend(invoice.id)}
                                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Send Invoice
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sent Status */}
            {!isDraft && (
                <div className="bg-green-50 px-6 py-4 border-t border-green-200">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">
                            Invoice sent to {invoice.client_name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}