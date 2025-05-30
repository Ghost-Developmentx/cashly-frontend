import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Account, Transaction, Message } from '@/types/financial';
import { Invoice } from '@/components/InvoiceDisplay';
import { ConversationState, StripeConnectStatus } from '@/types/conversation';
import React from "react";

interface UseFinEventHandlersProps {
    state: ConversationState;
    setState: React.Dispatch<React.SetStateAction<ConversationState>>;
    addMessage: (message: Message) => void;
    sendMessage: (content: string) => Promise<void>;
    transactionModal: {
        closeModal: () => void;
    };
}

export function useFinEventHandlers({
                                        state,
                                        setState,
                                        addMessage,
                                        sendMessage,
                                        transactionModal,
                                    }: UseFinEventHandlersProps) {
    const { getToken } = useAuth();

    const handlePlaidSuccess = (accounts: Account[]) => {
        console.log('Plaid connection successful:', accounts);
        setState((prev: ConversationState) => ({
            ...prev,
            accountData: accounts,
            showPlaidLink: false
        }));

        const successMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `🎉 Great! I've successfully connected ${accounts.length} bank account${accounts.length !== 1 ? 's' : ''} for you. I can now provide personalized financial insights based on your real transaction data!`
        };
        addMessage(successMessage);
    };

    const handlePlaidError = (errorMessage: string) => {
        console.error('Plaid connection error:', errorMessage);
        setState((prev: ConversationState) => ({
            ...prev,
            showPlaidLink: false,
            error: errorMessage
        }));

        const errorMsg: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `I'm sorry, there was an issue connecting your bank account: ${errorMessage}. Please try again or contact support if the problem persists.`
        };
        addMessage(errorMsg);
    };

    const handlePlaidExit = () => {
        console.log('Plaid connection cancelled');
        setState((prev: ConversationState) => ({ ...prev, showPlaidLink: false }));

        const cancelMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `No problem! You can connect your bank account anytime by asking me to "connect my bank account" or "link my accounts". I'm here whenever you're ready! 👍`
        };
        addMessage(cancelMessage);
    };

    const handleAccountDisconnect = async (accountId: string) => {
        try {
            const token = await getToken();
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/accounts/disconnect_account`,
                {
                    data: { account_id: accountId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                setState((prev: ConversationState) => ({
                    ...prev,
                    accountData: prev.accountData.filter((account: Account) => account.id !== accountId)
                }));

                const successMessage: Message = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: response.data.message as string
                };
                addMessage(successMessage);
            }
        } catch (error) {
            console.error('Error disconnecting account:', error);
            setState((prev: ConversationState) => ({
                ...prev,
                error: 'Failed to disconnect account'
            }));
        }
    };

    const handleTransactionDelete = async (transactionId: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const token = await getToken();
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/transactions/${transactionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                // Update transaction data
                if (state.transactionData) {
                    const updatedTransactions = state.transactionData.transactions.filter(
                        (t: Transaction) => t.id !== transactionId
                    );

                    const totalIncome = updatedTransactions
                        .filter((t: Transaction) => t.amount > 0)
                        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

                    const totalExpenses = updatedTransactions
                        .filter((t: Transaction) => t.amount < 0)
                        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);

                    setState((prev: ConversationState) => ({
                        ...prev,
                        transactionData: prev.transactionData ? {
                            ...prev.transactionData,
                            transactions: updatedTransactions,
                            summary: {
                                ...prev.transactionData.summary,
                                count: updatedTransactions.length,
                                total_income: totalIncome,
                                total_expenses: totalExpenses,
                                net_change: totalIncome - totalExpenses
                            }
                        } : null
                    }));
                }

                const successMessage: Message = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: `✅ Transaction deleted successfully!`
                };
                addMessage(successMessage);
            }
        } catch (error: unknown) {
            console.error('Error deleting transaction:', error);
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || 'Failed to delete transaction'
                : 'Failed to delete transaction';

            const errorMsg: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: `❌ ${errorMessage}`
            };
            addMessage(errorMsg);
        }
    };

    const handleTransactionSave = (savedTransaction: Transaction, isNewTransaction: boolean) => {
        if (state.transactionData) {
            let updatedTransactions: Transaction[];

            if (isNewTransaction) {
                updatedTransactions = [savedTransaction, ...state.transactionData.transactions];
            } else {
                updatedTransactions = state.transactionData.transactions.map((t: Transaction) =>
                    t.id === savedTransaction.id ? savedTransaction : t
                );
            }

            const totalIncome = updatedTransactions
                .filter((t: Transaction) => t.amount > 0)
                .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

            const totalExpenses = updatedTransactions
                .filter((t: Transaction) => t.amount < 0)
                .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);

            setState((prev: ConversationState) => ({
                ...prev,
                transactionData: prev.transactionData ? {
                    ...prev.transactionData,
                    transactions: updatedTransactions,
                    summary: {
                        ...prev.transactionData.summary,
                        count: updatedTransactions.length,
                        total_income: totalIncome,
                        total_expenses: totalExpenses,
                        net_change: totalIncome - totalExpenses
                    }
                } : null
            }));
        }

        const successMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `✅ Transaction ${isNewTransaction ? 'added' : 'updated'} successfully!`
        };
        addMessage(successMessage);

        transactionModal.closeModal();
    };

    const handleStripeConnectSuccess = (status: StripeConnectStatus) => {
        console.log('Stripe Connect setup successful:', status);
        setState((prev: ConversationState) => ({
            ...prev,
            stripeConnectStatus: status,
            showStripeConnectSetup: false
        }));

        const successMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `🎉 Excellent! Your Stripe Connect account is now ${status.can_accept_payments ? 'active and ready to accept payments' : 'set up'}! ${
                status.can_accept_payments
                    ? 'You can now send invoices and receive payments directly through Cashly.'
                    : 'Please complete the onboarding process to start accepting payments.'
            }`
        };
        addMessage(successMessage);
    };

    const handleStripeConnectError = (error: string) => {
        console.error('Stripe Connect setup error:', error);
        setState((prev: ConversationState) => ({ ...prev, showStripeConnectSetup: false }));

        const errorMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: `❌ ${error}`
        };
        addMessage(errorMessage);
    };

    const handleInvoiceEdit = (invoice: Invoice) => {
        // TODO: Implement invoice edit modal
        console.log('Edit invoice:', invoice);
    };

    const handleSendReminder = async (invoice: Invoice) => {
        const confirmMessage = `Send payment reminder to ${invoice.client_name} for invoice ${invoice.invoice_number}?`;
        if (!confirm(confirmMessage)) return;

        await sendMessage(`Send payment reminder for invoice ${invoice.id}`);
    };

    const handleMarkPaid = async (invoice: Invoice) => {
        const confirmMessage = `Mark invoice ${invoice.invoice_number} as paid?`;
        if (!confirm(confirmMessage)) return;

        await sendMessage(`Mark invoice ${invoice.id} as paid`);
    };

    const handleCreateInvoice = () => {
        // Note: sendMessage returns a Promise, but we don't need to await it here
        // since we want this to be fire-and-forget
        void sendMessage("I want to create a new invoice");
    };

    const handleSendInvoice = async (invoice: Invoice) => {
        const confirmMessage = `Send invoice ${invoice.invoice_number || `#${invoice.id}`} to ${invoice.client_name}?`;
        if (!confirm(confirmMessage)) return;

        await sendMessage(`Send invoice ${invoice.id} to ${invoice.client_name}`);
    };

    const handleDeleteInvoice = async (invoice: Invoice) => {
        const confirmMessage = `Are you sure you want to permanently delete the invoice for ${invoice.client_name}?\n\nThis will remove it from both Cashly and Stripe and cannot be undone.`;
        if (!confirm(confirmMessage)) return;

        await sendMessage(`Delete invoice ${invoice.id}`);
    };

    return {
        handlePlaidSuccess,
        handlePlaidError,
        handlePlaidExit,
        handleAccountDisconnect,
        handleTransactionDelete,
        handleTransactionSave,
        handleStripeConnectSuccess,
        handleStripeConnectError,
        handleInvoiceEdit,
        handleSendReminder,
        handleMarkPaid,
        handleCreateInvoice,
        handleSendInvoice,
        handleDeleteInvoice
    };
}