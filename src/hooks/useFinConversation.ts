'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
    Message,
    Account,
    TransactionData,
    FinAction,
    ApiResponse
} from '@/types/financial';
import { Invoice } from '@/components/InvoiceDisplay';

type ConversationState = {
    messages: Message[];
    loading: boolean;
    error: string | null;
    showPlaidLink: boolean;
    accountData: Account[];
    transactionData: TransactionData | null;
    invoiceData: Invoice[];
    showStripeConnectSetup: boolean;
    stripeConnectStatus: any;
};


export function useFinConversation(conversation: any) {
    const { getToken } = useAuth();

    const [state, setState] = useState<ConversationState>({
        messages: [],
        loading: false,
        error: null,
        showPlaidLink: false,
        accountData: [],
        transactionData: null,
        invoiceData: [],
        showStripeConnectSetup: false,
        stripeConnectStatus: null,
    });

    // Initialize messages from a conversation
    useEffect(() => {
        if (conversation?.messages) {
            const formattedMessages = conversation.messages.map((msg: any, index: number) => ({
                id: msg.id || `msg-${index}-${Date.now()}`,
                role: msg.role,
                content: msg.content
            }));
            setState(prev => ({ ...prev, messages: formattedMessages, error: null }));
        } else {
            setState(prev => ({ ...prev, messages: [] }));
        }
    }, [conversation]);

    const addMessage = (message: Message) => {
        setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
    };

    const updateMessages = (messages: Message[]) => {
        setState(prev => ({ ...prev, messages }));
    };

    const clearDisplays = () => {
        setState(prev => ({
            ...prev,
            accountData: [],
            transactionData: null,
            invoiceData: [],
            stripeConnectStatus: null,
            showStripeConnectSetup: false,
            showPlaidLink: false,
        }));
    };

    const sendMessage = async (content: string) => {
        const newMessage: Message = { id: uuidv4(), role: 'user', content };
        const updatedMessages = [...state.messages, newMessage];

        setState(prev => ({
            ...prev,
            messages: updatedMessages,
            loading: true,
            error: null
        }));

        clearDisplays();

        try {
            const token = await getToken();
            const res = await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/query`,
                {
                    user_id: 'me',
                    query: content,
                    conversation_history: updatedMessages.map(({ role, content }) => ({ role, content })),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const reply: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: res.data.message || 'Something went wrong, no reply received.',
            };

            setState(prev => ({
                ...prev,
                messages: [...updatedMessages, reply],
                loading: false
            }));

            // Process actions
            if (res.data.actions && Array.isArray(res.data.actions)) {
                res.data.actions.forEach((action: FinAction) => {
                    processAction(action);
                });
            }

        } catch (err: unknown) {
            console.error('Error in sendMessage:', err);

            const errorMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: 'I apologize, but I encountered an error processing your request. Please try again.'
            };

            setState(prev => ({
                ...prev,
                messages: [...updatedMessages, errorMessage],
                loading: false,
                error: 'Failed to fetch response. Please try again.',
            }));
        }
    };

    const processAction = (action: FinAction) => {
        switch (action.type) {
            case 'initiate_plaid_connection':
                setState(prev => ({ ...prev, showPlaidLink: true }));
                break;

            case 'show_accounts':
                const accountsData = action.data as { accounts: Account[] };
                if (accountsData.accounts) {
                    setState(prev => ({ ...prev, accountData: accountsData.accounts }));
                }
                break;

            case 'show_transactions':
                const transData = action.data as TransactionData;
                if (transData.transactions) {
                    setState(prev => ({ ...prev, transactionData: transData }));
                }
                break;

            case 'setup_stripe_connect':
                setState(prev => ({
                    ...prev,
                    stripeConnectStatus: action.data,
                    showStripeConnectSetup: true
                }));
                break;

            case 'show_stripe_connect_status':
                setState(prev => ({ ...prev, stripeConnectStatus: action.data }));
                break;

            case 'show_invoices':
                const invoicesData = action.data as { invoices: Invoice[] };
                if (invoicesData.invoices) {
                    setState(prev => ({
                        ...prev,
                        invoiceData: invoicesData.invoices,
                        // Clear any loading states
                        loading: false
                    }));
                }
                break;

            case 'invoice_created':
                // Extract invoice data and ID
                const invoiceData = action.data as any;
                const invoiceId = invoiceData.invoice_id || invoiceData.data?.invoice_id || invoiceData.invoice?.id;

                if (invoiceId) {
                    const successMessage: Message = {
                        id: uuidv4(),
                        role: 'assistant',
                        content: invoiceData.message || `Invoice #${invoiceId} created successfully!`
                    };
                    addMessage(successMessage);
                }

                // Refresh the invoice list if needed
                if (invoiceData.invoice) {
                    // You might want to add the new invoice to your state
                    // or trigger a refresh of the invoice list
                }
                break;

            case 'invoice_sent':
                // Update the invoice status in the state
                const sentData = action.data as any;
                if (sentData.invoice) {
                    setState(prev => ({
                        ...prev,
                        invoiceData: prev.invoiceData.map(inv =>
                            inv.id === sentData.invoice.id
                                ? { ...inv, status: 'pending' as const }
                                : inv
                        )
                    }));
                }
                break;

            case 'invoice_marked_paid':
                // Update the invoice status in the state
                const paidData = action.data as any;
                if (paidData.invoice) {
                    setState(prev => ({
                        ...prev,
                        invoiceData: prev.invoiceData.map(inv =>
                            inv.id === paidData.invoice.id
                                ? { ...inv, status: 'paid' as const }
                                : inv
                        )
                    }));
                }
                break;

            case 'open_stripe_dashboard':
                const dashboardData = action.data as { dashboard_url?: string };
                if (dashboardData?.dashboard_url) {
                    window.open(dashboardData.dashboard_url, '_blank');
                }
                break;

            default:
                console.log('Unhandled action type:', action.type);
        }
    };

    return {
        state,
        sendMessage,
        addMessage,
        updateMessages,
        setState,
    };
}