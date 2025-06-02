// src/types/conversation.ts

import {Account, TransactionData} from "@/types/financial";
import {Invoice} from "@/components/InvoiceDisplay";
import { InvoicePreviewData } from '@/components/InvoicePreview';
import { ForecastData } from '@/types/forecast';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

export interface PaymentURLData {
    paymentUrl: string;
    invoiceId?: string;
    clientName?: string;
    amount?: number;
}

export interface ConversationState {
    messages: Message[];
    loading: boolean;
    error: string | null;
    showPlaidLink: boolean;
    accountData: Account[];
    transactionData: TransactionData | null;
    invoiceData: Invoice[];
    invoicePreview: InvoicePreviewData | null;
    paymentUrlData: PaymentURLData | null;
    showStripeConnectSetup: boolean;
    stripeConnectStatus: any;
    forecastData: ForecastData | null;
}

export interface StripeConnectStatus {
    connected: boolean;
    status?: string;
    charges_enabled?: boolean;
    payouts_enabled?: boolean;
    onboarding_complete?: boolean;
    can_accept_payments?: boolean;
    platform_fee_percentage?: number;
    requirements?: Record<string, unknown>;
    showRecoveryOptions?: boolean;
    recoveryOptions?: Array<{
        action: string;
        text: string;
        description: string;
    }>;
}