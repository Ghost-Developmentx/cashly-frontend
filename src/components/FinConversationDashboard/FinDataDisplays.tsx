import { Account, Transaction, TransactionData } from '@/types/financial';
import { Invoice } from '@/components/InvoiceDisplay';
import PlaidChatLink from '../PlaidChatLink';
import AccountDisplay from '../AccountDisplay';
import TransactionDisplay from '../TransactionDisplay';
import StripeConnectSetup from '../StripeConnectSetup';
import InvoiceDisplay from '../InvoiceDisplay';
import InvoicePreview, { InvoicePreviewData } from '../InvoicePreview';
import StripeConnectStatus from './StripeConnectStatus';
import PaymentURLDisplay from '../PaymentURLDisplay'
import {PaymentURLData} from "@/types/conversation";

interface FinDataDisplaysProps {
    showPlaidLink: boolean;
    accountData: Account[];
    transactionData: TransactionData | null;
    showStripeConnectSetup: boolean;
    stripeConnectStatus: any;
    invoiceData: Invoice[];
    invoicePreview: InvoicePreviewData | null;
    paymentUrlData: PaymentURLData | null;
    onPlaidSuccess: (accounts: Account[]) => void;
    onPlaidError: (error: string) => void;
    onPlaidExit: () => void;
    onAccountDisconnect: (accountId: string) => void;
    onTransactionEdit: (transaction: Transaction) => void;
    onTransactionDelete: (transactionId: string) => void;
    onAddTransaction: () => void;
    onStripeConnectSuccess: (status: any) => void;
    onStripeConnectError: (error: string) => void;
    onInvoiceEdit: (invoice: Invoice) => void;
    onSendReminder: (invoice: Invoice) => void;
    onMarkPaid: (invoice: Invoice) => void;
    onCreateInvoice: () => void;
    onSendInvoice?: (invoice: Invoice) => void;
    sendMessage: (content: string) => void;
}

export function FinDataDisplays({
                                    showPlaidLink,
                                    accountData,
                                    transactionData,
                                    showStripeConnectSetup,
                                    stripeConnectStatus,
                                    invoiceData,
                                    invoicePreview,
                                    paymentUrlData,
                                    onPlaidSuccess,
                                    onPlaidError,
                                    onPlaidExit,
                                    onAccountDisconnect,
                                    onTransactionEdit,
                                    onTransactionDelete,
                                    onAddTransaction,
                                    onStripeConnectSuccess,
                                    onStripeConnectError,
                                    onInvoiceEdit,
                                    onSendReminder,
                                    onMarkPaid,
                                    onCreateInvoice,
                                    onSendInvoice,
                                    sendMessage,
                                }: FinDataDisplaysProps) {
    return (
        <>
            {showPlaidLink && (
                <PlaidChatLink
                    onSuccess={onPlaidSuccess}
                    onError={onPlaidError}
                    onExit={onPlaidExit}
                />
            )}

            {accountData.length > 0 && (
                <AccountDisplay
                    accounts={accountData}
                    onDisconnect={onAccountDisconnect}
                />
            )}

            {transactionData && (
                <TransactionDisplay
                    transactions={transactionData.transactions}
                    summary={transactionData.summary}
                    onEditTransaction={onTransactionEdit}
                    onDeleteTransaction={onTransactionDelete}
                    onAddTransaction={onAddTransaction}
                />
            )}

            {invoicePreview && (
                <InvoicePreview
                    invoice={invoicePreview}
                    onSend={(invoiceId) => sendMessage(`send invoice ${invoiceId}`)}
                    onEdit={() => {/* Handle edit if needed */}}
                    onCancel={() => {/* Handle cancel if needed */}}
                />
            )}

            {paymentUrlData && (
                    <PaymentURLDisplay
                        paymentUrl={paymentUrlData.paymentUrl}
                        invoiceId={paymentUrlData.invoiceId}
                        clientName={paymentUrlData.clientName}
                        amount={paymentUrlData.amount}
                    />
            )}


            {showStripeConnectSetup && (
                <StripeConnectSetup
                    onSuccess={onStripeConnectSuccess}
                    onError={onStripeConnectError}
                    currentStatus={stripeConnectStatus}
                />
            )}

            {invoiceData.length > 0 && (
                <InvoiceDisplay
                    key={invoiceData.map(i => i.id).join('-')}
                    invoices={invoiceData}
                    onEdit={onInvoiceEdit}
                    onSendReminder={onSendReminder}
                    onMarkPaid={onMarkPaid}
                    onCreateNew={onCreateInvoice}
                    onSendInvoice={onSendInvoice}
                />
            )}

            {stripeConnectStatus && !showStripeConnectSetup && (
                <StripeConnectStatus
                    status={stripeConnectStatus}
                    onSendMessage={sendMessage}
                />
            )}
        </>
    );
}