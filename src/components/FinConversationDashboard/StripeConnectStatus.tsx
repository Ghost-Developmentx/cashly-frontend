interface StripeConnectStatusProps {
    status: any;
    onSendMessage: (message: string) => void;
}

export default function StripeConnectStatus({ status, onSendMessage }: StripeConnectStatusProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Stripe Connect Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status.can_accept_payments
                        ? 'bg-green-100 text-green-800'
                        : status.connected
                            ? status.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                }`}>
          {status.can_accept_payments
              ? 'Active'
              : status.status === 'rejected'
                  ? 'Rejected'
                  : status.connected
                      ? 'Setup Required'
                      : 'Not Connected'
          }
        </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
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

            {/* Recovery Options */}
            {status.showRecoveryOptions && status.recoveryOptions?.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recovery Options</h4>
                    <div className="space-y-2">
                        {status.recoveryOptions.map((option: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (option.action === 'create_new_stripe_account') {
                                        onSendMessage('restart my stripe setup');
                                    } else if (option.action === 'resume_existing_stripe_account') {
                                        onSendMessage('continue my stripe onboarding');
                                    } else if (option.action === 'open_stripe_dashboard') {
                                        onSendMessage('open my stripe dashboard');
                                    }
                                }}
                                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium text-sm text-gray-900">{option.text}</div>
                                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {status.can_accept_payments && (
                <div className="mt-4">
                    <button
                        onClick={() => onSendMessage('Open my Stripe dashboard')}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700"
                    >
                        Open Dashboard
                    </button>
                </div>
            )}

            {status.status === 'rejected' && !status.showRecoveryOptions && (
                <div className="mt-4 space-x-2">
                    <button
                        onClick={() => onSendMessage('restart my stripe setup')}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700"
                    >
                        Start Fresh
                    </button>
                    <button
                        onClick={() => onSendMessage('open my stripe dashboard')}
                        className="bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700"
                    >
                        View Dashboard
                    </button>
                </div>
            )}

            {status.connected && !status.can_accept_payments && status.status !== 'rejected' && !status.showRecoveryOptions && (
                <div className="mt-4">
                    <button
                        onClick={() => onSendMessage('continue my stripe setup')}
                        className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-700"
                    >
                        Continue Setup
                    </button>
                </div>
            )}
        </div>
    );
}