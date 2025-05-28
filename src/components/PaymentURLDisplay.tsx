import React from 'react';

interface PaymentURLDisplayProps {
    paymentUrl: string;
    invoiceId?: string;
    clientName?: string;
    amount?: number;
}

export default function PaymentURLDisplay({
                                              paymentUrl,
                                              invoiceId,
                                              clientName,
                                              amount
                                          }: PaymentURLDisplayProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(paymentUrl);
        // You could add a toast notification here
    };

    const openPaymentLink = () => {
        window.open(paymentUrl, '_blank');
    };

    const displayUrl = paymentUrl.length > 50
        ? paymentUrl.substring(0, 47) + '...'
        : paymentUrl;


    return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 my-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-900">
                        ✅ Invoice Sent Successfully!
                    </h3>
                    {clientName && (
                        <p className="text-sm text-green-700 mt-1">
                            Invoice {invoiceId && `#${invoiceId} `}sent to {clientName}
                            {amount && ` for $${amount.toFixed(2)}`}
                        </p>
                    )}

                    <div className="mt-3 p-3 bg-white rounded-md border border-green-200">
                        <p className="text-sm font-medium text-gray-900 mb-2">Payment Link:</p>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-blue-600 truncate font-mono">
                                    {displayUrl}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                                    title="Copy link"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={openPaymentLink}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Open Link
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-green-600 mt-2">
                        💡 Your client will receive an email with this payment link and can pay securely online.
                    </p>
                </div>
            </div>
        </div>
    );
}