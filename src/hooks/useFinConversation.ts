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
import { InvoicePreviewData } from '@/components/InvoicePreview';
import { ConversationState } from '@/types/conversation';

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
        invoicePreview: null,
        paymentUrlData: null,
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
            invoicePreview: null,
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
                    stripeConnectStatus: action.data as any, // Explicit cast to any
                    showStripeConnectSetup: true
                }));
                break;

            case 'show_stripe_connect_status':
                setState(prev => ({ ...prev, stripeConnectStatus: action.data as any }));
                break;

            case 'show_invoices':
                const invoicesData = action.data as { invoices: Invoice[] };
                if (invoicesData.invoices) {
                    setState(prev => ({
                        ...prev,
                        invoiceData: invoicesData.invoices,
                        loading: false
                    }));
                }
                break;

            case 'invoice_created':
                const invoiceData = action.data as any;

                if (invoiceData.invoice) {
                    // Create a properly typed InvoicePreviewData object
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

                    setState(prev => ({
                        ...prev,
                        invoicePreview: previewData
                    }));
                }
                break;

            case 'send_invoice':
                const sendData = action.data as any;

                // Update invoice status silently
                setState(prev => ({
                    ...prev,
                    invoicePreview: null, // Clear the preview
                    invoiceData: prev.invoiceData.map(inv =>
                        inv.id === sendData.invoice?.id
                            ? { ...inv, status: 'pending' as const }
                            : inv
                    )
                }));

                // Show payment URL component (no text message)
                if (sendData.stripe_invoice_url || sendData.hosted_invoice_url) {
                    const paymentUrl = sendData.stripe_invoice_url || sendData.hosted_invoice_url;

                    setState(prev => ({
                        ...prev,
                        paymentUrlData: {
                            paymentUrl: paymentUrl,
                            invoiceId: sendData.invoice?.id,
                            clientName: sendData.invoice?.client_name,
                            amount: sendData.invoice?.amount
                        }
                    }));
                }
                break;

            case 'invoice_marked_paid':
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

            case 'create_invoice_error':
            case 'send_invoice_error':
            case 'invoice_error':
                const errorData = action.data as any;
                const errorMessage: Message = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: `❌ ${errorData.message || action.error || 'An error occurred with your invoice.'}`
                };
                addMessage(errorMessage);
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