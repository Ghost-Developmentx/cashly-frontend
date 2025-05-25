interface StripeConnectStatusProps {
    status: any;
    onSendMessage: (message: string) => void;
}

export default function StripeConnectStatus({ status, onSendMessage }: StripeConnectStatusProps) {
    const getStatusDisplay = () => {
        if (status.can_accept_payments) {
            return { color: 'bg-green-100 text-green-800', text: 'Active' };
        } else if (status.connected) {
            switch (status.status) {
                case 'rejected':
                    return { color: 'bg-red-100 text-red-800', text: 'Needs Attention' };
                case 'pending':
                    return { color: 'bg-yellow-100 text-yellow-800', text: 'Setup Required' };
                default:
                    return { color: 'bg-blue-100 text-blue-800', text: 'In Progress' };
            }
        } else {
            return { color: 'bg-gray-100 text-gray-800', text: 'Not Connected' };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Stripe Connect Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                    {statusDisplay.text}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Account Connected:</span>
                    <span className={status.connected ? 'text-green-600' : 'text-red-600'}>
                        {status.connected ? '✓' : '✗'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Charges Enabled:</span>
                    <span className={status.charges_enabled ? 'text-green-600' : 'text-red-600'}>
                        {status.charges_enabled ? '✓' : '✗'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Payouts Enabled:</span>
                    <span className={status.payouts_enabled ? 'text-green-600' : 'text-red-600'}>
                        {status.payouts_enabled ? '✓' : '✗'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>{status.platform_fee_percentage || 2.9}%</span>
                </div>
            </div>

            {/* Requirements Notice */}
            {status.connected && !status.can_accept_payments && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">
                                Additional Requirements Needed
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                {status.status === 'rejected'
                                    ? 'Your account needs attention. Please upload required documents like ID verification.'
                                    : 'Please complete the remaining setup requirements to start accepting payments.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
                {status.connected && (
                    <button
                        onClick={() => onSendMessage('Open my Stripe dashboard')}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700"
                    >
                        {status.can_accept_payments ? 'Open Dashboard' : 'Complete Setup'}
                    </button>
                )}

                {!status.connected && (
                    <button
                        onClick={() => onSendMessage('Set up Stripe Connect')}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700"
                    >
                        Connect Stripe
                    </button>
                )}

                {status.connected && status.status === 'rejected' && (
                    <button
                        onClick={() => onSendMessage('Help me fix my Stripe account')}
                        className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-700"
                    >
                        Get Help
                    </button>
                )}
            </div>

            <p className="text-xs text-gray-500 mt-3">
                💡 You can access your Stripe dashboard even when requirements are pending to upload documents and complete verification.
            </p>
        </div>
    );
}