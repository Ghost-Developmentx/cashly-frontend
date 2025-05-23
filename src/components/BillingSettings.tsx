'use client';

interface Props {
    user: any;
}

export default function BillingSettings({ user }: Props) {
    return (
        <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900">Pro Plan</h4>
                        <p className="text-gray-600">Unlimited conversations, advanced analytics</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$29/month</p>
                        <p className="text-sm text-gray-500">Next billing: Jan 15, 2025</p>
                    </div>
                </div>
                <div className="mt-4 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                        Upgrade Plan
                    </button>
                    <button className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50">
                        Cancel Subscription
                    </button>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                    <button className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Update
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                <div className="space-y-3">
                    {[
                        { date: 'Dec 15, 2024', amount: '$29.00', status: 'Paid' },
                        { date: 'Nov 15, 2024', amount: '$29.00', status: 'Paid' },
                        { date: 'Oct 15, 2024', amount: '$29.00', status: 'Paid' },
                    ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{invoice.date}</p>
                                <p className="text-sm text-gray-500">Pro Plan</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {invoice.status}
                </span>
                            </div>
                            <button className="ml-4 text-blue-600 hover:text-blue-700 text-sm">
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">147</p>
                        <p className="text-sm text-gray-500">Conversations this month</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">2.3GB</p>
                        <p className="text-sm text-gray-500">Data processed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-gray-500">Forecasts generated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}