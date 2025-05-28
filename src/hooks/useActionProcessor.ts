import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FinAction, Account, TransactionData, Message } from '@/types/financial';
import { Invoice } from '@/components/InvoiceDisplay';
import { InvoicePreviewData } from '@/components/InvoicePreview';
import { ConversationState } from '@/types/conversation';
import { ACTION_TYPES, isValidActionType } from '@/types/actionTypes';

export const useActionProcessor = () => {
    const processedActionsRef = useRef<Set<string>>(new Set());

    const createActionId = (action: FinAction): string => {
        // Create a stable ID based on action type and key data
        const keyData = {
            type: action.type,
            id: (action.data as any)?.id || (action.data as any)?.invoice_id || (action.data as any)?.transaction_id,
            // Check if this is a response action by looking for success property at the root level or in data
            isSuccess: action.success ? 'success' : ((action.data as any)?.success ? 'success' : 'request'),
            // Use a unique identifier instead of timestamp to avoid collisions
            uniqueId: uuidv4().substring(0, 8)
        };
        return `${keyData.type}-${keyData.id || 'no-id'}-${keyData.isSuccess}-${keyData.uniqueId}`;
    };




    const processAction = (
        action: FinAction,
        setState: React.Dispatch<React.SetStateAction<ConversationState>>,
        addMessage: (message: Message) => void
    ): boolean => {
        // Import debugger dynamically to avoid SSR issues
        import('@/utils/actionDebugger').then(({ ActionDebugger }) => {
            ActionDebugger.logAction(action);
        });
        // Validate action type
        if (!isValidActionType(action.type)) {
            console.warn(`Unknown action type: ${action.type}`, action);
            return false;
        }

        // Check for duplicates
        const actionId = createActionId(action);
        if (processedActionsRef.current.has(actionId)) {
            console.log(`Skipping duplicate action: ${action.type}`, actionId);
            return false;
        }

        // Mark as processed
        processedActionsRef.current.add(actionId);

        console.log(`Processing action: ${action.type}`, { actionId, data: action.data });

        try {
            switch (action.type) {
                // Bank Connection Actions
                case ACTION_TYPES.INITIATE_PLAID_CONNECTION:
                case ACTION_TYPES.PLAID_CONNECTION_INITIATED:
                    handlePlaidConnectionInitiated(setState);
                    break;

                // Account Actions
                case ACTION_TYPES.ACCOUNTS_SHOW:
                    handleAccountsShow(action, setState);
                    break;

                // Transaction Actions
                case ACTION_TYPES.TRANSACTIONS_SHOW:
                    handleTransactionsShow(action, setState);
                    break;
                case ACTION_TYPES.TRANSACTION_CREATE_SUCCESS:
                case ACTION_TYPES.TRANSACTION_UPDATE_SUCCESS:
                case ACTION_TYPES.TRANSACTION_DELETE_SUCCESS:
                    handleTransactionSuccess(action, addMessage);
                    break;

                // Invoice Actions
                case ACTION_TYPES.INVOICE_CREATED:
                case ACTION_TYPES.INVOICE_CREATE_SUCCESS:
                    handleInvoiceCreateSuccess(action, setState);
                    break;

                case ACTION_TYPES.SEND_INVOICE:
                case ACTION_TYPES.INVOICE_SEND_SUCCESS:
                    handleInvoiceSendSuccess(action, setState);
                    break;

                case ACTION_TYPES.INVOICES_SHOW:
                    handleInvoicesShow(action, setState);
                    break;

                // Stripe Actions
                case ACTION_TYPES.STRIPE_CONNECT_SETUP_INITIATED:
                    handleStripeConnectSetup(action, setState);
                    break;
                case ACTION_TYPES.STRIPE_CONNECT_STATUS_SHOW:
                    handleStripeConnectStatus(action, setState);
                    break;
                case ACTION_TYPES.STRIPE_DASHBOARD_OPEN:
                    handleStripeDashboardOpen(action);
                    break;

                // Error Actions
                case ACTION_TYPES.INVOICE_CREATE_ERROR:
                case ACTION_TYPES.INVOICE_SEND_ERROR:
                case ACTION_TYPES.STRIPE_CONNECT_ERROR:
                case ACTION_TYPES.GENERAL_ERROR:
                    handleError(action, addMessage);
                    break;

                default:
                    console.warn(`Unhandled action type: ${action.type}`);
                    return false;
            }

            return true;
        } catch (error) {
            console.error(`Error processing action ${action.type}:`, error);
            return false;
        }
    };

    const clearProcessedActions = () => {
        processedActionsRef.current.clear();
    };

    return { processAction, clearProcessedActions };
};

// Action Handlers
const handlePlaidConnectionInitiated = (setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    setState(prev => ({ ...prev, showPlaidLink: true }));
};

const handleAccountsShow = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    const accountsData = action.data as { accounts: Account[] };
    if (accountsData.accounts) {
        setState(prev => ({ ...prev, accountData: accountsData.accounts }));
    }
};

const handleTransactionsShow = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    const transData = action.data as TransactionData;
    if (transData.transactions) {
        setState(prev => ({ ...prev, transactionData: transData }));
    }
};

const handleTransactionSuccess = (action: FinAction, addMessage: (message: Message) => void) => {
    const successMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `✅ ${action.message || 'Transaction operation completed successfully!'}`
    };
    addMessage(successMessage);
};

const handleInvoiceCreateSuccess = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    const invoiceData = action.data as any;

    if (invoiceData.invoice) {
        const previewData: InvoicePreviewData = {
            id: invoiceData.invoice.id,
            invoice_number: invoiceData.invoice.invoice_number,
            client_name: invoiceData.invoice.client_name,
            client_email: invoiceData.invoice.client_email,
            amount: invoiceData.invoice.amount,
            status: invoiceData.invoice.status,
            issue_date: invoiceData.invoice.issue_date,
            due_date: invoiceData.invoice.due_date,
            description: invoiceData.invoice.description,
            currency: invoiceData.invoice.currency,
        };

        setState(prev => ({ ...prev, invoicePreview: previewData }));
    }
};

const handleInvoiceSendSuccess = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    console.log("Processing invoice send success:", action);
    const sendData = action.data as any;

    // Defensive programming - check if sendData exists
    if (!sendData) {
        console.error('Invoice send success action missing data:', action);
        return;
    }

    // Debug the data structure
    console.log("Send data:", sendData);
    console.log("Invoice:", sendData.invoice);
    console.log("Payment URL:", sendData.stripe_invoice_url || sendData.hosted_invoice_url);

    // Create the payment URL data object
    const paymentUrlData = (sendData.stripe_invoice_url || sendData.hosted_invoice_url) ? {
        paymentUrl: sendData.stripe_invoice_url || sendData.hosted_invoice_url,
        invoiceId: sendData.invoice?.id,
        clientName: sendData.invoice?.client_name,
        amount: sendData.invoice?.amount
    } : null;

    console.log("Created paymentUrlData:", paymentUrlData);

    setState(prev => {
        // Log the current state
        console.log("Previous state:", prev);

        const updatedState = {
            ...prev,
            invoicePreview: null, // Clear the preview
            invoiceData: Array.isArray(prev.invoiceData) ? prev.invoiceData.map(inv =>
                inv.id === sendData.invoice?.id
                    ? { ...inv, status: 'pending' as const }
                    : inv
            ) : [],
            paymentUrlData: paymentUrlData
        };

        // Log the updated state
        console.log("Updated state with paymentUrlData:", updatedState.paymentUrlData);

        return updatedState;
    });
};


const handleInvoicesShow = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    const invoicesData = action.data as { invoices: Invoice[] };
    if (invoicesData.invoices) {
        setState(prev => ({
            ...prev,
            invoiceData: invoicesData.invoices,
            loading: false
        }));
    }
};

const handleStripeConnectSetup = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    setState(prev => ({
        ...prev,
        stripeConnectStatus: action.data as any,
        showStripeConnectSetup: true
    }));
};

const handleStripeConnectStatus = (action: FinAction, setState: React.Dispatch<React.SetStateAction<ConversationState>>) => {
    setState(prev => ({ ...prev, stripeConnectStatus: action.data as any }));
};

const handleStripeDashboardOpen = (action: FinAction) => {
    const dashboardData = action.data as { dashboard_url?: string };
    if (dashboardData?.dashboard_url) {
        window.open(dashboardData.dashboard_url, '_blank');
    }
};

const handleError = (action: FinAction, addMessage: (message: Message) => void) => {
    const errorData = action.data as any;
    const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `❌ ${errorData.message || action.error || 'An error occurred.'}`
    };
    addMessage(errorMessage);
};